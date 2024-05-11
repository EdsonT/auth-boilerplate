import { db } from '@/db/config'
import { providers } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

type NewProvider = typeof providers.$inferInsert
export default class Provider {
  async getProviderIds() {
    try {
      const records = await db.query.providers.findMany()

      const ids = records.map((r) => r.id)

      return ids
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async deleteProvider(record: any) {
    try {
      record.status = false
      await db.update(providers).set(record).where(eq(providers.id, record.id))
    } catch (err) {
      console.log(err)
    }
  }
  async insertProvider(record: NewProvider) {
    try {
      return await db.insert(providers).values(record).returning()
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async batchInsertRecords(records: Array<NewProvider>) {
    try {
      const newRecord = await db.insert(providers).values(records).returning()
      return newRecord
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async getProviders(limit: number, offset: number) {
    try {
      const records = await db.query.providers.findMany({
        where: (providers, { eq }) => eq(providers.status, true),
        orderBy: (providers, { desc }) => [desc(providers.updatedAt)],
        limit: limit,
        offset: (offset - 1) * limit,
      })
      return records
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async updateProvider(id: string, args: any) {
    try {
      await db.update(providers).set(args).where(eq(providers.id, id))
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async searchProviders(limit: number, offset: number, name?: string) {
    try {
      if (name) {
        const records = await db.query.providers.findMany({
          where: (providers, { ilike, eq, and }) =>
            and(ilike(providers.name, `%${name}%`), eq(providers.status, true)),
          orderBy: (providers, { desc }) => [desc(providers.updatedAt)],
          limit: limit,
          offset: (offset - 1) * limit,
        })
        return records
      } else {
        const records = await db.query.providers.findMany({
          where: (providers, { eq }) => eq(providers.status, true),
          orderBy: (providers, { desc }) => [desc(providers.updatedAt)],
          limit: limit,
          offset: (offset - 1) * limit,
        })
        return records
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async getTotalRecords() {
    try {
      const total = await db
        .select({ totalCount: sql`COUNT(*)` })
        .from(providers)
        .where(eq(providers.status, true)) // Correct usage of .where with eq
      return total[0]?.totalCount || 0 // Added null safety and default value
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
