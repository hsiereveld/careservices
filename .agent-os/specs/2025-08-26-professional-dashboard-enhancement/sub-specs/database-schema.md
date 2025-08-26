# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-08-26-professional-dashboard-enhancement/spec.md

## Schema Changes

### New Tables

#### professional_availability
```sql
CREATE TABLE professional_availability (
  id TEXT PRIMARY KEY,
  professional_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slots JSONB NOT NULL, -- Array of {start: "HH:MM", end: "HH:MM", status: "available"|"blocked"}
  recurring_pattern JSONB, -- {type: "weekly"|"daily", days: [1,2,3,4,5], until: "YYYY-MM-DD"}
  timezone TEXT DEFAULT 'Europe/Madrid',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(professional_id, date)
);

CREATE INDEX idx_availability_professional_date ON professional_availability(professional_id, date);
```

#### messages
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES user(id),
  recipient_id TEXT NOT NULL REFERENCES user(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_recipient_unread ON messages(recipient_id, is_read) WHERE is_read = FALSE;
```

#### service_templates
```sql
CREATE TABLE service_templates (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES service_categories(id),
  name_key TEXT NOT NULL, -- Translation key for multi-language support
  description_key TEXT NOT NULL,
  default_price DECIMAL(10,2),
  default_unit service_unit NOT NULL,
  default_duration INTEGER, -- in minutes
  suggested_skills JSONB, -- Array of skill tags
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON service_templates(category_id);
```

### Modified Tables

#### services (additions)
```sql
ALTER TABLE services 
ADD COLUMN template_id TEXT REFERENCES service_templates(id),
ADD COLUMN is_from_template BOOLEAN DEFAULT FALSE,
ADD COLUMN buffer_time INTEGER DEFAULT 0, -- Minutes between bookings
ADD COLUMN max_daily_bookings INTEGER,
ADD COLUMN advance_booking_days INTEGER DEFAULT 30, -- How far in advance bookings allowed
ADD COLUMN instant_booking BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_services_professional_active ON services(professional_id, is_active);
```

#### bookings (additions)
```sql
ALTER TABLE bookings
ADD COLUMN decline_reason TEXT,
ADD COLUMN alternative_times JSONB, -- Array of proposed alternative times
ADD COLUMN last_message_at TIMESTAMP,
ADD COLUMN unread_count_client INTEGER DEFAULT 0,
ADD COLUMN unread_count_professional INTEGER DEFAULT 0;
```

## Migration Strategy

1. Create new tables in sequence: service_templates → professional_availability → messages
2. Add new columns to existing tables with appropriate defaults
3. Backfill template_id for existing services where applicable
4. Create indexes after data migration to avoid performance impact
5. Add database triggers for updated_at timestamps

## Data Integrity Rules

### Availability Constraints
- Time slots cannot overlap within the same date
- Recurring patterns must have an end date within 365 days
- Professional can only modify their own availability

### Message Constraints
- Messages can only be created for active bookings
- Sender must be either the client or professional of the booking
- Content cannot exceed 5000 characters

### Service Template Usage
- Templates can be deactivated but not deleted if services use them
- Custom services (not from template) have template_id = NULL
- Template modifications don't affect existing services created from them

## Performance Considerations

### Indexes
- Composite index on professional_id and date for fast availability lookups
- Partial index on unread messages for notification counts
- Covering index on services for dashboard queries

### Query Optimization
- Use materialized views for earnings calculations if performance degrades
- Implement pagination for message history (limit 50 per query)
- Cache frequently accessed service templates in application layer

### Data Retention
- Archive completed bookings older than 2 years
- Compress message history after 6 months
- Maintain separate analytics tables for historical earnings data