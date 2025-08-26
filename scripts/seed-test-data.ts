import { db } from '../src/lib/db'
import { user, profile, service } from '../src/lib/schema'
import bcrypt from 'bcryptjs'

async function seedTestData() {
  console.log('🌱 Starting test data seed...')

  try {
    // Create test professional user
    const hashedPassword = await bcrypt.hash('test123', 10)
    
    const testPro = await db.insert(user).values({
      id: `pro_${Date.now()}`,
      name: 'Maria García',
      email: `maria.garcia+${Date.now()}@example.com`,
      role: 'pro',
      emailVerified: true,
      isActive: true,
      isVerified: true,
      preferredLanguage: 'es'
    }).returning()

    console.log('✅ Created test professional:', testPro[0].email)

    // Create profile for professional
    await db.insert(profile).values({
      id: `profile_${Date.now()}`,
      userId: testPro[0].id,
      firstName: 'Maria',
      lastName: 'García',
      city: 'Madrid',
      postalCode: '28001',
      country: 'ES',
      bio: 'Profesional de limpieza con 10 años de experiencia'
    })

    // Create test services
    const services = [
      {
        id: `service_${Date.now()}_1`,
        proId: testPro[0].id,
        name: 'Limpieza General del Hogar',
        description: 'Servicio completo de limpieza para su hogar, incluyendo cocina, baños y dormitorios',
        categoryId: '98158b50-6f72-4963-b53e-4f473220ac0d', // Huishouden
        basePrice: '25.00',
        priceUnit: 'hour' as const,
        vatRate: '21' as const,
        priceIncludesVat: true,
        serviceRadius: 10,
        duration: 120,
        isActive: true
      },
      {
        id: `service_${Date.now()}_2`,
        proId: testPro[0].id,
        name: 'Cuidado de Niños',
        description: 'Cuidado profesional y atento para sus hijos con actividades educativas',
        categoryId: 'c7fd221b-e95b-451a-8c0f-7411c4c35644', // Oppas diensten
        basePrice: '15.00',
        priceUnit: 'hour' as const,
        vatRate: '21' as const,
        priceIncludesVat: true,
        serviceRadius: 15,
        duration: 240,
        isActive: true
      },
      {
        id: `service_${Date.now()}_3`,
        proId: testPro[0].id,
        name: 'Ayuda Administrativa',
        description: 'Asistencia con documentación, traducciones y trámites burocráticos',
        categoryId: '709bac0d-aeb5-4fb2-bf25-12d4c9bfe0a2', // Administratieve Ondersteuning
        basePrice: '30.00',
        priceUnit: 'hour' as const,
        vatRate: '21' as const,
        priceIncludesVat: true,
        serviceRadius: 20,
        duration: 60,
        isActive: true
      }
    ]

    for (const serviceData of services) {
      await db.insert(service).values(serviceData)
      console.log(`✅ Created service: ${serviceData.name}`)
    }

    // Create test client user
    const testClient = await db.insert(user).values({
      id: `client_${Date.now()}`,
      name: 'John Smith',
      email: `john.smith+${Date.now()}@example.com`,
      role: 'client',
      emailVerified: true,
      isActive: true,
      preferredLanguage: 'en'
    }).returning()

    console.log('✅ Created test client:', testClient[0].email)

    // Create test admin user
    const testAdmin = await db.insert(user).values({
      id: `admin_${Date.now()}`,
      name: 'Admin User',
      email: `admin+${Date.now()}@careservice.es`,
      role: 'admin',
      emailVerified: true,
      isActive: true,
      preferredLanguage: 'nl'
    }).returning()

    console.log('✅ Created test admin:', testAdmin[0].email)

    console.log('🎉 Test data seeding completed successfully!')
    console.log('\n📝 Test accounts created:')
    console.log(`   Professional: ${testPro[0].email} (password: test123)`)
    console.log(`   Client: ${testClient[0].email} (password: test123)`)
    console.log(`   Admin: ${testAdmin[0].email} (password: test123)`)
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error)
    process.exit(1)
  }

  process.exit(0)
}

seedTestData()