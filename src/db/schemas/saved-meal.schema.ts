import { relations } from 'drizzle-orm'
import { index, integer, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

import { MEALS } from '@/lib/constants'

import { users } from './auth.schema'

export const savedMealTemplates = pgTable(
  'saved_meal_templates',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    defaultMealCategory: text('default_meal_category', {
      enum: [...MEALS],
    }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('saved_meal_templates_userId_createdAt_idx').on(table.userId, table.createdAt),
    index('saved_meal_templates_userId_defaultMealCategory_idx').on(table.userId, table.defaultMealCategory),
  ],
)

export const savedMealTemplateItems = pgTable(
  'saved_meal_template_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    templateId: text('template_id')
      .notNull()
      .references(() => savedMealTemplates.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    foodName: text('food_name').notNull(),
    servingSize: text('serving_size').notNull(),
    calories: real('calories').notNull(),
    protein: real('protein').notNull(),
    carbs: real('carbs').notNull(),
    fat: real('fat').notNull(),
    imageUrl: text('image_url'),
  },
  (table) => [index('saved_meal_template_items_templateId_position_idx').on(table.templateId, table.position)],
)

export const savedMealTemplateRelations = relations(savedMealTemplates, ({ one, many }) => ({
  user: one(users, {
    fields: [savedMealTemplates.userId],
    references: [users.id],
  }),
  items: many(savedMealTemplateItems),
}))

export const savedMealTemplateItemRelations = relations(savedMealTemplateItems, ({ one }) => ({
  template: one(savedMealTemplates, {
    fields: [savedMealTemplateItems.templateId],
    references: [savedMealTemplates.id],
  }),
}))
