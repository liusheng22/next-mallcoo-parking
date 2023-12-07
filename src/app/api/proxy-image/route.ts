import { success } from '@/helper/response'
import axios from 'axios'
import { NextRequest } from 'next/server'

export async function GET() {
  return success()
}

export async function POST(req: NextRequest) {
  const { url } = (await req.json()) || {}

  // 服务端 对图片 url 进行请求，并返回图片的response
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  })

  return success(response, {
    crossDomain: true
  })
}
