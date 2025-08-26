import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { service, serviceCategory, user, franchiseTerritory, serviceTemplates } from "@/lib/schema";
import { withAuth } from "@/lib/auth-middleware";
import { eq, and, or, ilike, sql, desc, asc, gte, lte } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import type { ApiResponse, ServiceFormData } from "@/lib/types/professional-dashboard";

// GET /api/services - List services with filtering and search
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;
    
    // Search and filter parameters
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const location = searchParams.get("location"); // postal code
    const radius = parseInt(searchParams.get("radius") || "25");
    const priceUnit = searchParams.get("priceUnit");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const proId = searchParams.get("proId"); // Filter by specific professional

    // Build WHERE conditions
    const conditions = [eq(service.isActive, true)];

    if (search) {
      conditions.push(
        or(
          ilike(service.name, `%${search}%`),
          ilike(service.description, `%${search}%`)
        )!
      );
    }

    if (categoryId) {
      conditions.push(eq(service.categoryId, categoryId));
    }

    if (minPrice) {
      conditions.push(gte(service.basePrice, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(service.basePrice, maxPrice));
    }

    if (priceUnit) {
      conditions.push(eq(service.priceUnit, priceUnit as any));
    }

    if (proId) {
      conditions.push(eq(service.proId, proId));
    }

    // Build ORDER BY clause
    const orderByClause = sortOrder === "asc" 
      ? asc(service[sortBy as keyof typeof service] || service.createdAt)
      : desc(service[sortBy as keyof typeof service] || service.createdAt);

    // Execute query with joins
    const services = await db
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
          icon: serviceCategory.icon,
        },
      })
      .from(service)
      .leftJoin(user, eq(service.proId, user.id))
      .leftJoin(serviceCategory, eq(service.categoryId, serviceCategory.id))
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(service)
      .where(and(...conditions));
    
    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
};

// Validation schema for service creation
const serviceSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  categoryId: z.string(),
  templateId: z.string().optional(),
  basePrice: z.number().positive(),
  priceUnit: z.enum(['hour', 'day', 'piece', 'service', 'km']),
  duration: z.number().optional(),
  serviceRadius: z.number().min(1).max(100).default(25),
  languages: z.array(z.string()).default(['es']),
  requirements: z.string().optional(),
  bufferTime: z.number().min(0).max(120).default(0),
  maxDailyBookings: z.number().min(1).max(50).optional(),
  advanceBookingDays: z.number().min(1).max(365).default(30),
  instantBooking: z.boolean().default(false),
});

// POST /api/services - Create new service (professionals only)
export const POST = withAuth(
  async (request: NextRequest, user) => {
    try {
      // Only professionals, franchise owners, and admins can create services
      if (!["pro", "franchise", "admin"].includes(user.role)) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: "Only professionals can create services"
            }
          },
          { status: 403 }
        );
      }

      const body = await request.json();
      
      // Validate request body
      const validationResult = serviceSchema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: "Invalid input data",
              details: validationResult.error.flatten()
            }
          },
          { status: 400 }
        );
      }
      
      const data = validationResult.data;

      // Validate category exists
      const category = await db
        .select()
        .from(serviceCategory)
        .where(eq(serviceCategory.id, data.categoryId))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: 'INVALID_CATEGORY',
              message: "Invalid service category"
            }
          },
          { status: 400 }
        );
      }

      // If template is provided, fetch template details
      let templateData = null;
      if (data.templateId) {
        const template = await db
          .select()
          .from(serviceTemplates)
          .where(eq(serviceTemplates.id, data.templateId))
          .limit(1);
        
        if (template.length > 0) {
          templateData = template[0];
        }
      }

      // Create service
      const newService = {
        id: uuidv4(),
        proId: user.id,
        categoryId: data.categoryId,
        franchiseId: null, // Set by franchise logic if needed
        name: data.name.trim(),
        description: data.description.trim(),
        basePrice: data.basePrice.toFixed(2),
        priceUnit: data.priceUnit,
        duration: data.duration || templateData?.defaultDuration || null,
        serviceRadius: data.serviceRadius,
        languages: data.languages,
        requirements: data.requirements?.trim() || null,
        isActive: true,
        // New fields for professional dashboard
        templateId: data.templateId || null,
        isFromTemplate: !!data.templateId,
        bufferTime: data.bufferTime,
        maxDailyBookings: data.maxDailyBookings || null,
        advanceBookingDays: data.advanceBookingDays,
        instantBooking: data.instantBooking,
      };

      const [createdService] = await db
        .insert(service)
        .values(newService)
        .returning();

      // Fetch the complete service data with relations
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
        .where(eq(service.id, createdService.id))
        .limit(1);

      return NextResponse.json(
        { 
          message: "Service created successfully",
          service: completeService[0],
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating service:", error);
      return NextResponse.json(
        { error: "Failed to create service" },
        { status: 500 }
      );
    }
  },
  ["pro", "franchise", "admin"]
);