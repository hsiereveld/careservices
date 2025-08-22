import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  service, 
  serviceCategory, 
  user, 
  profile, 
  franchiseTerritory,
  franchise 
} from "@/lib/schema";
import { eq, and, or, sql, gte } from "drizzle-orm";

// Spanish postal code regions for location matching
const SPAIN_POSTAL_REGIONS = {
  "01": "Álava", "02": "Albacete", "03": "Alicante", "04": "Almería",
  "05": "Ávila", "06": "Badajoz", "07": "Baleares", "08": "Barcelona",
  "09": "Burgos", "10": "Cáceres", "11": "Cádiz", "12": "Castellón",
  "13": "Ciudad Real", "14": "Córdoba", "15": "A Coruña", "16": "Cuenca",
  "17": "Girona", "18": "Granada", "19": "Guadalajara", "20": "Gipuzkoa",
  "21": "Huelva", "22": "Huesca", "23": "Jaén", "24": "León",
  "25": "Lleida", "26": "La Rioja", "27": "Lugo", "28": "Madrid",
  "29": "Málaga", "30": "Murcia", "31": "Navarra", "32": "Ourense",
  "33": "Asturias", "34": "Palencia", "35": "Las Palmas", "36": "Pontevedra",
  "37": "Salamanca", "38": "Santa Cruz de Tenerife", "39": "Cantabria",
  "40": "Segovia", "41": "Sevilla", "42": "Soria", "43": "Tarragona",
  "44": "Teruel", "45": "Toledo", "46": "Valencia", "47": "Valladolid",
  "48": "Bizkaia", "49": "Zamora", "50": "Zaragoza", "51": "Ceuta", "52": "Melilla"
};

// Simple distance approximation for Spanish postal codes
function approximateDistance(postal1: string, postal2: string): number {
  if (!postal1 || !postal2) return 999;
  
  const region1 = postal1.substring(0, 2);
  const region2 = postal2.substring(0, 2);
  
  // Same province - close distance
  if (region1 === region2) {
    const area1 = parseInt(postal1.substring(2, 3));
    const area2 = parseInt(postal2.substring(2, 3));
    return Math.abs(area1 - area2) * 5; // ~5km per area difference
  }
  
  // Different provinces - estimate based on geographical proximity
  // This is simplified - in production you'd use proper geocoding
  const proximityMap: { [key: string]: string[] } = {
    "28": ["19", "45", "40", "05"], // Madrid neighbors
    "08": ["17", "25", "43", "50"], // Barcelona neighbors  
    "41": ["11", "21", "14", "23"], // Sevilla neighbors
    // Add more as needed
  };
  
  if (proximityMap[region1]?.includes(region2)) {
    return 50; // Adjacent provinces ~50km
  }
  
  return 150; // Default distance for non-adjacent provinces
}

