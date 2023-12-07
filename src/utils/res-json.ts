import { NextResponse } from 'next/server'

interface responseConfig {
  crossDomain?: boolean
}

/**
 * 返回json数据
 * @param data
 * @param success
 */
const nextResponse = {
  success: (data?: any, config?: responseConfig) => {
    const response = NextResponse.json(data)

    const { crossDomain } = config || {}
    if (crossDomain) {
      response.headers.set('Access-Control-Allow-Origin', '*')
    }
    return response
  },
  failed: () => {
    const response = new NextResponse(null, { status: 400 })
    return response
  }
}
export default nextResponse