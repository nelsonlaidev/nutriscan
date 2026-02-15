import { relations } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'

export const waterIntakes = pgTable(
  'water_intakes',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    count: integer('count').notNull().default(0),
    date: text('date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  (table) => [
    unique('water_intake_user_date_idx').on(table.userId, table.date),
    index('water_intake_userId_idx').on(table.userId)
  ]
)

export const waterIntakeRelations = relations(waterIntakes, ({ one }) => ({
  user: one(users, {
    fields: [waterIntakes.userId],
    references: [users.id]
  })
}))
