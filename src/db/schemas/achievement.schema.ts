import { relations } from 'drizzle-orm'
import { index, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'

export const achievementUnlocks = pgTable(
  'achievement_unlocks',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    achievementId: text('achievement_id').notNull(),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.achievementId],
      name: 'achievement_unlocks_pk',
    }),
    index('achievement_unlock_userId_unlockedAt_idx').on(table.userId, table.unlockedAt.desc()),
  ],
)

export const achievementUnlockRelations = relations(achievementUnlocks, ({ one }) => ({
  user: one(users, {
    fields: [achievementUnlocks.userId],
    references: [users.id],
  }),
}))
