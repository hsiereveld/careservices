import 'dotenv/config';
import { db } from './db';
import { serviceCategory, user } from './schema';
import { nanoid } from 'nanoid';

// CareService platform seed data
export async function seedDatabase() {
  console.log('🌱 Seeding CareService database...');

  try {
    // Seed service categories
    const categories = [
      {
        id: nanoid(),
        name: 'Zorg & Gezondheid',
        slug: 'zorg-gezondheid',
        description: 'Medische zorg, thuiszorg, fysiotherapie, en andere gezondheidsservices',
        icon: '🏥',
        sortOrder: 1,
      },
      {
        id: nanoid(),
        name: 'Technische Diensten',
        slug: 'technische-diensten',
        description: 'Reparaties, installaties, onderhoud, en technische ondersteuning',
        icon: '🔧',
        sortOrder: 2,
      },
      {
        id: nanoid(),
        name: 'Administratie & Juridisch',
        slug: 'administratie-juridisch',
        description: 'Belastingaangiften, juridisch advies, administratieve ondersteuning',
        icon: '📋',
        sortOrder: 3,
      },
      {
        id: nanoid(),
        name: 'Kinderopvang & Oppas',
        slug: 'kinderopvang-oppas',
        description: 'Babysitting, kinderopvang, begeleiding van kinderen',
        icon: '👶',
        sortOrder: 4,
      },
      {
        id: nanoid(),
        name: 'Vervoer & Transport',
        slug: 'vervoer-transport',
        description: 'Taxi services, verhuizingen, bezorgdiensten, chauffeursdiensten',
        icon: '🚗',
        sortOrder: 5,
      },
      {
        id: nanoid(),
        name: 'Sport & Recreatie',
        slug: 'sport-recreatie',
        description: 'Personal training, sportlessen, recreatieve activiteiten',
        icon: '⚽',
        sortOrder: 6,
      },
      {
        id: nanoid(),
        name: 'Sociale Activiteiten',
        slug: 'sociale-activiteiten',
        description: 'Begeleiding, sociale ondersteuning, gezelschap, evenementen',
        icon: '🎉',
        sortOrder: 7,
      },
      {
        id: nanoid(),
        name: 'Huishoudelijke Diensten',
        slug: 'huishoudelijke-diensten',
        description: 'Schoonmaak, tuinonderhoud, huishoudelijke taken',
        icon: '🏠',
        sortOrder: 8,
      },
    ];

    console.log('📂 Inserting service categories...');
    await db.insert(serviceCategory).values(categories);
    console.log(`✅ Inserted ${categories.length} service categories`);

    // Create admin user
    const adminUser = {
      id: nanoid(),
      name: 'CareService Admin',
      email: 'admin@careservice.es',
      role: 'admin' as const,
      preferredLanguage: 'es',
      isActive: true,
      isVerified: true,
      emailVerified: true,
    };

    console.log('👤 Creating admin user...');
    await db.insert(user).values(adminUser);
    console.log('✅ Admin user created');

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      success: true,
      message: 'CareService database seeded successfully',
      categories: categories.length,
      adminUser: adminUser.email,
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}
