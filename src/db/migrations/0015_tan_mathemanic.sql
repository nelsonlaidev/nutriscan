DROP INDEX "food_entry_userId_localDate_idx";--> statement-breakpoint
DROP INDEX "water_entry_userId_localDate_idx";--> statement-breakpoint
DROP INDEX "weight_entry_userId_localDate_idx";--> statement-breakpoint
CREATE INDEX "food_entry_userId_createdAt_idx" ON "food_entries" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "water_entry_userId_createdAt_idx" ON "water_entries" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "weight_entry_userId_createdAt_idx" ON "weight_entries" USING btree ("user_id","created_at");--> statement-breakpoint
ALTER TABLE "food_entries" DROP COLUMN "local_date";--> statement-breakpoint
ALTER TABLE "water_entries" DROP COLUMN "local_date";--> statement-breakpoint
ALTER TABLE "weight_entries" DROP COLUMN "local_date";