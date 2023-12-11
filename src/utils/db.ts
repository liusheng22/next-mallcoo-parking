import { cosUpload } from '@/helper/cos'
import { Config, JsonDB } from 'node-json-db'

// export const db = new JsonDB(new Config('local-db', true, true, '.'))
export const db = new JsonDB(new Config('/tmp/local-db.json', true, true, '.'))

// try catch 封装
const tryCatch = async (fn: any) => {
  let data = {}
  try {
    data = await fn()
  } catch (error) {
    console.log()
  }
  return data
}

export const localDb = {
  push: async (path: string, data: any, isSave = true) => {
    return await tryCatch(() => db.push(path, data, isSave))
  },
  delete: async (path: string) => {
    return await tryCatch(() => db.delete(path))
  }
}

const fetchCosJson = async () => {
  const response = await fetch(
    'https://cdn-1257429552.cos.ap-guangzhou.myqcloud.com/json/local-db.json'
  )
  const stringified = await response.text()
  let fileJsonObj: any = {}
  try {
    fileJsonObj = JSON.parse(stringified) || {}
  } catch (error) {
    console.log()
  }
  return fileJsonObj
}

const rewriteLocalJson = async () => {
  // 获取 cos json（所有）
  const cosJson = await fetchCosJson()
  // 先暂时写入到本地
  const data = await localDb.push('.', cosJson, true)
  return data
}

/**
 * getObjectDefault
 * push
 * delete
 */
export const cosDb = {
  getObjectDefault: async (path: string, defaultValue?: any) => {
    await rewriteLocalJson()
    const data = (await tryCatch(() =>
      db.getObjectDefault(path, defaultValue)
    )) as any
    return data
  },
  push: async (path: string, data: any, isSave = true) => {
    await rewriteLocalJson()
    await localDb.push(path, data, isSave)
    const allJson = await db.getObjectDefault('.')
    // 写入到 cos
    await cosUpload({
      newFilename: 'local-db',
      suffix: 'json',
      body: JSON.stringify(allJson, null, ' ')
    })
    return allJson
  },
  delete: async (path: string) => {
    await rewriteLocalJson()
    await localDb.delete(path)
    const allJson = await db.getObjectDefault('.')
    // 写入到 cos
    await cosUpload({
      newFilename: 'local-db',
      suffix: 'json',
      body: JSON.stringify(allJson, null, ' ')
    })
    return allJson
  },
  getIndex: async (
    dataPath: string,
    searchValue: string | number,
    propertyName?: string
  ) => {
    await rewriteLocalJson()
    const index = await tryCatch(() =>
      db.getIndex(dataPath, searchValue, propertyName)
    )
    return index
  }
}
