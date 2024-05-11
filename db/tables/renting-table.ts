import { sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
  numeric,
  boolean,
} from 'drizzle-orm/pg-core'

export const rentings = pgTable(
  'renting',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    pty: varchar('pty_no', { length: 50 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    description: varchar('description', { length: 256 }).notNull(),
    area: numeric('area', { precision: 10, scale: 2 }).notNull().default('0'),
    expectedRent: numeric('expected_rent', { precision: 10, scale: 2 })
      .notNull()
      .default('0'),
    actualRent: numeric('actual_rent', { precision: 10, scale: 2 })
      .notNull()
      .default('0'),
    tenantInfo: varchar('tenant_info', { length: 256 }).notNull(),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
  },
  (table) => ({
    nameIdx: index('renting_name_index').on(table.name),
  })
)
