CREATE TABLE "water_intakes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "water_intake_user_date_idx" UNIQUE("user_id","date")
);
--> statement-breakpoint
ALTER TABLE "water_intakes" ADD CONSTRAINT "water_intakes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "water_intake_userId_idx" ON "water_intakes" USING btree ("user_id");