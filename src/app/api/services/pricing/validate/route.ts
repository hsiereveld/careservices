import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-middleware";

// Pricing validation rules
const PRICING_RULES = {
  hour: {
    min: 5,
    max: 500,
    description: "Hourly rate in EUR"
  },
  day: {
    min: 50,
    max: 2000,
    description: "Daily rate in EUR"
  },
  piece: {
    min: 1,
    max: 10000,
    description: "Per item/piece rate in EUR"
  },
  service: {
    min: 10,
    max: 5000,
    description: "Flat service fee in EUR"
  },
  km: {
    min: 0.1,
    max: 50,
    description: "Per kilometer rate in EUR"
  },
} as const;

const CATEGORY_PRICING_GUIDELINES = {
  // Common service categories with their typical price ranges
  "cleaning": {
    hour: { min: 15, max: 35, recommended: 22 },
    service: { min: 25, max: 200, recommended: 60 }
  },
  "handyman": {
    hour: { min: 20, max: 50, recommended: 30 },
    service: { min: 50, max: 500, recommended: 120 }
  },
  "gardening": {
    hour: { min: 15, max: 40, recommended: 25 },
    day: { min: 120, max: 300, recommended: 200 }
  },
  "tutoring": {
    hour: { min: 10, max: 80, recommended: 25 },
    service: { min: 20, max: 200, recommended: 50 }
  },
  "pet-care": {
    hour: { min: 8, max: 25, recommended: 15 },
    day: { min: 25, max: 100, recommended: 50 },
    service: { min: 10, max: 150, recommended: 30 }
  },
  "delivery": {
    km: { min: 0.5, max: 5, recommended: 1.5 },
    service: { min: 5, max: 100, recommended: 15 }
  },
} as const;

interface PricingValidationRequest {
  basePrice: number;
  priceUnit: keyof typeof PRICING_RULES;
  categorySlug?: string;
  duration?: number;
  serviceRadius?: number;
}

interface PricingValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: {
    recommendedPrice?: number;
    competitiveRange?: {
      min: number;
      max: number;
    };
    marketAnalysis?: string;
  };
  rules: {
    unit: string;
    min: number;
    max: number;
    description: string;
  };
}

// POST /api/services/pricing/validate - Validate service pricing
export const POST = withAuth(
  async (request: NextRequest, user) => {
    try {
      if (!["pro", "franchise", "admin"].includes(user.role)) {
        return NextResponse.json(
          { error: "Only professionals can validate pricing" },
          { status: 403 }
        );
      }

      const body = await request.json();
      const { 
        basePrice, 
        priceUnit, 
        categorySlug, 
        duration,
        serviceRadius 
      }: PricingValidationRequest = body;

      // Validate required fields
      if (basePrice === undefined || !priceUnit) {
        return NextResponse.json(
          { error: "basePrice and priceUnit are required" },
          { status: 400 }
        );
      }

      const price = parseFloat(basePrice.toString());
      const response: PricingValidationResponse = {
        isValid: true,
        errors: [],
        warnings: [],
        suggestions: {},
        rules: {
          unit: priceUnit,
          min: PRICING_RULES[priceUnit].min,
          max: PRICING_RULES[priceUnit].max,
          description: PRICING_RULES[priceUnit].description,
        },
      };

      // Basic price validation
      if (isNaN(price) || price <= 0) {
        response.isValid = false;
        response.errors.push("Price must be a positive number");
      }

      // Unit-specific validation
      if (price < PRICING_RULES[priceUnit].min) {
        response.isValid = false;
        response.errors.push(
          `Price is below minimum (${PRICING_RULES[priceUnit].min} EUR) for ${priceUnit} pricing`
        );
      }

      if (price > PRICING_RULES[priceUnit].max) {
        response.isValid = false;
        response.errors.push(
          `Price is above maximum (${PRICING_RULES[priceUnit].max} EUR) for ${priceUnit} pricing`
        );
      }

      // Category-specific guidelines
      if (categorySlug && CATEGORY_PRICING_GUIDELINES[categorySlug as keyof typeof CATEGORY_PRICING_GUIDELINES]) {
        const guidelines = CATEGORY_PRICING_GUIDELINES[categorySlug as keyof typeof CATEGORY_PRICING_GUIDELINES];
        const unitGuidelines = guidelines[priceUnit as keyof typeof guidelines];

        if (unitGuidelines) {
          response.suggestions.recommendedPrice = unitGuidelines.recommended;
          response.suggestions.competitiveRange = {
            min: unitGuidelines.min,
            max: unitGuidelines.max,
          };

          // Provide warnings for prices outside competitive range
          if (price < unitGuidelines.min) {
            response.warnings.push(
              `Price is below market average (${unitGuidelines.min}-${unitGuidelines.max} EUR) for ${categorySlug} services`
            );
          } else if (price > unitGuidelines.max) {
            response.warnings.push(
              `Price is above market average (${unitGuidelines.min}-${unitGuidelines.max} EUR) for ${categorySlug} services`
            );
          }

          // Market analysis
          if (price < unitGuidelines.recommended * 0.8) {
            response.suggestions.marketAnalysis = "Your price is significantly below market rate. Consider if this reflects your service quality and experience.";
          } else if (price > unitGuidelines.recommended * 1.3) {
            response.suggestions.marketAnalysis = "Your price is above market rate. Ensure you can justify this with superior quality, experience, or unique value proposition.";
          } else {
            response.suggestions.marketAnalysis = "Your price is within the competitive range for this category.";
          }
        }
      }

      // Duration-based validation for hourly services
      if (priceUnit === "hour" && duration) {
        const estimatedCost = price * (duration / 60);
        if (estimatedCost < 20) {
          response.warnings.push(
            `Based on ${duration} minutes duration, total service cost would be ${estimatedCost.toFixed(2)} EUR. Consider setting a minimum service charge.`
          );
        }
      }

      // Service radius validation
      if (serviceRadius && (serviceRadius < 1 || serviceRadius > 100)) {
        response.warnings.push("Service radius should be between 1-100 km for optimal booking opportunities");
      }

      // Travel cost suggestions for services with large radius
      if (priceUnit !== "km" && serviceRadius && serviceRadius > 25) {
        response.suggestions.marketAnalysis = 
          (response.suggestions.marketAnalysis || "") + 
          " Consider adding travel charges for services beyond 25km radius.";
      }

      return NextResponse.json(response);

    } catch (error) {
      console.error("Error validating pricing:", error);
      return NextResponse.json(
        { error: "Failed to validate pricing" },
        { status: 500 }
      );
    }
  },
  ["pro", "franchise", "admin"]
);

// GET /api/services/pricing/validate - Get pricing guidelines
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const priceUnit = searchParams.get("unit") as keyof typeof PRICING_RULES | null;

    const response: any = {
      rules: PRICING_RULES,
      categoryGuidelines: CATEGORY_PRICING_GUIDELINES,
    };

    // Filter by specific category if requested
    if (categorySlug && CATEGORY_PRICING_GUIDELINES[categorySlug as keyof typeof CATEGORY_PRICING_GUIDELINES]) {
      response.specificGuidelines = {
        category: categorySlug,
        pricing: CATEGORY_PRICING_GUIDELINES[categorySlug as keyof typeof CATEGORY_PRICING_GUIDELINES],
      };
    }

    // Filter by specific price unit if requested
    if (priceUnit && PRICING_RULES[priceUnit]) {
      response.unitRules = {
        unit: priceUnit,
        rules: PRICING_RULES[priceUnit],
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching pricing guidelines:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing guidelines" },
      { status: 500 }
    );
  }
};