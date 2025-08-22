import { NextRequest, NextResponse } from "next/server";

// Spanish postal code regions with their provinces
const SPAIN_POSTAL_CODES = {
  "01": { province: "Álava", community: "País Vasco", region: "Norte" },
  "02": { province: "Albacete", community: "Castilla-La Mancha", region: "Centro" },
  "03": { province: "Alicante", community: "Comunidad Valenciana", region: "Este" },
  "04": { province: "Almería", community: "Andalucía", region: "Sur" },
  "05": { province: "Ávila", community: "Castilla y León", region: "Centro" },
  "06": { province: "Badajoz", community: "Extremadura", region: "Oeste" },
  "07": { province: "Baleares", community: "Islas Baleares", region: "Islas" },
  "08": { province: "Barcelona", community: "Cataluña", region: "Este" },
  "09": { province: "Burgos", community: "Castilla y León", region: "Centro" },
  "10": { province: "Cáceres", community: "Extremadura", region: "Oeste" },
  "11": { province: "Cádiz", community: "Andalucía", region: "Sur" },
  "12": { province: "Castellón", community: "Comunidad Valenciana", region: "Este" },
  "13": { province: "Ciudad Real", community: "Castilla-La Mancha", region: "Centro" },
  "14": { province: "Córdoba", community: "Andalucía", region: "Sur" },
  "15": { province: "A Coruña", community: "Galicia", region: "Noroeste" },
  "16": { province: "Cuenca", community: "Castilla-La Mancha", region: "Centro" },
  "17": { province: "Girona", community: "Cataluña", region: "Este" },
  "18": { province: "Granada", community: "Andalucía", region: "Sur" },
  "19": { province: "Guadalajara", community: "Castilla-La Mancha", region: "Centro" },
  "20": { province: "Gipuzkoa", community: "País Vasco", region: "Norte" },
  "21": { province: "Huelva", community: "Andalucía", region: "Sur" },
  "22": { province: "Huesca", community: "Aragón", region: "Este" },
  "23": { province: "Jaén", community: "Andalucía", region: "Sur" },
  "24": { province: "León", community: "Castilla y León", region: "Norte" },
  "25": { province: "Lleida", community: "Cataluña", region: "Este" },
  "26": { province: "La Rioja", community: "La Rioja", region: "Norte" },
  "27": { province: "Lugo", community: "Galicia", region: "Noroeste" },
  "28": { province: "Madrid", community: "Comunidad de Madrid", region: "Centro" },
  "29": { province: "Málaga", community: "Andalucía", region: "Sur" },
  "30": { province: "Murcia", community: "Región de Murcia", region: "Sureste" },
  "31": { province: "Navarra", community: "Navarra", region: "Norte" },
  "32": { province: "Ourense", community: "Galicia", region: "Noroeste" },
  "33": { province: "Asturias", community: "Asturias", region: "Norte" },
  "34": { province: "Palencia", community: "Castilla y León", region: "Norte" },
  "35": { province: "Las Palmas", community: "Canarias", region: "Islas" },
  "36": { province: "Pontevedra", community: "Galicia", region: "Noroeste" },
  "37": { province: "Salamanca", community: "Castilla y León", region: "Oeste" },
  "38": { province: "Santa Cruz de Tenerife", community: "Canarias", region: "Islas" },
  "39": { province: "Cantabria", community: "Cantabria", region: "Norte" },
  "40": { province: "Segovia", community: "Castilla y León", region: "Centro" },
  "41": { province: "Sevilla", community: "Andalucía", region: "Sur" },
  "42": { province: "Soria", community: "Castilla y León", region: "Centro" },
  "43": { province: "Tarragona", community: "Cataluña", region: "Este" },
  "44": { province: "Teruel", community: "Aragón", region: "Este" },
  "45": { province: "Toledo", community: "Castilla-La Mancha", region: "Centro" },
  "46": { province: "Valencia", community: "Comunidad Valenciana", region: "Este" },
  "47": { province: "Valladolid", community: "Castilla y León", region: "Centro" },
  "48": { province: "Bizkaia", community: "País Vasco", region: "Norte" },
  "49": { province: "Zamora", community: "Castilla y León", region: "Oeste" },
  "50": { province: "Zaragoza", community: "Aragón", region: "Este" },
  "51": { province: "Ceuta", community: "Ceuta", region: "Sur" },
  "52": { province: "Melilla", community: "Melilla", region: "Sur" },
} as const;

