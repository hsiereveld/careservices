import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { booking, user, service, serviceCategory } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for booking updates
const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded']).optional(),
  proNotes: z.string().optional(),
  clientNotes: z.string().optional(),
  actualStart: z.string().datetime().optional(),
  actualEnd: z.string().datetime().optional(),
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingDetails = await db
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
        clientId: booking.clientId,
        proId: booking.proId,
        // Client details
        client: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone
        },
        // Service details
        service: {
          id: service.id,
          name: service.name,
          description: service.description,
          basePrice: service.basePrice,
          priceUnit: service.priceUnit,
          duration: service.duration,
          category: serviceCategory.name
        }
      })
      .from(booking)
      .innerJoin(user, eq(booking.clientId, user.id))
      .innerJoin(service, eq(booking.serviceId, service.id))
      .innerJoin(serviceCategory, eq(service.categoryId, serviceCategory.id))
      .where(eq(booking.id, params.id))
      .limit(1);

    if (bookingDetails.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookingData = bookingDetails[0];

    // Check permissions - users can only view their own bookings (or admin/franchise)
    const canViewBooking = 
      session.user.role === 'admin' ||
      session.user.role === 'franchise' ||
      bookingData.clientId === session.user.id ||
      bookingData.proId === session.user.id;

    if (!canViewBooking) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get professional details separately (since we can't join user table twice easily)
    const proDetails = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone
      })
      .from(user)
      .where(eq(user.id, bookingData.proId))
      .limit(1);

    const response = {
      ...bookingData,
      pro: proDetails[0] || null
    };

    return NextResponse.json({ booking: response });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current booking to check permissions
    const currentBooking = await db
      .select({
        id: booking.id,
        clientId: booking.clientId,
        proId: booking.proId,
        status: booking.status
      })
      .from(booking)
      .where(eq(booking.id, params.id))
      .limit(1);

    if (currentBooking.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookingData = currentBooking[0];
    
    // Check permissions based on user role and booking ownership
    const canUpdateBooking = 
      session.user.role === 'admin' ||
      session.user.role === 'franchise' ||
      (session.user.role === 'client' && bookingData.clientId === session.user.id) ||
      (session.user.role === 'pro' && bookingData.proId === session.user.id);

    if (!canUpdateBooking) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateBookingSchema.parse(body);

    // Role-specific update permissions  
    const updateData: Record<string, any> = { updatedAt: new Date() };
    
    if (session.user.role === 'client' || session.user.role === 'admin') {
      // Clients can update their notes and reschedule (in certain conditions)
      if (validatedData.clientNotes !== undefined) updateData.clientNotes = validatedData.clientNotes;
      if (validatedData.scheduledStart && bookingData.status === 'pending') updateData.scheduledStart = new Date(validatedData.scheduledStart);
      if (validatedData.scheduledEnd && bookingData.status === 'pending') updateData.scheduledEnd = new Date(validatedData.scheduledEnd);
    }

    if (session.user.role === 'pro' || session.user.role === 'admin') {
      // Professionals can update their notes, confirm bookings, and set actual times
      if (validatedData.proNotes !== undefined) updateData.proNotes = validatedData.proNotes;
      if (validatedData.actualStart) updateData.actualStart = new Date(validatedData.actualStart);
      if (validatedData.actualEnd) updateData.actualEnd = new Date(validatedData.actualEnd);
    }

    // Status updates have specific rules
    if (validatedData.status) {
      const currentStatus = bookingData.status;
      let canUpdateStatus = false;

      switch (validatedData.status) {
        case 'confirmed':
          canUpdateStatus = currentStatus === 'pending' && 
            (session.user.role === 'pro' || session.user.role === 'admin');
          break;
        case 'in_progress':
          canUpdateStatus = currentStatus === 'confirmed' && 
            (session.user.role === 'pro' || session.user.role === 'admin');
          break;
        case 'completed':
          canUpdateStatus = currentStatus === 'in_progress' && 
            (session.user.role === 'pro' || session.user.role === 'admin');
          break;
        case 'cancelled':
          canUpdateStatus = ['pending', 'confirmed'].includes(currentStatus) &&
            (session.user.role === 'client' || session.user.role === 'pro' || session.user.role === 'admin');
          break;
        case 'refunded':
          canUpdateStatus = ['completed', 'cancelled'].includes(currentStatus) && 
            session.user.role === 'admin';
          break;
      }

      if (canUpdateStatus) {
        updateData.status = validatedData.status;
      } else {
        return NextResponse.json(
          { error: `Cannot change status from ${currentStatus} to ${validatedData.status}` },
          { status: 400 }
        );
      }
    }

    // Update booking
    const updatedBooking = await db
      .update(booking)
      .set(updateData)
      .where(eq(booking.id, params.id))
      .returning();

    return NextResponse.json({ 
      booking: updatedBooking[0],
      message: 'Booking updated successfully'
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current booking to check permissions
    const currentBooking = await db
      .select({
        id: booking.id,
        clientId: booking.clientId,
        status: booking.status
      })
      .from(booking)
      .where(eq(booking.id, params.id))
      .limit(1);

    if (currentBooking.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookingData = currentBooking[0];

    // Only allow deletion by client (cancellation) or admin, and only for pending bookings
    const canDelete = 
      (session.user.role === 'client' && bookingData.clientId === session.user.id && bookingData.status === 'pending') ||
      session.user.role === 'admin';

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Cannot delete booking. Use status update to cancel instead.' },
        { status: 403 }
      );
    }

    // Instead of hard delete, mark as cancelled
    await db
      .update(booking)
      .set({ 
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(eq(booking.id, params.id));

    return NextResponse.json({ 
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}