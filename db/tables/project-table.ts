import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  index,
  boolean,
} from 'drizzle-orm/pg-core'
import { users } from './user-table'

export const projects = pgTable(
  'project',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    name: varchar('name', { length: 256 }).unique().notNull(),
    key: varchar('key', { length: 256 }).notNull(),
    description: varchar('description', { length: 256 }),
    budget: numeric('budget').notNull(),
    owner: uuid('owner')
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
    state: varchar('state', { length: 256 }).notNull().default('ACTIVE'),
    status: boolean('status').default(true),
  },
  (table) => {
    return {
      nameIdx: index('projects_name_index').on(table.name),
      keyIdx: index('projects_key_index').on(table.key),
      budgetIdx: index('projects_budget_index').on(table.budget),
    }
  }
)

export const projectsRelations = relations(projects, ({ one }) => ({
  owner: one(users, {
    fields: [projects.owner],
    references: [users.id],
  }),
}))
