import { db } from '@/db/config'
import { users } from '@/db/schema'
import { eq, like } from 'drizzle-orm'

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

  async signIn(args: any) {
    const { email, password } = args
    try {
      await db.query.users.findFirst({
        columns: {
          email: true,
          password: true,
        },
        where: eq(users.email, email),
      })
      console.log(password)
      // dcrypt password and verify if is correct the value
      // return jwt
      return {
        jwt: '',
      }
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
        with: { profile: true },
        where: eq(users.id, id),
      })

      return record
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getUserIds() {
    try {
      const records = await db.query.users.findMany()
      const ids = records.map((r) => r.id)
      return ids
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getUsers(limit: number, offset: number, name: string) {
    try {
      const records = await db.query.users.findMany({
        with: { profile: true },
        where: like(users.name, `%${name}%`),
        limit,
        offset,
      })

      return records
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async editUserById(id: string, record: any) {
    try {
      await db.update(users).set(record).where(eq(users.id, id))

      return {
        message: 'Se ha editado el usuario correctamente',
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
}