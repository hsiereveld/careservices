import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { booking, user, service, serviceCategory } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

// Validation schemas
const createBookingSchema = z.object({
  serviceId: z.string().min(1),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  clientNotes: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1)
});

const bookingQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  clientId: z.string().optional(),
  proId: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validatedParams = bookingQuerySchema.parse(queryParams);

    // Build query conditions based on user role
    const whereConditions = [];
    
    if (session.user.role === 'client') {
      whereConditions.push(eq(booking.clientId, session.user.id));
    } else if (session.user.role === 'pro') {
      whereConditions.push(eq(booking.proId, session.user.id));
    } else if (session.user.role === 'admin') {
      // Admin can see all bookings
    } else if (session.user.role === 'franchise') {
      // TODO: Add franchise filtering when franchise relationship is established
    }

    // Add status filter
    if (validatedParams.status) {
      whereConditions.push(eq(booking.status, validatedParams.status));
    }

    // Add specific user filters (for admin/franchise views)
    if (validatedParams.clientId && (session.user.role === 'admin' || session.user.role === 'franchise')) {
      whereConditions.push(eq(booking.clientId, validatedParams.clientId));
    }
    
    if (validatedParams.proId && (session.user.role === 'admin' || session.user.role === 'franchise')) {
      whereConditions.push(eq(booking.proId, validatedParams.proId));
    }

    const bookings = await db
      .select({
        id: booking.id,
        status: booking.status,
        scheduledStart: booking.scheduledStart,
        scheduledEnd: booking.scheduledEnd,
        actualStart: booking.actualStart,
        actualEnd: booking.actualEnd,
        servicePrice: booking.servicePrice,
        platformFee: booking.platformFee,
        totalAmount: booking.totalAmount,
        clientNotes: booking.clientNotes,
        proNotes: booking.proNotes,
        address: booking.address,
        city: booking.city,
        postalCode: booking.postalCode,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        // Related data
        client: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        },
        pro: {
          id: user.id,
          name: user.name, 
          email: user.email,
          image: user.image
        },
        service: {
          id: service.id,
          name: service.name,
          description: service.description,
          basePrice: service.basePrice,
          priceUnit: service.priceUnit,
          duration: service.duration,
          category: {
            id: serviceCategory.id,
            name: serviceCategory.name,
            slug: serviceCategory.slug,
            icon: serviceCategory.icon
          }
        }
      })
      .from(booking)
      .innerJoin(user, eq(booking.clientId, user.id))
      .innerJoin(user, eq(booking.proId, user.id))  
      .innerJoin(service, eq(booking.serviceId, service.id))
      .innerJoin(serviceCategory, eq(service.categoryId, serviceCategory.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(booking.createdAt))
      .limit(validatedParams.limit)
      .offset(validatedParams.offset);

    const totalCount = await db
      .select({ count: booking.id })
      .from(booking)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return NextResponse.json({
      bookings,
      pagination: {
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        total: totalCount.length
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only clients can create bookings
    if (session.user.role !== 'client') {
      return NextResponse.json({ error: 'Only clients can create bookings' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Get service details to calculate pricing
    const serviceDetails = await db
      .select({
        id: service.id,
        proId: service.proId,
        franchiseId: service.franchiseId,
        basePrice: service.basePrice,
        priceUnit: service.priceUnit,
        duration: service.duration
      })
      .from(service)
      .where(eq(service.id, validatedData.serviceId))
      .limit(1);

    if (serviceDetails.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const serviceData = serviceDetails[0];

    // Calculate pricing (simple calculation - can be made more complex)
    const scheduledStart = new Date(validatedData.scheduledStart);
    const scheduledEnd = new Date(validatedData.scheduledEnd);
    const durationInHours = (scheduledEnd.getTime() - scheduledStart.getTime()) / (1000 * 60 * 60);
    
    const servicePrice = parseFloat(serviceData.basePrice) * durationInHours;
    const platformFeeRate = 0.15; // 15% platform fee
    const platformFee = servicePrice * platformFeeRate;
    const totalAmount = servicePrice + platformFee;

    // Create booking
    const bookingId = nanoid();
    const newBooking = await db.insert(booking).values({
      id: bookingId,
      clientId: session.user.id,
      proId: serviceData.proId,
      serviceId: validatedData.serviceId,
      franchiseId: serviceData.franchiseId,
      status: 'pending',
      scheduledStart: scheduledStart,
      scheduledEnd: scheduledEnd,
      servicePrice: servicePrice.toString(),
      platformFee: platformFee.toString(), 
      totalAmount: totalAmount.toString(),
      clientNotes: validatedData.clientNotes || null,
      address: validatedData.address,
      city: validatedData.city,
      postalCode: validatedData.postalCode,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return NextResponse.json({ 
      booking: newBooking[0],
      message: 'Booking created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}