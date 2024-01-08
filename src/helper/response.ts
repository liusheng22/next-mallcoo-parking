import { NextResponse } from 'next/server'

interface responseConfig {
  crossDomain?: boolean
}

/**
 * 返回json数据
 * @param data 返回数据
 * @param config 配置
 * @returns response
 */
export const success = (data?: any, config?: responseConfig) => {
  const response = NextResponse.json(data || {})

  const { crossDomain } = config || {}
  if (crossDomain) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )
  }
  return response
}

export const failed = (statusText?: string) => {
  const response = new NextResponse(null, {
    status: 400,
    statusText
  })
  return response
}
