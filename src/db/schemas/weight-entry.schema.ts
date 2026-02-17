import { relations } from 'drizzle-orm'
import { index, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'

export const weightEntries = pgTable(
  'weight_entries',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    weight: real('weight').notNull(),
    localDate: text('local_date').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('weight_entry_userId_idx').on(table.userId),
    index('weight_entry_userId_localDate_idx').on(table.userId, table.localDate)
  ]
)

export const weightEntryRelations = relations(weightEntries, ({ one }) => ({
  user: one(users, {
    fields: [weightEntries.userId],
    references: [users.id]
  })
}))
