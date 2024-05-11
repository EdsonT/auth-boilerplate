import { sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
  numeric,
  date,
  boolean,
} from 'drizzle-orm/pg-core'
import { projects } from './project-table'
import { providers } from './providers-table'

export const warehouses = pgTable(
  'warehouse',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    sku: varchar('sku', { length: 50 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    description: varchar('description', { length: 256 }).notNull(),
    provider: varchar('provider', { length: 256 }),
    project: varchar('project', { length: 256 }).notNull(),
    batch: varchar('batch', { length: 256 }),
    price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
    dateDelivered: date('date_delivered'),
    projectsId: uuid('projects_id')
      .references(() => projects.id)
      .notNull(),
    providerId: uuid('provider_id')
      .references(() => providers.id)
      .notNull(),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
  },
  (table) => ({
    nameIdx: index('warehouse_name_index').on(table.name),
  })
)
