import { Config, JsonDB } from 'node-json-db'

export const db = new JsonDB(new Config('local-db', true, true, '.'))

// try catch 封装
const tryCatch = async (fn: any) => {
  try {
    await fn()
  } catch (error) {
    console.log()
  }
  return
}

export const localDb = {
  push: async (path: string, data: any, isSave = true) => {
    return await tryCatch(() => db.push(path, data, isSave))
  },
  delete: async (path: string) => {
    return await tryCatch(() => db.delete(path))
  }
}
