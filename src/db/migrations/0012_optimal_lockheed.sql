ALTER TABLE "food_entries" RENAME COLUMN "date" TO "local_date";--> statement-breakpoint
ALTER TABLE "water_entries" RENAME COLUMN "date" TO "local_date";--> statement-breakpoint
ALTER TABLE "weight_entries" RENAME COLUMN "date" TO "local_date";--> statement-breakpoint
DROP INDEX "food_entry_userId_date_idx";--> statement-breakpoint
DROP INDEX "water_entry_userId_date_idx";--> statement-breakpoint
DROP INDEX "weight_entry_userId_date_idx";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" text DEFAULT 'UTC' NOT NULL;--> statement-breakpoint
CREATE INDEX "food_entry_userId_localDate_idx" ON "food_entries" USING btree ("user_id","local_date");--> statement-breakpoint
CREATE INDEX "water_entry_userId_localDate_idx" ON "water_entries" USING btree ("user_id","local_date");--> statement-breakpoint
CREATE INDEX "weight_entry_userId_localDate_idx" ON "weight_entries" USING btree ("user_id","local_date");