import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceCategory, service } from "@/lib/schema";
import { withAuth } from "@/lib/auth-middleware";
import { eq, sql, asc, desc, ilike } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/service-categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const search = searchParams.get("search");
    const withStats = searchParams.get("withStats") === "true";
    
    // Build WHERE conditions
    const conditions = [];
    if (!includeInactive) {
      conditions.push(eq(serviceCategory.isActive, true));
    }
    
    if (search) {
      conditions.push(ilike(serviceCategory.name, `%${search}%`));
    }

    let query = db
      .select({
        id: serviceCategory.id,
        name: serviceCategory.name,
        slug: serviceCategory.slug,
        description: serviceCategory.description,
        icon: serviceCategory.icon,
        isActive: serviceCategory.isActive,
        sortOrder: serviceCategory.sortOrder,
        createdAt: serviceCategory.createdAt,
        updatedAt: serviceCategory.updatedAt,
        ...(withStats && {
          serviceCount: sql<number>`count(${service.id})`,
        }),
      })
      .from(serviceCategory);

    if (withStats) {
      query = query
        .leftJoin(service, eq(serviceCategory.id, service.categoryId))
        .groupBy(serviceCategory.id);
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : sql`${conditions.join(' AND ')}`);
    }

    const categories = await query.orderBy(
      asc(serviceCategory.sortOrder),
      asc(serviceCategory.name)
    );

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch service categories" },
      { status: 500 }
    );
  }
}

// POST /api/service-categories - Create new category (admin/franchise only)
export const POST = withAuth(
  async (request: NextRequest, user) => {
    try {
      // Only franchise owners and admins can create categories
      if (!["franchise", "admin"].includes(user.role)) {
        return NextResponse.json(
          { error: "Insufficient permissions to create service categories" },
          { status: 403 }
        );
      }

      const body = await request.json();
      const { name, slug, description, icon, sortOrder = 0 } = body;

      // Validate required fields
      if (!name || !slug) {
        return NextResponse.json(
          { error: "Name and slug are required" },
          { status: 400 }
        );
      }

      // Check if slug already exists
      const existingCategory = await db
        .select()
        .from(serviceCategory)
        .where(eq(serviceCategory.slug, slug.toLowerCase()))
        .limit(1);

      if (existingCategory.length > 0) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 409 }
        );
      }

      // Create category
      const newCategory = {
        id: uuidv4(),
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: true,
      };

      const [createdCategory] = await db
        .insert(serviceCategory)
        .values(newCategory)
        .returning();

      return NextResponse.json(
        {
          message: "Service category created successfully",
          category: createdCategory,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating service category:", error);
      return NextResponse.json(
        { error: "Failed to create service category" },
        { status: 500 }
      );
    }
  },
  ["franchise", "admin"]
);