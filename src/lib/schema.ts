import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  decimal, 
  jsonb, 
  pgEnum,
  index,
  date,
  unique
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums for CareService platform
export const userRoleEnum = pgEnum('user_role', ['client', 'pro', 'franchise', 'admin']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded']);
export const serviceUnitEnum = pgEnum('service_unit', ['hour', 'day', 'piece', 'service', 'km']);
export const transactionTypeEnum = pgEnum('transaction_type', ['payment', 'commission', 'payout', 'refund']);
export const calendarProviderEnum = pgEnum('calendar_provider', ['google', 'outlook', 'apple', 'calendly']);

// Extended user table for CareService multi-role system
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default('client'),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").default('es'),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('user_email_idx').on(table.email),
  roleIdx: index('user_role_idx').on(table.role),
}));

// User profiles with detailed information
export const profile = pgTable("profile", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: timestamp("date_of_birth"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  province: text("province"),
  country: text("country").default('ES'),
  bio: text("bio"),
  website: text("website"),
  socialLinks: jsonb("social_links"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  userIdx: index('profile_user_idx').on(table.userId),
  postalIdx: index('profile_postal_idx').on(table.postalCode),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Franchise system tables
export const franchise = pgTable("franchise", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id").notNull().references(() => user.id),
  region: text("region").notNull(),
  status: text("status").notNull().default('active'),
  contractStart: timestamp("contract_start").notNull(),
  contractEnd: timestamp("contract_end"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default('0.14'), // 14%
  settings: jsonb("settings"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  ownerIdx: index('franchise_owner_idx').on(table.ownerId),
  regionIdx: index('franchise_region_idx').on(table.region),
}));

export const franchiseTerritory = pgTable("franchise_territory", {
  id: text("id").primaryKey(),
  franchiseId: text("franchise_id").notNull().references(() => franchise.id, { onDelete: "cascade" }),
  postalCode: text("postal_code").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
}, (table) => ({
  franchiseIdx: index('territory_franchise_idx').on(table.franchiseId),
  postalIdx: index('territory_postal_idx').on(table.postalCode),
  uniqueTerritory: index('territory_unique_idx').on(table.postalCode, table.franchiseId),
}));

// Service categories and services
export const serviceCategory = pgTable("service_category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Service templates for quick service creation
export const serviceTemplates = pgTable("service_templates", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull().references(() => serviceCategory.id),
  nameKey: text("name_key").notNull(), // Translation key for multi-language support
  descriptionKey: text("description_key").notNull(),
  defaultPrice: decimal("default_price", { precision: 10, scale: 2 }),
  defaultUnit: serviceUnitEnum("default_unit").notNull(),
  defaultDuration: integer("default_duration"), // in minutes
  suggestedSkills: jsonb("suggested_skills").$type<string[] | null>(), // Array of skill tags
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_templates_category').on(table.categoryId),
}));

export const service = pgTable("service", {
  id: text("id").primaryKey(),
  proId: text("pro_id").notNull().references(() => user.id),
  categoryId: text("category_id").notNull().references(() => serviceCategory.id),
  franchiseId: text("franchise_id").references(() => franchise.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  priceUnit: serviceUnitEnum("price_unit").notNull(),
  duration: integer("duration"), // in minutes
  serviceRadius: integer("service_radius").default(25), // km
  languages: jsonb("languages").default(['es']),
  requirements: text("requirements"),
  isActive: boolean("is_active").default(true),
  // New columns for professional dashboard
  templateId: text("template_id").references(() => serviceTemplates.id),
  isFromTemplate: boolean("is_from_template").default(false),
  bufferTime: integer("buffer_time").default(0), // Minutes between bookings
  maxDailyBookings: integer("max_daily_bookings"),
  advanceBookingDays: integer("advance_booking_days").default(30), // How far in advance bookings allowed
  instantBooking: boolean("instant_booking").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  proIdx: index('service_pro_idx').on(table.proId),
  categoryIdx: index('service_category_idx').on(table.categoryId),
  franchiseIdx: index('service_franchise_idx').on(table.franchiseId),
  activeIdx: index('service_active_idx').on(table.isActive),
  professionalActiveIdx: index('idx_services_professional_active').on(table.proId, table.isActive),
}));

// Booking system
export const booking = pgTable("booking", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => user.id),
  proId: text("pro_id").notNull().references(() => user.id),
  serviceId: text("service_id").notNull().references(() => service.id),
  franchiseId: text("franchise_id").references(() => franchise.id),
  status: bookingStatusEnum("status").notNull().default('pending'),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  servicePrice: decimal("service_price", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  clientNotes: text("client_notes"),
  proNotes: text("pro_notes"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  // New columns for professional dashboard
  declineReason: text("decline_reason"),
  alternativeTimes: jsonb("alternative_times").$type<Array<{start: string; end: string}> | null>(),
  lastMessageAt: timestamp("last_message_at"),
  unreadCountClient: integer("unread_count_client").default(0),
  unreadCountProfessional: integer("unread_count_professional").default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  clientIdx: index('booking_client_idx').on(table.clientId),
  proIdx: index('booking_pro_idx').on(table.proId),
  statusIdx: index('booking_status_idx').on(table.status),
  scheduleIdx: index('booking_schedule_idx').on(table.scheduledStart),
  franchiseIdx: index('booking_franchise_idx').on(table.franchiseId),
}));

// Commission tracking system
export const commissionSplit = pgTable("commission_split", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull().references(() => booking.id, { onDelete: "cascade" }),
  proAmount: decimal("pro_amount", { precision: 10, scale: 2 }).notNull(),
  platformAmount: decimal("platform_amount", { precision: 10, scale: 2 }).notNull(),
  franchiseAmount: decimal("franchise_amount", { precision: 10, scale: 2 }).default('0.00'),
  hqAmount: decimal("hq_amount", { precision: 10, scale: 2 }).default('0.00'),
  franchiseId: text("franchise_id").references(() => franchise.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
}, (table) => ({
  bookingIdx: index('commission_booking_idx').on(table.bookingId),
  franchiseIdx: index('commission_franchise_idx').on(table.franchiseId),
}));

// Financial transactions
export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").references(() => booking.id),
  userId: text("user_id").notNull().references(() => user.id),
  franchiseId: text("franchise_id").references(() => franchise.id),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default('EUR'),
  status: text("status").notNull().default('pending'),
  paymentMethod: text("payment_method"),
  paymentIntentId: text("payment_intent_id"),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
}, (table) => ({
  userIdx: index('transaction_user_idx').on(table.userId),
  typeIdx: index('transaction_type_idx').on(table.type),
  statusIdx: index('transaction_status_idx').on(table.status),
  bookingIdx: index('transaction_booking_idx').on(table.bookingId),
}));

