CREATE TABLE "weight_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"weight" real NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "weight_entries" ADD CONSTRAINT "weight_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "weight_entry_userId_idx" ON "weight_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "weight_entry_userId_date_idx" ON "weight_entries" USING btree ("user_id","date");