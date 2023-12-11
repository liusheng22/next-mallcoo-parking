import { success } from '@/helper/response'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'
import { cosDb } from 'utils/db'

export async function GET(req: NextRequest) {
  const request = getQuery(req)
  console.log('request =>', request)
  const { mainKey, minorKey } = getQuery(req)
  const data = (await cosDb.getObjectDefault(`.${mainKey}.${minorKey}`)) || {}

  // const file = path.join(process.cwd(), '', 'local-db.json')
  // const stringified = readFileSync(file, 'utf8')

  // fetch 读取网络文件 https://cdn-1257429552.cos.ap-guangzhou.myqcloud.com/json/local-db.json
  // const response = await fetch(
  //   'https://cdn-1257429552.cos.ap-guangzhou.myqcloud.com/json/local-db.json'
  // )
  // const stringified = await response.text()
  // const fileJsonObj = JSON.parse(stringified) || {}
  // console.log('fileJsonObj =>', fileJsonObj)
  // const { mallWithAccount = {} } = fileJsonObj || {}
  // const result = mallWithAccount['11707']

  // return success(result)

  return success(data)
}

export async function POST(req: NextRequest) {
  const query = await req.json()
  // const data = (await db.getObjectDefault(`.mallWithAccount.11707`)) || {}
  // const file = path.join('/tmp/local-db.json')
  // await cosUpload({
  //   filepath: file,
  //   newFilename: 'local-db',
  //   suffix: 'json'
  // })
  // const fileJson = readFileSync(file, 'utf8')
  // const fileJsonObj = JSON.parse(fileJson) || {}

  // const data = (await db.getObjectDefault('.')) || {}
  // await cosUpload({
  //   filepath: '',
  //   newFilename: 'local-db',
  //   suffix: 'json',
  //   body: JSON.stringify(data, null, ' ')
  // })

  // const data = await db.getObjectDefault(`.mallWithAccount.11707`)
  // await cosDb.delete(`.usingAccount.11707`)
  const idx = (await cosDb.getIndex(`.mallWithAccount.11707.list`, 3)) || 0
  console.log('🚀 ~ file: route.ts:52 ~ POST ~ data:', idx)

  // console.log('🚀 ~ file: route.ts:53 ~ POST ~ data:', data)
  return success(query)
}