function validateSpanishPostalCode(postalCode: string): boolean {
  // Spanish postal codes are 5 digits: PPNNN
  // PP = Province (01-52)
  // NNN = Area within province (000-999)
  const regex = /^(0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/;
  return regex.test(postalCode);
}

function getLocationInfo(postalCode: string) {
  if (!validateSpanishPostalCode(postalCode)) {
    return null;
  }

  const provinceCode = postalCode.substring(0, 2);
  const areaCode = postalCode.substring(2, 3);
  
  const locationData = SPAIN_POSTAL_CODES[provinceCode as keyof typeof SPAIN_POSTAL_CODES];
  
  if (!locationData) {
    return null;
  }

  // Determine area type based on area code (simplified)
  let areaType = "rural";
  if (areaCode === "0") {
    areaType = "capital"; // Provincial capital
  } else if (parseInt(areaCode) <= 3) {
    areaType = "urban"; // Urban areas
  } else if (parseInt(areaCode) <= 6) {
    areaType = "suburban"; // Suburban areas
  }

  return {
    postalCode,
    province: locationData.province,
    community: locationData.community,
    region: locationData.region,
    areaCode,
    areaType,
    isValid: true,
  };
}

// GET /api/services/location/validate - Validate postal code and get location info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postalCode = searchParams.get("postalCode");

    if (!postalCode) {
      return NextResponse.json(
        { error: "postalCode parameter is required" },
        { status: 400 }
      );
    }

    const locationInfo = getLocationInfo(postalCode);

    if (!locationInfo) {
      return NextResponse.json({
        postalCode,
        isValid: false,
        error: "Invalid Spanish postal code format",
        format: "Spanish postal codes should be 5 digits (PPNNN where PP=01-52)",
      });
    }

    // Get neighboring provinces for service radius estimation
    const neighbors = getNeighboringProvinces(postalCode.substring(0, 2));

    return NextResponse.json({
      ...locationInfo,
      neighbors,
      serviceRecommendations: {
        optimalRadius: getOptimalRadius(locationInfo.areaType),
        coverageArea: getCoverageDescription(locationInfo.areaType),
      },
    });

  } catch (error) {
    console.error("Error validating location:", error);
    return NextResponse.json(
      { error: "Failed to validate location" },
      { status: 500 }
    );
  }
}

// POST /api/services/location/validate - Batch validate multiple postal codes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postalCodes } = body;

    if (!Array.isArray(postalCodes)) {
      return NextResponse.json(
        { error: "postalCodes should be an array of postal codes" },
        { status: 400 }
      );
    }

    if (postalCodes.length > 50) {
      return NextResponse.json(
        { error: "Maximum 50 postal codes per batch request" },
        { status: 400 }
      );
    }

    const results = postalCodes.map(postalCode => {
      const locationInfo = getLocationInfo(postalCode);
      return locationInfo || {
        postalCode,
        isValid: false,
        error: "Invalid postal code format",
      };
    });

    const validCodes = results.filter(r => r.isValid).length;
    const invalidCodes = results.filter(r => !r.isValid).length;

    return NextResponse.json({
      results,
      summary: {
        total: postalCodes.length,
        valid: validCodes,
        invalid: invalidCodes,
      },
    });

  } catch (error) {
    console.error("Error batch validating locations:", error);
    return NextResponse.json(
      { error: "Failed to validate locations" },
      { status: 500 }
    );
  }
}

function getNeighboringProvinces(provinceCode: string): string[] {
  // Simplified neighbor mapping - in production you'd use proper geographical data
  const neighbors: { [key: string]: string[] } = {
    "28": ["19", "45", "40", "05"], // Madrid
    "08": ["17", "25", "43", "50"], // Barcelona
    "41": ["11", "21", "14", "23"], // Sevilla
    "46": ["03", "12", "16", "44"], // Valencia
    "15": ["27", "32", "36", "33"], // A Coruña
    // Add more as needed for comprehensive coverage
  };

  return neighbors[provinceCode] || [];
}

function getOptimalRadius(areaType: string): number {
  switch (areaType) {
    case "capital":
      return 50; // Provincial capitals can serve wider areas
    case "urban":
      return 30; // Urban areas have good connectivity
    case "suburban":
      return 25; // Standard radius for suburban areas
    case "rural":
      return 15; // Rural areas may have longer travel times
    default:
      return 25;
  }
}

function getCoverageDescription(areaType: string): string {
  switch (areaType) {
    case "capital":
      return "Provincial capital with excellent transport links. Can efficiently serve surrounding metropolitan area.";
    case "urban":
      return "Urban area with good connectivity. Suitable for serving nearby towns and suburbs.";
    case "suburban":
      return "Suburban location. Standard service radius covers local area and nearby communities.";
    case "rural":
      return "Rural location. Consider travel time and costs for distant services.";
    default:
      return "Standard service area coverage.";
  }
}