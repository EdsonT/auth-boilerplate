import { db } from '@/db/config'
import { profiles } from '@/db/schema'

type NewProfile = typeof profiles.$inferInsert

export default class Profile {
  
  async batchInsertRecords(records: Array<NewProfile>) {
    try {
      const newRecord = await db.insert(profiles).values(records).returning()
      return newRecord
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getProfiles() {
    try {
      const profiles = await db.query.profiles.findMany()
      return profiles
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
