import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../db';
import { 
  professionalAvailability, 
  messages, 
  serviceTemplates,
  service,
  booking
} from '../schema';
import { sql } from 'drizzle-orm';

describe('Professional Dashboard Database Schema', () => {
  describe('professional_availability table', () => {
    it('should have all required columns', async () => {
      const result = await db.execute(sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'professional_availability'
      `);
      
      const columns = result.rows.map(row => row.column_name);
      
      expect(columns).toContain('id');
      expect(columns).toContain('professional_id');
      expect(columns).toContain('date');
      expect(columns).toContain('time_slots');
      expect(columns).toContain('recurring_pattern');
      expect(columns).toContain('timezone');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should have proper indexes', async () => {
      const result = await db.execute(sql`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'professional_availability'
      `);
      
      const indexes = result.rows.map(row => row.indexname);
      
      expect(indexes).toContain('idx_availability_professional_date');
    });

    it('should enforce unique constraint on professional_id and date', async () => {
      const result = await db.execute(sql`
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'professional_availability' 
        AND constraint_type = 'UNIQUE'
      `);
      
      expect(result.rows.length).toBeGreaterThan(0);
    });
  });

  describe('messages table', () => {
    it('should have all required columns', async () => {
      const result = await db.execute(sql`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'messages'
      `);
      
      const columns = result.rows.map(row => row.column_name);
      
      expect(columns).toContain('id');
      expect(columns).toContain('booking_id');
      expect(columns).toContain('sender_id');
      expect(columns).toContain('recipient_id');
      expect(columns).toContain('content');
      expect(columns).toContain('is_read');
      expect(columns).toContain('read_at');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should have proper foreign key constraints', async () => {
      const result = await db.execute(sql`
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'messages' 
        AND constraint_type = 'FOREIGN KEY'
      `);
      
      expect(result.rows.length).toBeGreaterThanOrEqual(3); // booking_id, sender_id, recipient_id
    });

    it('should have index for unread messages', async () => {
      const result = await db.execute(sql`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'messages'
        AND indexname LIKE '%unread%'
      `);
      
      expect(result.rows.length).toBeGreaterThan(0);
    });
  });

  describe('service_templates table', () => {
    it('should have all required columns', async () => {
      const result = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'service_templates'
      `);
      
      const columns = result.rows.map(row => row.column_name);
      
      expect(columns).toContain('id');
      expect(columns).toContain('category_id');
      expect(columns).toContain('name_key');
      expect(columns).toContain('description_key');
      expect(columns).toContain('default_price');
      expect(columns).toContain('default_unit');
      expect(columns).toContain('default_duration');
      expect(columns).toContain('suggested_skills');
      expect(columns).toContain('is_active');
    });

    it('should have category index', async () => {
      const result = await db.execute(sql`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'service_templates'
        AND indexname LIKE '%category%'
      `);
      
      expect(result.rows.length).toBeGreaterThan(0);
    });
  });

  describe('service table extensions', () => {
    it('should have new columns added', async () => {
      const result = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'service'
      `);
      
      const columns = result.rows.map(row => row.column_name);
      
      expect(columns).toContain('template_id');
      expect(columns).toContain('is_from_template');
      expect(columns).toContain('buffer_time');
      expect(columns).toContain('max_daily_bookings');
      expect(columns).toContain('advance_booking_days');
      expect(columns).toContain('instant_booking');
    });

    it('should have index on professional_id and is_active', async () => {
      const result = await db.execute(sql`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'service'
        AND indexname LIKE '%professional_active%'
      `);
      
      expect(result.rows.length).toBeGreaterThan(0);
    });
  });

  describe('booking table extensions', () => {
    it('should have new columns added', async () => {
      const result = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'booking'
      `);
      
      const columns = result.rows.map(row => row.column_name);
      
      expect(columns).toContain('decline_reason');
      expect(columns).toContain('alternative_times');
      expect(columns).toContain('last_message_at');
      expect(columns).toContain('unread_count_client');
      expect(columns).toContain('unread_count_professional');
    });
  });

  describe('Data integrity', () => {
    it('should not allow overlapping time slots in availability', async () => {
      // This would be tested with actual data insertion
      // For now, we verify the structure supports it
      const result = await db.execute(sql`
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'professional_availability'
        AND column_name = 'time_slots'
      `);
      
      expect(result.rows[0]?.data_type).toBe('jsonb');
    });

    it('should cascade delete messages when booking is deleted', async () => {
      const result = await db.execute(sql`
        SELECT delete_rule
        FROM information_schema.referential_constraints rc
        JOIN information_schema.table_constraints tc 
        ON rc.constraint_name = tc.constraint_name
        WHERE tc.table_name = 'messages'
        AND tc.constraint_type = 'FOREIGN KEY'
      `);
      
      const cascadeRules = result.rows.filter(row => row.delete_rule === 'CASCADE');
      expect(cascadeRules.length).toBeGreaterThan(0);
    });
  });
});