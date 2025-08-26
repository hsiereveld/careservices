import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { service, serviceTemplates, user, serviceCategory } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

describe('Service CRUD Operations', () => {
  let testProfessionalId: string;
  let testCategoryId: string;
  let testTemplateId: string;

  beforeAll(async () => {
    // Create test user (professional)
    testProfessionalId = nanoid();
    await db.insert(user).values({
      id: testProfessionalId,
      name: 'Test Professional',
      email: `test-pro-${Date.now()}@example.com`,
      role: 'pro',
    });

    // Create test category
    testCategoryId = nanoid();
    await db.insert(serviceCategory).values({
      id: testCategoryId,
      name: 'Test Category',
      slug: `test-category-${Date.now()}`,
    });

    // Create test template
    testTemplateId = nanoid();
    await db.insert(serviceTemplates).values({
      id: testTemplateId,
      categoryId: testCategoryId,
      nameKey: 'service.cleaning.name',
      descriptionKey: 'service.cleaning.description',
      defaultPrice: '50.00',
      defaultUnit: 'hour',
      defaultDuration: 120,
      suggestedSkills: ['cleaning', 'organizing'],
    });
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(service).where(eq(service.proId, testProfessionalId));
    await db.delete(serviceTemplates).where(eq(serviceTemplates.id, testTemplateId));
    await db.delete(serviceCategory).where(eq(serviceCategory.id, testCategoryId));
    await db.delete(user).where(eq(user.id, testProfessionalId));
  });

  describe('Service Creation', () => {
    it('should create a service from template', async () => {
      const serviceId = nanoid();
      
      const newService = await db.insert(service).values({
        id: serviceId,
        proId: testProfessionalId,
        categoryId: testCategoryId,
        templateId: testTemplateId,
        isFromTemplate: true,
        name: 'House Cleaning Service',
        description: 'Professional house cleaning service',
        basePrice: '50.00',
        priceUnit: 'hour',
        duration: 120,
        serviceRadius: 15,
        languages: ['es', 'en'],
        bufferTime: 30,
        advanceBookingDays: 14,
        instantBooking: false,
      }).returning();

      expect(newService[0]).toBeDefined();
      expect(newService[0].templateId).toBe(testTemplateId);
      expect(newService[0].isFromTemplate).toBe(true);
      expect(newService[0].bufferTime).toBe(30);
    });

    it('should create a custom service without template', async () => {
      const serviceId = nanoid();
      
      const newService = await db.insert(service).values({
        id: serviceId,
        proId: testProfessionalId,
        categoryId: testCategoryId,
        name: 'Custom Repair Service',
        description: 'Custom electronics repair',
        basePrice: '75.00',
        priceUnit: 'service',
        serviceRadius: 20,
        languages: ['es'],
        maxDailyBookings: 5,
        advanceBookingDays: 7,
        instantBooking: true,
      }).returning();

      expect(newService[0]).toBeDefined();
      expect(newService[0].templateId).toBeNull();
      expect(newService[0].isFromTemplate).toBe(false);
      expect(newService[0].maxDailyBookings).toBe(5);
    });

    it('should validate required fields', async () => {
      const serviceId = nanoid();
      
      try {
        await db.insert(service).values({
          id: serviceId,
          proId: testProfessionalId,
          categoryId: testCategoryId,
          // Missing required fields: name, description, basePrice, priceUnit
        } as any);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Service Retrieval', () => {
    let createdServiceId: string;

    beforeEach(async () => {
      createdServiceId = nanoid();
      await db.insert(service).values({
        id: createdServiceId,
        proId: testProfessionalId,
        categoryId: testCategoryId,
        name: 'Test Service',
        description: 'Test Description',
        basePrice: '100.00',
        priceUnit: 'hour',
        isActive: true,
      });
    });

    it('should retrieve services by professional', async () => {
      const services = await db
        .select()
        .from(service)
        .where(eq(service.proId, testProfessionalId));

      expect(services.length).toBeGreaterThan(0);
      expect(services.find(s => s.id === createdServiceId)).toBeDefined();
    });

    it('should retrieve only active services', async () => {
      // Create an inactive service
      const inactiveId = nanoid();
      await db.insert(service).values({
        id: inactiveId,
        proId: testProfessionalId,
        categoryId: testCategoryId,
        name: 'Inactive Service',
        description: 'This is inactive',
        basePrice: '50.00',
        priceUnit: 'hour',
        isActive: false,
      });

      const activeServices = await db
        .select()
        .from(service)
        .where(
          eq(service.proId, testProfessionalId),
          eq(service.isActive, true)
        );

      expect(activeServices.find(s => s.id === inactiveId)).toBeUndefined();
      expect(activeServices.find(s => s.id === createdServiceId)).toBeDefined();
    });
  });

  describe('Service Updates', () => {
    let serviceToUpdate: string;

    beforeEach(async () => {
      serviceToUpdate = nanoid();
      await db.insert(service).values({
        id: serviceToUpdate,
        proId: testProfessionalId,
        categoryId: testCategoryId,
        name: 'Original Name',
        description: 'Original Description',
        basePrice: '100.00',
        priceUnit: 'hour',
        isActive: true,
      });
    });

    it('should update service details', async () => {
      const updated = await db
        .update(service)
        .set({
          name: 'Updated Name',
          description: 'Updated Description',
          basePrice: '150.00',
          bufferTime: 45,
          instantBooking: true,
        })
        .where(eq(service.id, serviceToUpdate))
        .returning();

      expect(updated[0].name).toBe('Updated Name');
      expect(updated[0].basePrice).toBe('150.00');
      expect(updated[0].bufferTime).toBe(45);
      expect(updated[0].instantBooking).toBe(true);
    });

    it('should activate/deactivate service', async () => {
      // Deactivate
      const deactivated = await db
        .update(service)
        .set({ isActive: false })
        .where(eq(service.id, serviceToUpdate))
        .returning();

      expect(deactivated[0].isActive).toBe(false);

      // Reactivate
      const reactivated = await db
        .update(service)
        .set({ isActive: true })
        .where(eq(service.id, serviceToUpdate))
        .returning();

      expect(reactivated[0].isActive).toBe(true);
    });
  });

  describe('Service Templates', () => {
    it('should retrieve templates by category', async () => {
      const templates = await db
        .select()
        .from(serviceTemplates)
        .where(eq(serviceTemplates.categoryId, testCategoryId));

      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0].nameKey).toBeDefined();
      expect(templates[0].defaultPrice).toBeDefined();
    });

    it('should retrieve only active templates', async () => {
      const templates = await db
        .select()
        .from(serviceTemplates)
        .where(
          eq(serviceTemplates.categoryId, testCategoryId),
          eq(serviceTemplates.isActive, true)
        );

      templates.forEach(template => {
        expect(template.isActive).toBe(true);
      });
    });
  });
});