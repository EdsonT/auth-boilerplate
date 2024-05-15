import { db } from '@/db/config'
import { users } from '@/db/schema'
import { eq, like, sql } from 'drizzle-orm'

type NewUser = typeof users.$inferInsert

export default class User {
  async batchInsertRecords(records: Array<NewUser>) {
  console.log("batch");

    try {
      const newRecord = await db.insert(users).values(records).returning()
      console.log(newRecord);
      
      return newRecord
    } catch (err) {
      console.log(err)
      throw err
    }
  }

 
  async createUser(record: NewUser) {
    try {
      const newRecord = await db.insert(users).values(record).returning()
      return "User created successfully"
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async blockUserById(id: string) {
    try {
      await db
        .update(users)
        .set({ status: false, blocked: true })
        .where(eq(users.id, id))

      return {
        message: 'Este usario ha sido bloqueado',
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async unblockUserById(id: string) {
    try {
      await db
        .update(users)
        .set({ status: true, blocked: false })
        .where(eq(users.id, id))

      return {
        message: 'Este usario ha sido desbloqueado',
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async resetPasswordByEmail(input: any) {
    try {
      await db
        .update(users)
        .set({ password: input.password })
        .where(eq(users.email, input.email))

      return {
        message: 'Su contraseña ha sido restaurada',
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getUserFirstUser() {
    try {
      const record = await db.query.users.findFirst({
        with: { profile: true },
      })

      return record
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async getUserByEmail(email: string) {
    try {
      const record = await db.query.users.findFirst({
        // with: { profile: true },
        where: eq(users.email, email),
      })
      return record
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async getUserById(id: string) {
    try {
      const record = await db.query.users.findFirst({
        // with: { profile: true },
        where: eq(users.id, id),
      })

      return record
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getUsers(limit: number, offset: number) {
    try {
      const records = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.status, true),
        orderBy: (users, { desc }) => [desc(users.updatedAt)],
        limit: limit,
        offset: (offset - 1) * limit,
      })
      return records
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async searchUsers(limit: number, offset: number, name?: string) {
    try {
      if (name) {
        const records = await db.query.users.findMany({
          where: (users, { ilike, eq, and }) =>
            and(ilike(users.name, `%${name}%`), eq(users.status, true)),
          orderBy: (users, { desc }) => [desc(users.updatedAt)],
          limit: limit,
          offset: (offset - 1) * limit,
        })
        return records
      } else {
        const records = await db.query.users.findMany({
          where: (users, { eq }) => eq(users.status, true),
          orderBy: (users, { desc }) => [desc(users.updatedAt)],
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

  async editUserById(id: string, record: any) {
    try {
      await db.update(users).set(record).where(eq(users.id, id))
      return {
        message: 'Updated successfully',
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async deleteUserById(id: string) {
    try {
      const response = await db
        .update(users)
        .set({ status: false })
        .where(eq(users.id, id))
        .returning()

      return response
    } catch (err) {
      console.log(err)
      throw err
    }
  }


  async changeUserRoleByEmail(args: any) {
    try {
      const { email, role } = args
      await db
        .update(users)
        .set({ role })
        .where(eq(users.email, email))
        .returning()

      return {
        message: 'Se ha actualizado el rol',
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
        .from(users)
        .where(eq(users.status, true)) // Correct usage of .where with eq
      return total[0]?.totalCount || 0 // Added null safety and default value
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}