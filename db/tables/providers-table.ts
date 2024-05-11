import { sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  index,
} from 'drizzle-orm/pg-core'

export const providers = pgTable(
  'provider',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    contactInformation: varchar('contactInformation', {
      length: 256,
    }).notNull(),
    type: varchar('type', { length: 256 }).notNull(),
    phoneNumber: varchar('phoneNumber', { length: 256 }),
    mainAddress: varchar('main_address', { length: 256 }).notNull(),
    secondAddress: varchar('second_address', { length: 256 }),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
  },
  (table) => ({
    nameIdx: index('provider_name_index').on(table.name),
    phoneNumberIdx: index('providers_phonenumber_index').on(table.phoneNumber),
  })
)
