import { relations } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'

export const waterEntries = pgTable(
  'water_entries',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(),
    localDate: text('local_date').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('water_entry_userId_idx').on(table.userId),
    index('water_entry_userId_localDate_idx').on(table.userId, table.localDate)
  ]
)

export const waterEntryRelations = relations(waterEntries, ({ one }) => ({
  user: one(users, {
    fields: [waterEntries.userId],
    references: [users.id]
  })
}))
