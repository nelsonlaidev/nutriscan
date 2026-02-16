ALTER TABLE "water_intakes" RENAME COLUMN "count" TO "amount";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "water_goal" integer DEFAULT 2500;