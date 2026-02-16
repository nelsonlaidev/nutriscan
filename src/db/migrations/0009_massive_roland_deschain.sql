ALTER TABLE "users" ADD COLUMN "birthday" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "calorie_budget" integer DEFAULT 2000 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "protein_target" integer DEFAULT 150 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "carb_target" integer DEFAULT 200 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "fat_target" integer DEFAULT 67 NOT NULL;--> statement-breakpoint
ALTER TABLE "food_entries" DROP COLUMN "fiber";