// GET /api/services/location/available - Get services available in a location
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location"); // postal code or city
    const radius = parseInt(searchParams.get("radius") || "25");
    const categoryId = searchParams.get("categoryId");
    const includeStats = searchParams.get("includeStats") === "true";

    if (!location) {
      return NextResponse.json(
        { error: "Location parameter is required" },
        { status: 400 }
      );
    }

    // Build the main query with location-based filtering
    let query = db
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
        createdAt: service.createdAt,
        
        // Professional info
        professional: {
          id: user.id,
          name: user.name,
          isVerified: user.isVerified,
        },
        
        // Professional location
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
        
        // Franchise territory info
        franchiseTerritory: {
          franchiseId: franchiseTerritory.franchiseId,
          postalCode: franchiseTerritory.postalCode,
          city: franchiseTerritory.city,
          province: franchiseTerritory.province,
        },
        
        // Distance approximation
        estimatedDistance: sql<number>`
          CASE 
            WHEN ${profile.postalCode} IS NOT NULL AND ${profile.postalCode} != '' THEN
              CASE 
                WHEN SUBSTRING(${profile.postalCode}, 1, 2) = SUBSTRING(${location}, 1, 2) THEN
                  ABS(CAST(SUBSTRING(${profile.postalCode}, 3, 1) AS INTEGER) - 
                      CAST(SUBSTRING(${location}, 3, 1) AS INTEGER)) * 5
                ELSE 50
              END
            ELSE 999
          END
        `,
      })
      .from(service)
      .leftJoin(user, eq(service.proId, user.id))
      .leftJoin(profile, eq(user.id, profile.userId))
      .leftJoin(serviceCategory, eq(service.categoryId, serviceCategory.id))
      .leftJoin(franchiseTerritory, eq(service.franchiseId, franchiseTerritory.franchiseId));

    // Build WHERE conditions
    const conditions = [eq(service.isActive, true)];

    // Filter by category if specified
    if (categoryId) {
      conditions.push(eq(service.categoryId, categoryId));
    }

    // Location-based filtering
    const locationConditions = [];

    // Check if the service's professional is in the same area
    if (location.length >= 2) {
      const postalPrefix = location.substring(0, 2);
      locationConditions.push(
        sql`SUBSTRING(${profile.postalCode}, 1, 2) = ${postalPrefix}`
      );
    }

    // Check if service covers the requested area through franchise territories
    locationConditions.push(
      or(
        eq(franchiseTerritory.postalCode, location),
        sql`${franchiseTerritory.city} ILIKE '%${location}%'`
      )!
    );

    // Check if the service radius covers the location
    locationConditions.push(
      sql`${service.serviceRadius} >= 
          CASE 
            WHEN ${profile.postalCode} IS NOT NULL AND ${profile.postalCode} != '' THEN
              CASE 
                WHEN SUBSTRING(${profile.postalCode}, 1, 2) = SUBSTRING(${location}, 1, 2) THEN
                  ABS(CAST(SUBSTRING(${profile.postalCode}, 3, 1) AS INTEGER) - 
                      CAST(SUBSTRING(${location}, 3, 1) AS INTEGER)) * 5
                ELSE 50
              END
            ELSE 999
          END`
    );

    if (locationConditions.length > 0) {
      conditions.push(or(...locationConditions)!);
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Order by estimated distance and service quality
    const services = await query
      .orderBy(
        sql`estimatedDistance ASC`,
        sql`${service.createdAt} DESC`
      )
      .limit(50);

    // Post-process to filter by actual distance if needed
    const filteredServices = services.filter(service => {
      if (!service.professionalProfile.postalCode) return true;
      
      const distance = approximateDistance(
        service.professionalProfile.postalCode,
        location
      );
      
      return distance <= Math.max(service.serviceRadius, radius);
    });

    // Get location statistics if requested
    let locationStats = {};
    if (includeStats) {
      const totalServices = filteredServices.length;
      const categories = [...new Set(filteredServices.map(s => s.category.name))];
      const avgPrice = filteredServices.reduce((sum, s) => sum + parseFloat(s.basePrice), 0) / totalServices || 0;
      const professionals = [...new Set(filteredServices.map(s => s.professional.id))];

      locationStats = {
        totalServices,
        availableCategories: categories.length,
        averagePrice: Math.round(avgPrice * 100) / 100,
        totalProfessionals: professionals.length,
        serviceRadius: radius,
        coverage: {
          postalCode: location,
          region: SPAIN_POSTAL_REGIONS[location.substring(0, 2)] || "Unknown",
        },
      };
    }

    // Get popular categories in this location
    const categoryStats = filteredServices.reduce((acc: any, service) => {
      const categoryName = service.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          id: service.category.id,
          name: categoryName,
          slug: service.category.slug,
          icon: service.category.icon,
          count: 0,
        };
      }
      acc[categoryName].count++;
      return acc;
    }, {});

    const popularCategories = Object.values(categoryStats)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      services: filteredServices.map(service => ({
        ...service,
        estimatedDistance: Number(service.estimatedDistance) || 999,
        isInServiceRadius: service.estimatedDistance <= service.serviceRadius,
      })),
      location: {
        query: location,
        radius,
        region: SPAIN_POSTAL_REGIONS[location.substring(0, 2)] || "Unknown region",
      },
      ...(includeStats && { stats: locationStats }),
      popularCategories,
    });

  } catch (error) {
    console.error("Error fetching location services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services for location" },
      { status: 500 }
    );
  }
}