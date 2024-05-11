import { db } from '@/db/config'
import { warehouses } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

type NewWarehouse = typeof warehouses.$inferInsert

export default class Warehouse {
  async deleteWarehouse(record: any) {
    try {
      record.status = false
      await db
        .update(warehouses)
        .set(record)
        .where(eq(warehouses.id, record.id))
    } catch (err) {
      console.log(err)
    }
  }
  async insertWarehouse(record: NewWarehouse) {
    try {
      return await db.insert(warehouses).values(record).returning()
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async batchInsertRecords(records: Array<NewWarehouse>) {
    try {
      const newRecord = await db.insert(warehouses).values(records).returning()
      return newRecord
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async getWarehouses(limit: number, offset: number) {
    try {
      const records = await db.query.warehouses.findMany({
        where: (warehouses, { eq }) => eq(warehouses.status, true),
        limit: limit,
        offset: (offset - 1) * limit,
        orderBy: (warehouses, { desc }) => [desc(warehouses.updatedAt)],
      })
      return records
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async updateWarehouse(id: string, args: any) {
    try {
      await db.update(warehouses).set(args).where(eq(warehouses.id, id))
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async searchWarehouses(limit: number, offset: number, name?: string) {
    try {
      if (name) {
        const records = await db.query.warehouses.findMany({
          where: (warehouses, { ilike, eq, and }) =>
            and(
              ilike(warehouses.name, `%${name}%`),
              eq(warehouses.status, true)
            ),
          orderBy: (warehouses, { desc }) => [desc(warehouses.updatedAt)],
          limit: limit,
          offset: (offset - 1) * limit,
        })
        return records
      } else {
        const records = await db.query.warehouses.findMany({
          where: (warehouses, { eq }) => eq(warehouses.status, true),
          orderBy: (warehouses, { desc }) => [desc(warehouses.updatedAt)],
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
        .from(warehouses)
        .where(eq(warehouses.status, true))
      return total[0]?.totalCount || 0
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
