import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceCategory, service, user } from "@/lib/schema";
import { withAuth } from "@/lib/auth-middleware";
import { eq, and, sql } from "drizzle-orm";

// GET /api/service-categories/[id] - Get single category with services
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: categoryId } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const includeServices = searchParams.get("includeServices") === "true";

    // Get category details
    const categoryData = await db
      .select()
      .from(serviceCategory)
      .where(eq(serviceCategory.id, categoryId))
      .limit(1);

    if (categoryData.length === 0) {
      return NextResponse.json(
        { error: "Service category not found" },
        { status: 404 }
      );
    }

    const category = categoryData[0];

    // Get category statistics
    const statsResult = await db
      .select({
        totalServices: sql<number>`count(${service.id})`,
        activeServices: sql<number>`sum(case when ${service.isActive} = true then 1 else 0 end)`,
      })
      .from(service)
      .where(eq(service.categoryId, categoryId));

    const stats = statsResult[0] || {
      totalServices: 0,
      activeServices: 0,
    };

    let services = [];
    if (includeServices) {
      // Get services in this category
      services = await db
        .select({
          id: service.id,
          name: service.name,
          description: service.description,
          basePrice: service.basePrice,
          priceUnit: service.priceUnit,
          duration: service.duration,
          serviceRadius: service.serviceRadius,
          languages: service.languages,
          isActive: service.isActive,
          createdAt: service.createdAt,
          professional: {
            id: user.id,
            name: user.name,
            isVerified: user.isVerified,
          },
        })
        .from(service)
        .leftJoin(user, eq(service.proId, user.id))
        .where(and(eq(service.categoryId, categoryId), eq(service.isActive, true)))
        .orderBy(service.createdAt);
    }

    return NextResponse.json({
      category: {
        ...category,
        stats: {
          totalServices: Number(stats.totalServices) || 0,
          activeServices: Number(stats.activeServices) || 0,
        },
        ...(includeServices && { services }),
      },
    });
  } catch (error) {
    console.error("Error fetching service category:", error);
    return NextResponse.json(
      { error: "Failed to fetch service category" },
      { status: 500 }
    );
  }
}

// PUT /api/service-categories/[id] - Update category
export const PUT = withAuth(
  async (request: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id: categoryId } = await params;

      // Only franchise owners and admins can update categories
      if (!["franchise", "admin"].includes(user.role)) {
        return NextResponse.json(
          { error: "Insufficient permissions to update service categories" },
          { status: 403 }
        );
      }

      // Check if category exists
      const existingCategory = await db
        .select()
        .from(serviceCategory)
        .where(eq(serviceCategory.id, categoryId))
        .limit(1);

      if (existingCategory.length === 0) {
        return NextResponse.json(
          { error: "Service category not found" },
          { status: 404 }
        );
      }

      const body = await request.json();
      const { name, slug, description, icon, sortOrder, isActive } = body;

      // If slug is being updated, check for conflicts
      if (slug && slug !== existingCategory[0].slug) {
        const conflictingCategory = await db
          .select()
          .from(serviceCategory)
          .where(eq(serviceCategory.slug, slug.toLowerCase()))
          .limit(1);

        if (conflictingCategory.length > 0) {
          return NextResponse.json(
            { error: "A category with this slug already exists" },
            { status: 409 }
          );
        }
      }

      // Build update object with only provided fields
      const updateData: any = {};
      
      if (name) updateData.name = name.trim();
      if (slug) updateData.slug = slug.toLowerCase().trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (icon !== undefined) updateData.icon = icon?.trim() || null;
      if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder) || 0;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;

      // Always update the updatedAt timestamp
      updateData.updatedAt = new Date();

      // Update category
      const [updatedCategory] = await db
        .update(serviceCategory)
        .set(updateData)
        .where(eq(serviceCategory.id, categoryId))
        .returning();

      return NextResponse.json({
        message: "Service category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      console.error("Error updating service category:", error);
      return NextResponse.json(
        { error: "Failed to update service category" },
        { status: 500 }
      );
    }
  },
  ["franchise", "admin"]
);

// DELETE /api/service-categories/[id] - Delete category
export const DELETE = withAuth(
  async (request: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id: categoryId } = await params;

      // Only admins can delete categories
      if (user.role !== "admin") {
        return NextResponse.json(
          { error: "Only administrators can delete service categories" },
          { status: 403 }
        );
      }

      // Check if category exists
      const existingCategory = await db
        .select()
        .from(serviceCategory)
        .where(eq(serviceCategory.id, categoryId))
        .limit(1);

      if (existingCategory.length === 0) {
        return NextResponse.json(
          { error: "Service category not found" },
          { status: 404 }
        );
      }

      // Check if there are services using this category
      const servicesCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(service)
        .where(eq(service.categoryId, categoryId));

      if (Number(servicesCount[0]?.count) > 0) {
        return NextResponse.json(
          { 
            error: "Cannot delete category that has associated services. Please move or delete all services first." 
          },
          { status: 400 }
        );
      }

      // Delete category
      await db
        .delete(serviceCategory)
        .where(eq(serviceCategory.id, categoryId));

      return NextResponse.json({
        message: "Service category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting service category:", error);
      return NextResponse.json(
        { error: "Failed to delete service category" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);