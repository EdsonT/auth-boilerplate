'use server'

import User from '@/db/entities/user'
import { z } from 'zod'

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
const entity = new User()
const UpdateUser = FormSchema


export async function searchUsers(
    limit: number,
    offset: number,
    term?: string
  ) {
    return await entity.searchUsers(limit, offset, term)
  }
  
  export async function getUsers() {
    try {
      const records = await entity.getUsers(10, 1)
      return records;
    } catch (err) {
      return []
    }
  }
  export async function updateUser(formData: FormData) {
    try {
      const {
        id,
        name,
        email,
        role,
        status,
        createdAt,
        updatedAt,
      } = UpdateUser.parse({
        id: formData.get('id'),
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'), 
        status: formData.get('status'),
        createdAt: formData.get('createdAt'),
        updatedAt: formData.get('updatedAt'),
      })
      await entity.editUserById(id, {
        name,
        email,
        role,
        status,
        createdAt,
        updatedAt,
      })
    } catch (err) {
      throw err
    }
  }
  
  export async function deleteUser(param: any) {
    try {
      await entity.deleteUserById(param.id)
    } catch (err) {
    }
  }
  export async function getTotalUsers() {
    try {
      return await entity.getTotalRecords()
    } catch (err) {
      return
    }
  }