CREATE TABLE "saved_meal_template_items" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"position" integer NOT NULL,
	"food_name" text NOT NULL,
	"serving_size" text NOT NULL,
	"calories" real NOT NULL,
	"protein" real NOT NULL,
	"carbs" real NOT NULL,
	"fat" real NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "saved_meal_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"default_meal_category" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_meal_template_items" ADD CONSTRAINT "saved_meal_template_items_template_id_saved_meal_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."saved_meal_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_meal_templates" ADD CONSTRAINT "saved_meal_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "saved_meal_template_items_templateId_position_idx" ON "saved_meal_template_items" USING btree ("template_id","position");--> statement-breakpoint
CREATE INDEX "saved_meal_templates_userId_createdAt_idx" ON "saved_meal_templates" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "saved_meal_templates_userId_defaultMealCategory_idx" ON "saved_meal_templates" USING btree ("user_id","default_meal_category");