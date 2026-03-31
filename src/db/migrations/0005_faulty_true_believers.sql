CREATE TABLE "learn_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"score" integer NOT NULL,
	"passed" boolean NOT NULL,
	"xp_earned" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learn_progress" (
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"status" text NOT NULL,
	"best_score" integer DEFAULT 0 NOT NULL,
	"last_score" integer DEFAULT 0 NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"first_passed_at" timestamp with time zone,
	"last_attempted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "learn_progress_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
ALTER TABLE "learn_attempts" ADD CONSTRAINT "learn_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learn_progress" ADD CONSTRAINT "learn_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "learn_attempts_userId_completedAt_idx" ON "learn_attempts" USING btree ("user_id","completed_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "learn_attempts_userId_lessonId_idx" ON "learn_attempts" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "learn_progress_userId_status_idx" ON "learn_progress" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "learn_progress_userId_lastAttemptedAt_idx" ON "learn_progress" USING btree ("user_id","last_attempted_at" DESC NULLS LAST);