// Calendar integrations
export const calendarIntegration = pgTable("calendar_integration", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  provider: calendarProviderEnum("provider").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  calendarId: text("calendar_id"),
  isActive: boolean("is_active").default(true),
  lastSyncAt: timestamp("last_sync_at"),
  syncErrors: jsonb("sync_errors"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  userIdx: index('calendar_user_idx').on(table.userId),
  providerIdx: index('calendar_provider_idx').on(table.provider),
}));

export const calendarEvent = pgTable("calendar_event", {
  id: text("id").primaryKey(),
  integrationId: text("integration_id").notNull().references(() => calendarIntegration.id, { onDelete: "cascade" }),
  externalEventId: text("external_event_id").notNull(),
  provider: calendarProviderEnum("provider").notNull(),
  title: text("title").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isAllDay: boolean("is_all_day").default(false),
  location: text("location"),
  description: text("description"),
  syncedAt: timestamp("synced_at").notNull().defaultNow(),
}, (table) => ({
  integrationIdx: index('event_integration_idx').on(table.integrationId),
  timeIdx: index('event_time_idx').on(table.startTime, table.endTime),
  externalIdx: index('event_external_idx').on(table.externalEventId, table.provider),
}));

// Availability management (legacy - for backward compatibility)
export const availability = pgTable("availability", {
  id: text("id").primaryKey(),
  proId: text("pro_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  isActive: boolean("is_active").default(true),
  bufferTime: integer("buffer_time").default(15), // minutes
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  proIdx: index('availability_pro_idx').on(table.proId),
  dayIdx: index('availability_day_idx').on(table.dayOfWeek),
}));

