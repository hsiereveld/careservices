CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"recipient_id" text NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professional_availability" (
	"id" text PRIMARY KEY NOT NULL,
	"professional_id" text NOT NULL,
	"date" date NOT NULL,
	"time_slots" jsonb NOT NULL,
	"recurring_pattern" jsonb,
	"timezone" text DEFAULT 'Europe/Madrid',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_professional_date" UNIQUE("professional_id","date")
);
--> statement-breakpoint
CREATE TABLE "service_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"name_key" text NOT NULL,
	"description_key" text NOT NULL,
	"default_price" numeric(10, 2),
	"default_unit" "service_unit" NOT NULL,
	"default_duration" integer,
	"suggested_skills" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "decline_reason" text;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "alternative_times" jsonb;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "last_message_at" timestamp;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "unread_count_client" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "unread_count_professional" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "template_id" text;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "is_from_template" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "buffer_time" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "max_daily_bookings" integer;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "advance_booking_days" integer DEFAULT 30;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "instant_booking" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_user_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_availability" ADD CONSTRAINT "professional_availability_professional_id_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_templates" ADD CONSTRAINT "service_templates_category_id_service_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_messages_booking" ON "messages" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "idx_messages_recipient_unread" ON "messages" USING btree ("recipient_id","is_read");--> statement-breakpoint
CREATE INDEX "idx_availability_professional_date" ON "professional_availability" USING btree ("professional_id","date");--> statement-breakpoint
CREATE INDEX "idx_templates_category" ON "service_templates" USING btree ("category_id");--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_template_id_service_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."service_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_services_professional_active" ON "service" USING btree ("pro_id","is_active");