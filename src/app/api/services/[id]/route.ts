import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { service, serviceCategory, user, booking, review } from "@/lib/schema";
import { withAuth } from "@/lib/auth-middleware";
import { eq, and, sql } from "drizzle-orm";

// GET /api/services/[id] - Get single service with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: serviceId } = await params;

    // Get service with all related information
    const serviceData = await db
      .select({
        id: service.id,
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        priceUnit: service.priceUnit,
        duration: service.duration,
        serviceRadius: service.serviceRadius,
        languages: service.languages,
        requirements: service.requirements,
        isActive: service.isActive,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        // Professional info
        professional: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
        // Category info
        category: {
          id: serviceCategory.id,
          name: serviceCategory.name,
          slug: serviceCategory.slug,
          description: serviceCategory.description,
          icon: serviceCategory.icon,
        },
      })
      .from(service)
      .leftJoin(user, eq(service.proId, user.id))
      .leftJoin(serviceCategory, eq(service.categoryId, serviceCategory.id))
      .where(and(eq(service.id, serviceId), eq(service.isActive, true)))
      .limit(1);

    if (serviceData.length === 0) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Get service statistics
    const statsResult = await db
      .select({
        totalBookings: sql<number>`count(${booking.id})`,
        averageRating: sql<number>`avg(${review.rating})`,
        totalReviews: sql<number>`count(${review.id})`,
      })
      .from(service)
      .leftJoin(booking, eq(service.id, booking.serviceId))
      .leftJoin(review, eq(booking.id, review.bookingId))
      .where(eq(service.id, serviceId))
      .groupBy(service.id);

    const stats = statsResult[0] || {
      totalBookings: 0,
      averageRating: 0,
      totalReviews: 0,
    };

    // Get recent reviews (last 5)
    const recentReviews = await db
      .select({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        reviewer: {
          id: user.id,
          name: user.name,
        },
      })
      .from(review)
      .leftJoin(booking, eq(review.bookingId, booking.id))
      .leftJoin(user, eq(review.reviewerId, user.id))
      .where(eq(booking.serviceId, serviceId))
      .orderBy(sql`${review.createdAt} DESC`)
      .limit(5);

    return NextResponse.json({
      service: {
        ...serviceData[0],
        stats: {
          totalBookings: Number(stats.totalBookings) || 0,
          averageRating: Number(stats.averageRating) || 0,
          totalReviews: Number(stats.totalReviews) || 0,
        },
        recentReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update service
export const PUT = withAuth(
  async (request: NextRequest, user, ...args: unknown[]) => {
    const { params } = args[0] as { params: Promise<{ id: string }> };
    try {
      const { id: serviceId } = await params;

      // Check if service exists and user has permission
      const existingService = await db
        .select({
          id: service.id,
          proId: service.proId,
          name: service.name,
        })
        .from(service)
        .where(eq(service.id, serviceId))
        .limit(1);

      if (existingService.length === 0) {
        return NextResponse.json(
          { error: "Service not found" },
          { status: 404 }
        );
      }

      // Check permissions - only the professional who owns it, franchise owners, or admins can update
      const isOwner = existingService[0].proId === user.id;
      const canManage = ["franchise", "admin"].includes(user.role);

      if (!isOwner && !canManage) {
        return NextResponse.json(
          { error: "You can only update your own services" },
          { status: 403 }
        );
      }

      const body = await request.json();
      const {
        categoryId,
        name,
        description,
        basePrice,
        priceUnit,
        duration,
        serviceRadius,
        languages,
        requirements,
        isActive,
      } = body;

      // Validate category if provided
      if (categoryId) {
        const category = await db
          .select()
          .from(serviceCategory)
          .where(eq(serviceCategory.id, categoryId))
          .limit(1);

        if (category.length === 0) {
          return NextResponse.json(
            { error: "Invalid service category" },
            { status: 400 }
          );
        }
      }

      // Validate price unit if provided
      if (priceUnit) {
        const validUnits = ["hour", "day", "piece", "service", "km"];
        if (!validUnits.includes(priceUnit)) {
          return NextResponse.json(
            { error: "Invalid price unit" },
            { status: 400 }
          );
        }
      }

      // Build update object with only provided fields
      const updateData: any = {};
      
      if (categoryId) updateData.categoryId = categoryId;
      if (name) updateData.name = name.trim();
      if (description) updateData.description = description.trim();
      if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice).toFixed(2);
      if (priceUnit) updateData.priceUnit = priceUnit;
      if (duration !== undefined) updateData.duration = duration ? parseInt(duration) : null;
      if (serviceRadius !== undefined) {
        updateData.serviceRadius = Math.min(Math.max(parseInt(serviceRadius) || 25, 1), 100);
      }
      if (languages) updateData.languages = Array.isArray(languages) ? languages : ["es"];
      if (requirements !== undefined) updateData.requirements = requirements?.trim() || null;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;

      // Always update the updatedAt timestamp
      updateData.updatedAt = new Date();

      // Update service
      const [updatedService] = await db
        .update(service)
        .set(updateData)
        .where(eq(service.id, serviceId))
        .returning();

      // Fetch complete updated service data
      const completeService = await db
        .select({
          id: service.id,
          name: service.name,
          description: service.description,
          basePrice: service.basePrice,
          priceUnit: service.priceUnit,
          duration: service.duration,
          serviceRadius: service.serviceRadius,
          languages: service.languages,
          requirements: service.requirements,
          isActive: service.isActive,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
          professional: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          category: {
            id: serviceCategory.id,
            name: serviceCategory.name,
            slug: serviceCategory.slug,
          },
        })
        .from(service)
        .leftJoin(user, eq(service.proId, user.id))
        .leftJoin(serviceCategory, eq(service.categoryId, serviceCategory.id))
        .where(eq(service.id, serviceId))
        .limit(1);

      return NextResponse.json({
        message: "Service updated successfully",
        service: completeService[0],
      });
    } catch (error) {
      console.error("Error updating service:", error);
      return NextResponse.json(
        { error: "Failed to update service" },
        { status: 500 }
      );
    }
  },
  ["pro", "franchise", "admin"]
);

// DELETE /api/services/[id] - Delete service (soft delete)
export const DELETE = withAuth(
  async (request: NextRequest, user, ...args: unknown[]) => {
    const { params } = args[0] as { params: Promise<{ id: string }> };
    try {
      const { id: serviceId } = await params;

      // Check if service exists and user has permission
      const existingService = await db
        .select({
          id: service.id,
          proId: service.proId,
          name: service.name,
        })
        .from(service)
        .where(eq(service.id, serviceId))
        .limit(1);

      if (existingService.length === 0) {
        return NextResponse.json(
          { error: "Service not found" },
          { status: 404 }
        );
      }

      // Check permissions - only the professional who owns it, franchise owners, or admins can delete
      const isOwner = existingService[0].proId === user.id;
      const canManage = ["franchise", "admin"].includes(user.role);

      if (!isOwner && !canManage) {
        return NextResponse.json(
          { error: "You can only delete your own services" },
          { status: 403 }
        );
      }

      // Check if there are active bookings for this service
      const activeBookings = await db
        .select({ count: sql<number>`count(*)` })
        .from(booking)
        .where(
          and(
            eq(booking.serviceId, serviceId),
            sql`${booking.status} IN ('pending', 'confirmed', 'in_progress')`
          )
        );

      if (Number(activeBookings[0]?.count) > 0) {
        return NextResponse.json(
          { 
            error: "Cannot delete service with active bookings. Please complete or cancel all active bookings first." 
          },
          { status: 400 }
        );
      }

      // Soft delete - mark as inactive instead of actually deleting
      await db
        .update(service)
        .set({ 
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(service.id, serviceId));

      return NextResponse.json({
        message: "Service deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      return NextResponse.json(
        { error: "Failed to delete service" },
        { status: 500 }
      );
    }
  },
  ["pro", "franchise", "admin"]
);