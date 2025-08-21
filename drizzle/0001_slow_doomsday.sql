CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."calendar_provider" AS ENUM('google', 'outlook', 'apple', 'calendly');--> statement-breakpoint
CREATE TYPE "public"."service_unit" AS ENUM('hour', 'day', 'piece', 'service', 'km');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('payment', 'commission', 'payout', 'refund');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('client', 'pro', 'franchise', 'admin');--> statement-breakpoint
CREATE TABLE "availability" (
	"id" text PRIMARY KEY NOT NULL,
	"pro_id" text NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"buffer_time" integer DEFAULT 15,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"pro_id" text NOT NULL,
	"service_id" text NOT NULL,
	"franchise_id" text,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"scheduled_start" timestamp NOT NULL,
	"scheduled_end" timestamp NOT NULL,
	"actual_start" timestamp,
	"actual_end" timestamp,
	"service_price" numeric(10, 2) NOT NULL,
	"platform_fee" numeric(10, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"client_notes" text,
	"pro_notes" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"postal_code" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_event" (
	"id" text PRIMARY KEY NOT NULL,
	"integration_id" text NOT NULL,
	"external_event_id" text NOT NULL,
	"provider" "calendar_provider" NOT NULL,
	"title" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"is_all_day" boolean DEFAULT false,
	"location" text,
	"description" text,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_integration" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" "calendar_provider" NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"calendar_id" text,
	"is_active" boolean DEFAULT true,
	"last_sync_at" timestamp,
	"sync_errors" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commission_split" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"pro_amount" numeric(10, 2) NOT NULL,
	"platform_amount" numeric(10, 2) NOT NULL,
	"franchise_amount" numeric(10, 2) DEFAULT '0.00',
	"hq_amount" numeric(10, 2) DEFAULT '0.00',
	"franchise_id" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "franchise" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"region" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"contract_start" timestamp NOT NULL,
	"contract_end" timestamp,
	"commission_rate" numeric(5, 4) DEFAULT '0.14',
	"settings" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "franchise_territory" (
	"id" text PRIMARY KEY NOT NULL,
	"franchise_id" text NOT NULL,
	"postal_code" text NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"message_type" text DEFAULT 'text',
	"attachments" jsonb,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"date_of_birth" timestamp,
	"address" text,
	"city" text,
	"postal_code" text,
	"province" text,
	"country" text DEFAULT 'ES',
	"bio" text,
	"website" text,
	"social_links" jsonb,
	"preferences" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"reviewee_id" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"is_visible" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" text PRIMARY KEY NOT NULL,
	"pro_id" text NOT NULL,
	"category_id" text NOT NULL,
	"franchise_id" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"base_price" numeric(10, 2) NOT NULL,
	"price_unit" "service_unit" NOT NULL,
	"duration" integer,
	"service_radius" integer DEFAULT 25,
	"languages" jsonb DEFAULT '["es"]'::jsonb,
	"requirements" text,
	"is_active" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "service_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"service_id" text NOT NULL,
	"pro_id" text NOT NULL,
	"frequency" text NOT NULL,
	"next_booking_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"settings" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text,
	"user_id" text NOT NULL,
	"franchise_id" text,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR',
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"payment_intent_id" text,
	"description" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'client' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "preferred_language" text DEFAULT 'es';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_pro_id_user_id_fk" FOREIGN KEY ("pro_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_pro_id_user_id_fk" FOREIGN KEY ("pro_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_franchise_id_franchise_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchise"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_event" ADD CONSTRAINT "calendar_event_integration_id_calendar_integration_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."calendar_integration"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_integration" ADD CONSTRAINT "calendar_integration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_split" ADD CONSTRAINT "commission_split_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_split" ADD CONSTRAINT "commission_split_franchise_id_franchise_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchise"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise" ADD CONSTRAINT "franchise_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_territory" ADD CONSTRAINT "franchise_territory_franchise_id_franchise_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_reviewee_id_user_id_fk" FOREIGN KEY ("reviewee_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_pro_id_user_id_fk" FOREIGN KEY ("pro_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_category_id_service_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_franchise_id_franchise_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchise"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_client_id_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_pro_id_user_id_fk" FOREIGN KEY ("pro_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_franchise_id_franchise_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchise"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "availability_pro_idx" ON "availability" USING btree ("pro_id");--> statement-breakpoint
CREATE INDEX "availability_day_idx" ON "availability" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "booking_client_idx" ON "booking" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "booking_pro_idx" ON "booking" USING btree ("pro_id");--> statement-breakpoint
CREATE INDEX "booking_status_idx" ON "booking" USING btree ("status");--> statement-breakpoint
CREATE INDEX "booking_schedule_idx" ON "booking" USING btree ("scheduled_start");--> statement-breakpoint
CREATE INDEX "booking_franchise_idx" ON "booking" USING btree ("franchise_id");--> statement-breakpoint
CREATE INDEX "event_integration_idx" ON "calendar_event" USING btree ("integration_id");--> statement-breakpoint
CREATE INDEX "event_time_idx" ON "calendar_event" USING btree ("start_time","end_time");--> statement-breakpoint
CREATE INDEX "event_external_idx" ON "calendar_event" USING btree ("external_event_id","provider");--> statement-breakpoint
CREATE INDEX "calendar_user_idx" ON "calendar_integration" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "calendar_provider_idx" ON "calendar_integration" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "commission_booking_idx" ON "commission_split" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "commission_franchise_idx" ON "commission_split" USING btree ("franchise_id");--> statement-breakpoint
CREATE INDEX "franchise_owner_idx" ON "franchise" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "franchise_region_idx" ON "franchise" USING btree ("region");--> statement-breakpoint
CREATE INDEX "territory_franchise_idx" ON "franchise_territory" USING btree ("franchise_id");--> statement-breakpoint
CREATE INDEX "territory_postal_idx" ON "franchise_territory" USING btree ("postal_code");--> statement-breakpoint
CREATE INDEX "territory_unique_idx" ON "franchise_territory" USING btree ("postal_code","franchise_id");--> statement-breakpoint
CREATE INDEX "message_booking_idx" ON "message" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "message_sender_idx" ON "message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_created_idx" ON "message" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "profile_user_idx" ON "profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profile_postal_idx" ON "profile" USING btree ("postal_code");--> statement-breakpoint
CREATE INDEX "review_booking_idx" ON "review" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "review_reviewee_idx" ON "review" USING btree ("reviewee_id");--> statement-breakpoint
CREATE INDEX "review_rating_idx" ON "review" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "service_pro_idx" ON "service" USING btree ("pro_id");--> statement-breakpoint
CREATE INDEX "service_category_idx" ON "service" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "service_franchise_idx" ON "service" USING btree ("franchise_id");--> statement-breakpoint
CREATE INDEX "service_active_idx" ON "service" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "subscription_client_idx" ON "subscription" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "subscription_service_idx" ON "subscription" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "subscription_next_idx" ON "subscription" USING btree ("next_booking_date");--> statement-breakpoint
CREATE INDEX "transaction_user_idx" ON "transaction" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transaction_type_idx" ON "transaction" USING btree ("type");--> statement-breakpoint
CREATE INDEX "transaction_status_idx" ON "transaction" USING btree ("status");--> statement-breakpoint
CREATE INDEX "transaction_booking_idx" ON "transaction" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");