// New professional availability table with enhanced features
export const professionalAvailability = pgTable("professional_availability", {
  id: text("id").primaryKey(),
  professionalId: text("professional_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  timeSlots: jsonb("time_slots").notNull().$type<Array<{start: string; end: string; status: 'available' | 'blocked'}>>(),
  recurringPattern: jsonb("recurring_pattern").$type<{type: 'weekly' | 'daily'; days: number[]; until: string} | null>(),
  timezone: text("timezone").default('Europe/Madrid'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  professionalDateIdx: index('idx_availability_professional_date').on(table.professionalId, table.date),
  uniqueProfessionalDate: unique('unique_professional_date').on(table.professionalId, table.date),
}));

// Messages and communication (legacy)
export const message = pgTable("message", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull().references(() => booking.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => user.id),
  content: text("content").notNull(),
  messageType: text("message_type").default('text'),
  attachments: jsonb("attachments"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
}, (table) => ({
  bookingIdx: index('message_booking_idx').on(table.bookingId),
  senderIdx: index('message_sender_idx').on(table.senderId),
  createdIdx: index('message_created_idx').on(table.createdAt),
}));

// Enhanced messages table for per-booking conversations
export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull().references(() => booking.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => user.id),
  recipientId: text("recipient_id").notNull().references(() => user.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  bookingIdx: index('idx_messages_booking').on(table.bookingId),
  recipientUnreadIdx: index('idx_messages_recipient_unread').on(table.recipientId, table.isRead),
}));

// Reviews and ratings
export const review = pgTable("review", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull().references(() => booking.id, { onDelete: "cascade" }),
  reviewerId: text("reviewer_id").notNull().references(() => user.id),
  revieweeId: text("reviewee_id").notNull().references(() => user.id),
  rating: integer("rating").notNull(), // 1-5 scale
  comment: text("comment"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  bookingIdx: index('review_booking_idx').on(table.bookingId),
  revieweeIdx: index('review_reviewee_idx').on(table.revieweeId),
  ratingIdx: index('review_rating_idx').on(table.rating),
}));

// Subscriptions for recurring services
export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => user.id),
  serviceId: text("service_id").notNull().references(() => service.id),
  proId: text("pro_id").notNull().references(() => user.id),
  frequency: text("frequency").notNull(), // weekly, biweekly, monthly
  nextBookingDate: timestamp("next_booking_date").notNull(),
  isActive: boolean("is_active").default(true),
  settings: jsonb("settings"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  clientIdx: index('subscription_client_idx').on(table.clientId),
  serviceIdx: index('subscription_service_idx').on(table.serviceId),
  nextBookingIdx: index('subscription_next_idx').on(table.nextBookingDate),
}));

// Relations for type-safe queries
export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile, { fields: [user.id], references: [profile.userId] }),
  accounts: many(account),
  sessions: many(session),
  ownedFranchise: one(franchise, { fields: [user.id], references: [franchise.ownerId] }),
  servicesAsClient: many(booking, { relationName: "clientBookings" }),
  servicesAsPro: many(booking, { relationName: "proBookings" }),
  services: many(service),
  sentMessages: many(message, { relationName: "sentMessages" }),
  givenReviews: many(review, { relationName: "givenReviews" }),
  receivedReviews: many(review, { relationName: "receivedReviews" }),
  transactions: many(transaction),
  calendarIntegrations: many(calendarIntegration),
  availability: many(availability),
  subscriptionsAsClient: many(subscription, { relationName: "clientSubscriptions" }),
  subscriptionsAsPro: many(subscription, { relationName: "proSubscriptions" }),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, { fields: [profile.userId], references: [user.id] }),
}));

