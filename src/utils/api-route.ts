import { NextRequest } from 'next/server'

export const getQuery: any = (req: NextRequest) => {
  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  const query = Object.fromEntries(searchParams.entries())
  return query
}

export const getQueryKey: any = (req: NextRequest, key: string) => {
  if (!key) {
    return null
  }
  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  return searchParams.get(key)
}

export const postText2Json: any = async (req: NextRequest) => {
  const text = await req.text()
  let obj = {} as {
    [key: string]: string
  }
  try {
    obj = JSON.parse(text)
  } catch (error) {
    console.log()
  }
  return obj
}
