CREATE TABLE "water_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "current_weight" SET DEFAULT 70;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "current_weight" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "goal_weight" SET DEFAULT 60;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "goal_weight" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "height" SET DEFAULT 170;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "height" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "water_goal" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "water_entries" ADD CONSTRAINT "water_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "water_entry_userId_idx" ON "water_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "water_entry_userId_date_idx" ON "water_entries" USING btree ("user_id","date");