CREATE TABLE "custom_foods" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"food_name" text NOT NULL,
	"serving_size" text NOT NULL,
	"calories" real NOT NULL,
	"protein" real NOT NULL,
	"carbs" real NOT NULL,
	"fat" real NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_foods" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"food_name" text NOT NULL,
	"serving_size" text NOT NULL,
	"calories" real NOT NULL,
	"protein" real NOT NULL,
	"carbs" real NOT NULL,
	"fat" real NOT NULL,
	"source" text NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "custom_foods" ADD CONSTRAINT "custom_foods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_foods" ADD CONSTRAINT "saved_foods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_foods_userId_createdAt_idx" ON "custom_foods" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "saved_foods_userId_createdAt_idx" ON "saved_foods" USING btree ("user_id","created_at");