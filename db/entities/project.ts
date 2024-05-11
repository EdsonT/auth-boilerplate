import { db } from '@/db/config'
import { projects } from '@/db/schema'
import { eq, ilike } from 'drizzle-orm'

type NewProject = typeof projects.$inferInsert

const projectCols = {
  columns: {
    id: true,
    name: true,
    key: true,
    description: true,
    budget: true,
    state: true,
  },
  with: {
    owner: {
      columns: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
}
export default class Project {
  async getProjectsIds() {
    try {
      const records = await db.query.projects.findMany()
      const ids = records.map((r) => r.id)
      return ids
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async batchInsertRecords(records: Array<NewProject>) {
    try {
      const newRecords = await db.insert(projects).values(records).returning()

      return newRecords
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async createProject(record: NewProject) {
    try {
      const newRecord = await db.insert(projects).values(record).returning({
        id: projects.id,
        name: projects.name,
        key: projects.key,
        description: projects.description,
        budget: projects.budget,
        owner: projects.owner,
      })

      return newRecord.shift()
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getProjects(limit: number, offset: number, name: string) {
    try {
      const records = await db.query.projects.findMany({
        ...projectCols,
        where: (projects, { eq, and }) =>
          and(ilike(projects.name, `%${name}%`), eq(projects.status, true)),
        // limit,
        // offset,
        orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
      })

      return records
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getProjectById(id: string) {
    try {
      const record = await db.query.projects.findFirst({
        ...projectCols,
        where: (projects, { eq, and }) =>
          and(eq(projects.id, id), eq(projects.status, true)),
      })

      return record
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async editProjectById(id: string, args: any) {
    try {
      const response = await db
        .update(projects)
        .set(args)
        .where(eq(projects.id, id))
        .returning({
          id: projects.id,
          name: projects.name,
          key: projects.key,
          description: projects.description,
          budget: projects.budget,
          leaderId: projects.owner,
        })

      return response.shift()
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async deleteProjectById(id: string) {
    try {
      const response = await db
        .update(projects)
        .set({ state: 'INACTIVE', status: false })
        .where(eq(projects.id, id))
        .returning()
      return {
        message: 'The project has been deleted.',
        response,
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async changeOwnerById(id: string, args: any) {
    try {
      const response = await db
        .update(projects)
        .set({ owner: args.owner })
        .where(eq(projects.id, id))

      return {
        message: 'The owner has been changed successfully!',
        response,
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async pauseProjectById(id: string) {
    try {
      const response = await db
        .update(projects)
        .set({ state: 'PAUSED' })
        .where(eq(projects.id, id))
        .returning()
      return {
        message: 'The project has been paused!',
        response,
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async cancelProjectById(id: string) {
    try {
      const response = await db
        .update(projects)
        .set({ state: 'CANCELED' })
        .where(eq(projects.id, id))
        .returning()
      return {
        message: 'The project has been cancelled!',
        response,
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
