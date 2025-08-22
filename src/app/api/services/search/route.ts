import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  service, 
  serviceCategory, 
  user, 
  profile, 
  franchiseTerritory, 
  franchise,
  review,
  booking
} from "@/lib/schema";
import { eq, and, or, ilike, sql, desc, gte, lte, inArray } from "drizzle-orm";

interface SearchFilters {
  query?: string;
  categoryId?: string;
  location?: string; // postal code or city
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  priceUnit?: string;
  languages?: string[];
  minRating?: number;
  availableDate?: string;
  sortBy?: 'price' | 'rating' | 'distance' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

// GET /api/services/search - Advanced service search and matching
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const filters: SearchFilters = {
      query: searchParams.get("q") || searchParams.get("query") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      location: searchParams.get("location") || undefined,
      radius: parseInt(searchParams.get("radius") || "25"),
      minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
      priceUnit: searchParams.get("priceUnit") || undefined,
      languages: searchParams.get("languages")?.split(",") || undefined,
      minRating: searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined,
      availableDate: searchParams.get("availableDate") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "relevance",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
    };

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50); // Max 50 per page
    const offset = (page - 1) * limit;

    // Build complex search query with relevance scoring
    let baseQuery = db
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
        
        // Professional profile for location
        professionalProfile: {
          city: profile.city,
          postalCode: profile.postalCode,
          province: profile.province,
        },
        
        // Category info
        category: {
          id: serviceCategory.id,
          name: serviceCategory.name,
          slug: serviceCategory.slug,
          icon: serviceCategory.icon,
        },
        
        // Franchise info
        franchise: {
          id: franchise.id,
          name: franchise.name,
          region: franchise.region,
        },
        
        // Calculated fields for search relevance
        averageRating: sql<number>`COALESCE(AVG(${review.rating}), 0)`,
        totalReviews: sql<number>`COUNT(DISTINCT ${review.id})`,
        totalBookings: sql<number>`COUNT(DISTINCT ${booking.id})`,
        
        // Relevance score calculation
        relevanceScore: sql<number>`
          CASE 
            WHEN ${filters.query} IS NULL THEN 0
            ELSE (
              CASE WHEN LOWER(${service.name}) ILIKE LOWER('%${filters.query || ''}%') THEN 10 ELSE 0 END +
              CASE WHEN LOWER(${service.description}) ILIKE LOWER('%${filters.query || ''}%') THEN 5 ELSE 0 END +
              CASE WHEN LOWER(${serviceCategory.name}) ILIKE LOWER('%${filters.query || ''}%') THEN 8 ELSE 0 END +
              CASE WHEN ${service.basePrice}::numeric BETWEEN 0 AND 100 THEN 2 ELSE 0 END
            )
          END
        `,
      })
      .from(service)
      .leftJoin(user, eq(service.proId, user.id))
      .leftJoin(profile, eq(user.id, profile.userId))
      .leftJoin(serviceCategory, eq(service.categoryId, serviceCategory.id))
      .leftJoin(franchise, eq(service.franchiseId, franchise.id))
      .leftJoin(booking, and(
        eq(service.id, booking.serviceId),
        eq(booking.status, 'completed')
      ))
      .leftJoin(review, eq(booking.id, review.bookingId));

    // Build WHERE conditions
    const conditions = [eq(service.isActive, true)];

    // Text search
    if (filters.query) {
      conditions.push(
        or(
          ilike(service.name, `%${filters.query}%`),
          ilike(service.description, `%${filters.query}%`),
          ilike(serviceCategory.name, `%${filters.query}%`)
        )!
      );
    }

    // Category filter
    if (filters.categoryId) {
      conditions.push(eq(service.categoryId, filters.categoryId));
    }

    // Price range filters
    if (filters.minPrice !== undefined) {
      conditions.push(gte(service.basePrice, filters.minPrice.toString()));
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(service.basePrice, filters.maxPrice.toString()));
    }

    // Price unit filter
    if (filters.priceUnit) {
      conditions.push(eq(service.priceUnit, filters.priceUnit as any));
    }

    // Language filter
    if (filters.languages && filters.languages.length > 0) {
      // This checks if any of the requested languages are in the service's language array
      conditions.push(
        sql`${service.languages} && ${JSON.stringify(filters.languages)}`
      );
    }

    // Location-based filtering
    let locationConditions = [];
    if (filters.location) {
      // Search in professional's location or franchise territories
      locationConditions.push(
        or(
          ilike(profile.city, `%${filters.location}%`),
          ilike(profile.postalCode, `%${filters.location}%`),
          ilike(profile.province, `%${filters.location}%`)
        )!
      );

      // Also check if service radius covers the requested location
      // This is a simplified check - in production you'd want actual geocoding
      if (filters.radius) {
        conditions.push(gte(service.serviceRadius, filters.radius));
      }
    }

    if (locationConditions.length > 0) {
      conditions.push(or(...locationConditions)!);
    }

    // Apply WHERE conditions
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions));
    }

    // Add GROUP BY for aggregated fields
    baseQuery = baseQuery.groupBy(
      service.id,
      user.id,
      profile.id,
      serviceCategory.id,
      franchise.id
    );

    // Apply HAVING clause for rating filter
    if (filters.minRating !== undefined) {
      baseQuery = baseQuery.having(
        gte(sql`AVG(${review.rating})`, filters.minRating)
      );
    }

    // Apply sorting
    let orderByClause;
    switch (filters.sortBy) {
      case 'price':
        orderByClause = filters.sortOrder === 'asc' 
          ? sql`${service.basePrice}::numeric ASC`
          : sql`${service.basePrice}::numeric DESC`;
        break;
      case 'rating':
        orderByClause = filters.sortOrder === 'asc'
          ? sql`AVG(${review.rating}) ASC`
          : sql`AVG(${review.rating}) DESC`;
        break;
      case 'distance':
        // In a real implementation, you'd calculate actual distance
        // For now, we'll use service radius as a proxy
        orderByClause = filters.sortOrder === 'asc'
          ? sql`${service.serviceRadius} ASC`
          : sql`${service.serviceRadius} DESC`;
        break;
      case 'relevance':
      default:
        orderByClause = sql`relevanceScore DESC, AVG(${review.rating}) DESC, ${service.createdAt} DESC`;
        break;
    }

    // Execute the main query
    const services = await baseQuery
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const countQuery = db
      .select({ count: sql<number>`count(DISTINCT ${service.id})` })
      .from(service)
      .leftJoin(user, eq(service.proId, user.id))
      .leftJoin(profile, eq(user.id, profile.userId))
      .leftJoin(serviceCategory, eq(service.categoryId, serviceCategory.id))
      .leftJoin(franchise, eq(service.franchiseId, franchise.id))
      .leftJoin(booking, and(
        eq(service.id, booking.serviceId),
        eq(booking.status, 'completed')
      ))
      .leftJoin(review, eq(booking.id, review.bookingId));

    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }

    if (filters.minRating !== undefined) {
      countQuery.groupBy(service.id)
        .having(gte(sql`AVG(${review.rating})`, filters.minRating));
    }

    const totalResult = await countQuery;
    const total = totalResult[0]?.count || 0;

    // Get popular categories for this search
    const popularCategories = await db
      .select({
        id: serviceCategory.id,
        name: serviceCategory.name,
        slug: serviceCategory.slug,
        serviceCount: sql<number>`COUNT(DISTINCT ${service.id})`,
      })
      .from(serviceCategory)
      .leftJoin(service, eq(serviceCategory.id, service.categoryId))
      .where(eq(service.isActive, true))
      .groupBy(serviceCategory.id)
      .orderBy(desc(sql`COUNT(DISTINCT ${service.id})`))
      .limit(10);

    return NextResponse.json({
      services: services.map(service => ({
        ...service,
        averageRating: Number(service.averageRating) || 0,
        totalReviews: Number(service.totalReviews) || 0,
        totalBookings: Number(service.totalBookings) || 0,
        relevanceScore: Number(service.relevanceScore) || 0,
      })),
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
      filters: filters,
      popularCategories: popularCategories.map(cat => ({
        ...cat,
        serviceCount: Number(cat.serviceCount) || 0,
      })),
    });

  } catch (error) {
    console.error("Error searching services:", error);
    return NextResponse.json(
      { error: "Failed to search services" },
      { status: 500 }
    );
  }
}