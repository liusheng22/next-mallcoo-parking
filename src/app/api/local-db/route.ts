import { cosUpload } from '@/helper/cos'
import { success } from '@/helper/response'
import { NextRequest } from 'next/server'
import path from 'path'
import { getQuery } from 'utils/api-route'

export async function GET(req: NextRequest) {
  const request = getQuery(req)
  console.log('request =>', request)
  // const { mainKey, minorKey } = getQuery(req)
  // const data = (await db.getObjectDefault(`.${mainKey}.${minorKey}`)) || {}

  // const file = path.join(process.cwd(), '', 'local-db.json')
  // const stringified = readFileSync(file, 'utf8')

  const file = path.join('/tmp/local-db.json')
  await cosUpload({
    filepath: file,
    newFilename: 'local-db',
    suffix: 'json'
  })

  // fetch 读取网络文件 https://cdn-1257429552.cos.ap-guangzhou.myqcloud.com/json/local-db.json
  const response = await fetch(
    'https://cdn-1257429552.cos.ap-guangzhou.myqcloud.com/json/local-db.json'
  )
  const stringified = await response.text()
  const fileJsonObj = JSON.parse(stringified) || {}
  console.log('fileJsonObj =>', fileJsonObj)

  return success(fileJsonObj)

  // return success(data)
}

export async function POST(req: NextRequest) {
  const query = await req.json()
  // const data = (await db.getObjectDefault(`.mallWithAccount.11707`)) || {}
  const file = path.join('/tmp/local-db.json')
  await cosUpload({
    filepath: file,
    newFilename: 'local-db',
    suffix: 'json'
  })
  // const fileJson = readFileSync(file, 'utf8')
  // const fileJsonObj = JSON.parse(fileJson) || {}

  return success(query)
}
