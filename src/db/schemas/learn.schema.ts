import { relations } from 'drizzle-orm'
import { boolean, index, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { LEARN_LESSON_IDS, LEARN_PROGRESS_STATUSES } from '@/lib/learn/types'

import { users } from './auth.schema'

export const learnProgress = pgTable(
  'learn_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: text('lesson_id', {
      enum: [...LEARN_LESSON_IDS],
    }).notNull(),
    status: text('status', {
      enum: [...LEARN_PROGRESS_STATUSES],
    }).notNull(),
    bestScore: integer('best_score').notNull().default(0),
    lastScore: integer('last_score').notNull().default(0),
    attemptCount: integer('attempt_count').notNull().default(0),
    firstPassedAt: timestamp('first_passed_at', { withTimezone: true }),
    lastAttemptedAt: timestamp('last_attempted_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.lessonId],
      name: 'learn_progress_pk',
    }),
    index('learn_progress_userId_status_idx').on(table.userId, table.status),
    index('learn_progress_userId_lastAttemptedAt_idx').on(table.userId, table.lastAttemptedAt.desc()),
  ],
)

export const learnAttempts = pgTable(
  'learn_attempts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: text('lesson_id', {
      enum: [...LEARN_LESSON_IDS],
    }).notNull(),
    score: integer('score').notNull(),
    passed: boolean('passed').notNull(),
    xpEarned: integer('xp_earned').notNull().default(0),
    completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('learn_attempts_userId_completedAt_idx').on(table.userId, table.completedAt.desc()),
    index('learn_attempts_userId_lessonId_idx').on(table.userId, table.lessonId),
  ],
)

export const learnProgressRelations = relations(learnProgress, ({ one }) => ({
  user: one(users, {
    fields: [learnProgress.userId],
    references: [users.id],
  }),
}))

export const learnAttemptRelations = relations(learnAttempts, ({ one }) => ({
  user: one(users, {
    fields: [learnAttempts.userId],
    references: [users.id],
  }),
}))
