import { db } from '@/db/config'
import { rentings } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

type NewRenting = typeof rentings.$inferInsert

export default class Renting {
  async deleteRenting(record: any) {
    try {
      record.status = false
      await db.update(rentings).set(record).where(eq(rentings.id, record.id))
    } catch (err) {
      console.log(err)
    }
  }
  async insertRenting(record: NewRenting) {
    try {
      return await db.insert(rentings).values(record).returning()
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async batchInsertRecords(records: Array<NewRenting>) {
    try {
      const newRecord = await db.insert(rentings).values(records).returning()
      return newRecord
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async getRentings(limit: number, offset: number) {
    try {
      const records = await db.query.rentings.findMany({
        where: (renting, { eq }) => eq(renting.status, true),
        limit: limit,
        offset: (offset - 1) * limit,
      })
      return records
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async updateRenting(id: string, args: any) {
    try {
      await db.update(rentings).set(args).where(eq(rentings.id, id))
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async searchRenting(limit: number, offset: number, name?: string) {
    try {
      if (name) {
        const records = await db.query.rentings.findMany({
          where: (renting, { ilike, eq, and }) =>
            and(
              and(ilike(renting.name, `%${name}%`)),
              eq(renting.status, true)
            ),
          orderBy: (renting, { desc }) => [desc(renting.updatedAt)],
          limit: limit,
          offset: (offset - 1) * limit,
        })
        return records
      } else {
        const records = await db.query.rentings.findMany({
          where: (rentings, { eq }) => eq(rentings.status, true),
          orderBy: (rentings, { desc }) => [desc(rentings.updatedAt)],
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
        .from(rentings)
        .where(eq(rentings.status, true))
      return total[0]?.totalCount || 0
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
