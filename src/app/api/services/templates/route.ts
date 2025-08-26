import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { serviceTemplates, serviceCategory } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { localizeServiceTemplate } from '@/lib/translations/service-templates';
import type { ServiceTemplateLocalized, ApiResponse } from '@/lib/types/professional-dashboard';

export async function GET(request: NextRequest) {
  try {
    // Get auth session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Check if user is a professional
    if (session.user.role !== 'pro') {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only professionals can access service templates',
          },
        },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('category_id');
    const language = searchParams.get('language') || 'es';

    // Build query
    let query = db
      .select({
        template: serviceTemplates,
        category: {
          id: serviceCategory.id,
          name: serviceCategory.name,
          slug: serviceCategory.slug,
        },
      })
      .from(serviceTemplates)
      .innerJoin(
        serviceCategory,
        eq(serviceTemplates.categoryId, serviceCategory.id)
      );

    // Apply filters
    const conditions = [eq(serviceTemplates.isActive, true)];
    
    if (categoryId) {
      conditions.push(eq(serviceTemplates.categoryId, categoryId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;

    // Localize templates
    const localizedTemplates = results.map(({ template, category }) => ({
      ...localizeServiceTemplate(template, language),
      category,
    }));

    return NextResponse.json<ApiResponse<ServiceTemplateLocalized[]>>(
      {
        success: true,
        data: localizedTemplates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching service templates:', error);
    
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch service templates',
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 }
    );
  }
}