export const franchiseRelations = relations(franchise, ({ one, many }) => ({
  owner: one(user, { fields: [franchise.ownerId], references: [user.id] }),
  territories: many(franchiseTerritory),
  services: many(service),
  bookings: many(booking),
  commissionSplits: many(commissionSplit),
  transactions: many(transaction),
}));

export const franchiseTerritoryRelations = relations(franchiseTerritory, ({ one }) => ({
  franchise: one(franchise, { fields: [franchiseTerritory.franchiseId], references: [franchise.id] }),
}));

export const serviceCategoryRelations = relations(serviceCategory, ({ many }) => ({
  services: many(service),
}));

export const serviceRelations = relations(service, ({ one, many }) => ({
  pro: one(user, { fields: [service.proId], references: [user.id] }),
  category: one(serviceCategory, { fields: [service.categoryId], references: [serviceCategory.id] }),
  franchise: one(franchise, { fields: [service.franchiseId], references: [franchise.id] }),
  bookings: many(booking),
  subscriptions: many(subscription),
}));

export const bookingRelations = relations(booking, ({ one, many }) => ({
  client: one(user, { fields: [booking.clientId], references: [user.id], relationName: "clientBookings" }),
  pro: one(user, { fields: [booking.proId], references: [user.id], relationName: "proBookings" }),
  service: one(service, { fields: [booking.serviceId], references: [service.id] }),
  franchise: one(franchise, { fields: [booking.franchiseId], references: [franchise.id] }),
  commissionSplit: one(commissionSplit),
  messages: many(message),
  reviews: many(review),
  transactions: many(transaction),
}));

export const commissionSplitRelations = relations(commissionSplit, ({ one }) => ({
  booking: one(booking, { fields: [commissionSplit.bookingId], references: [booking.id] }),
  franchise: one(franchise, { fields: [commissionSplit.franchiseId], references: [franchise.id] }),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, { fields: [transaction.userId], references: [user.id] }),
  booking: one(booking, { fields: [transaction.bookingId], references: [booking.id] }),
  franchise: one(franchise, { fields: [transaction.franchiseId], references: [franchise.id] }),
}));

export const calendarIntegrationRelations = relations(calendarIntegration, ({ one, many }) => ({
  user: one(user, { fields: [calendarIntegration.userId], references: [user.id] }),
  events: many(calendarEvent),
}));

export const calendarEventRelations = relations(calendarEvent, ({ one }) => ({
  integration: one(calendarIntegration, { fields: [calendarEvent.integrationId], references: [calendarIntegration.id] }),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  pro: one(user, { fields: [availability.proId], references: [user.id] }),
}));

export const messageRelations = relations(message, ({ one }) => ({
  booking: one(booking, { fields: [message.bookingId], references: [booking.id] }),
  sender: one(user, { fields: [message.senderId], references: [user.id], relationName: "sentMessages" }),
}));

export const reviewRelations = relations(review, ({ one }) => ({
  booking: one(booking, { fields: [review.bookingId], references: [booking.id] }),
  reviewer: one(user, { fields: [review.reviewerId], references: [user.id], relationName: "givenReviews" }),
  reviewee: one(user, { fields: [review.revieweeId], references: [user.id], relationName: "receivedReviews" }),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  client: one(user, { fields: [subscription.clientId], references: [user.id], relationName: "clientSubscriptions" }),
  service: one(service, { fields: [subscription.serviceId], references: [service.id] }),
  pro: one(user, { fields: [subscription.proId], references: [user.id], relationName: "proSubscriptions" }),
}));
