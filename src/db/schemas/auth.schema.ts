import { relations } from 'drizzle-orm'
import { boolean, index, integer, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

import {
  DEFAULT_CALORIE_BUDGET,
  DEFAULT_CARB_TARGET,
  DEFAULT_CURRENT_WEIGHT,
  DEFAULT_FAT_TARGET,
  DEFAULT_GOAL_WEIGHT,
  DEFAULT_HEIGHT,
  DEFAULT_PROTEIN_TARGET,
  DEFAULT_STARTING_WEIGHT,
  DEFAULT_WATER_GOAL,
} from '@/lib/constants'

import { achievementUnlocks } from './achievement.schema'
import { chats } from './chat.schema'
import { foodEntries } from './food-entry.schema'
import { learnAttempts, learnProgress } from './learn.schema'
import { weightEntries } from './weight-entry.schema'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  // Custom
  onboarded: boolean('onboarded').default(false).notNull(),
  startingWeight: real('starting_weight').notNull().default(DEFAULT_STARTING_WEIGHT),
  currentWeight: real('current_weight').notNull().default(DEFAULT_CURRENT_WEIGHT),
  goalWeight: real('goal_weight').notNull().default(DEFAULT_GOAL_WEIGHT),
  height: real('height').notNull().default(DEFAULT_HEIGHT),
  locale: text('locale').default('en').notNull(),
  waterGoal: integer('water_goal').notNull().default(DEFAULT_WATER_GOAL),
  birthday: text('birthday').notNull(),
  gender: text('gender', { enum: ['male', 'female', 'other'] }).notNull(),
  plan: text('plan', { enum: ['relaxed', 'steady', 'accelerated'] })
    .notNull()
    .default('steady'),
  calorieBudget: integer('calorie_budget').notNull().default(DEFAULT_CALORIE_BUDGET),
  proteinTarget: integer('protein_target').notNull().default(DEFAULT_PROTEIN_TARGET),
  carbTarget: integer('carb_target').notNull().default(DEFAULT_CARB_TARGET),
  fatTarget: integer('fat_target').notNull().default(DEFAULT_FAT_TARGET),
})

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
)

export const accounts = pgTable(
  'accounts',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verifications = pgTable(
  'verifications',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const userRelations = relations(users, ({ many }) => ({
  achievementUnlocks: many(achievementUnlocks),
  sessions: many(sessions),
  accounts: many(accounts),
  chats: many(chats),
  foodEntries: many(foodEntries),
  learnAttempts: many(learnAttempts),
  learnProgress: many(learnProgress),
  weightEntries: many(weightEntries),
}))

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))
