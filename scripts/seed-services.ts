#!/usr/bin/env tsx
/**
 * Seed Script for Service Categories and Templates
 * Run with: npx tsx scripts/seed-services.ts
 */

import { db } from '../src/lib/db';
import { serviceCategory } from '../src/lib/schema';
import { serviceCategories } from '../src/lib/seeds/service-categories';
import { serviceTemplates } from '../src/lib/seeds/service-templates';
import { v4 as uuidv4 } from 'uuid';

async function seedCategories() {
  console.log('🌱 Seeding service categories...');
  
  for (const category of serviceCategories) {
    try {
      // Check if category already exists
      const existing = await db
        .select()
        .from(serviceCategory)
        .where(eq(serviceCategory.id, category.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(serviceCategory).values({
          ...category,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Added category: ${category.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`);
      }
    } catch (error) {
      console.error(`❌ Error adding category ${category.name}:`, error);
    }
  }
}

async function createServiceTemplatesTable() {
  console.log('📋 Creating service templates table...');
  
  try {
    // Create service_template table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS service_template (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL REFERENCES service_category(id),
        name TEXT NOT NULL,
        description TEXT,
        full_description TEXT,
        target_audience TEXT,
        suggested_price DECIMAL(10,2) NOT NULL DEFAULT 0,
        price_unit TEXT NOT NULL DEFAULT 'hour',
        suggested_duration INTEGER DEFAULT 60,
        suggested_radius INTEGER DEFAULT 25,
        languages TEXT[] DEFAULT ARRAY['es', 'en'],
        requirements TEXT[],
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS template_category_idx ON service_template(category_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS template_active_idx ON service_template(is_active)`);
    
    console.log('✅ Service template table ready');
  } catch (error) {
    console.error('❌ Error creating template table:', error);
    throw error;
  }
}

async function seedTemplates() {
  console.log('🎨 Seeding service templates...');
  
  for (const template of serviceTemplates) {
    try {
      // Check if template already exists
      const existing = await db.execute(
        sql`SELECT id FROM service_template WHERE id = ${template.id}`
      );

      if (!existing || existing.length === 0) {
        // Insert new template - need to use ARRAY constructor for arrays
        const insertQuery = sql`
          INSERT INTO service_template (
            id, category_id, name, description, full_description,
            target_audience, suggested_price, price_unit, suggested_duration,
            suggested_radius, languages, requirements, is_active
          ) VALUES (
            ${template.id}, 
            ${template.categoryId}, 
            ${template.name}, 
            ${template.description || null}, 
            ${template.fullDescription || null},
            ${template.targetAudience || null}, 
            ${template.suggestedPrice}, 
            ${template.priceUnit}, 
            ${template.suggestedDuration},
            ${template.suggestedRadius}, 
            ARRAY[${sql.join(template.languages, sql`, `)}]::text[], 
            ARRAY[${sql.join(template.requirements || [], sql`, `)}]::text[], 
            true
          )`;
        
        await db.execute(insertQuery);
        
        console.log(`✅ Added template: ${template.name}`);
      } else {
        console.log(`⏭️  Template already exists: ${template.name}`);
      }
    } catch (error) {
      console.error(`❌ Error adding template ${template.name}:`, error);
    }
  }
}

async function main() {
  console.log('🚀 Starting service data seed...\n');
  
  try {
    // First, seed categories
    await seedCategories();
    console.log('\n');
    
    // Create templates table
    await createServiceTemplatesTable();
    console.log('\n');
    
    // Then seed templates
    await seedTemplates();
    
    console.log('\n✨ Seed completed successfully!');
    console.log(`📊 Stats:`);
    console.log(`   - ${serviceCategories.length} categories`);
    console.log(`   - ${serviceTemplates.length} service templates`);
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Import eq from drizzle-orm
import { eq, sql } from 'drizzle-orm';

// Run the seed
main();