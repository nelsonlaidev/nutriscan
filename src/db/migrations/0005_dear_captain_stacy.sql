ALTER TABLE "food_entries" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "food_entries" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "food_entries" ADD COLUMN "date" text NOT NULL;--> statement-breakpoint
CREATE INDEX "food_entry_userId_date_idx" ON "food_entries" USING btree ("user_id","date");