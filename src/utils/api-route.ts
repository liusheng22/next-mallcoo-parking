import { NextRequest } from 'next/server'

export const getQuery: any = (req: NextRequest) => {
  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  const query = Object.fromEntries(searchParams.entries())
  return query
}

export const getQueryKey: any = (req: NextRequest, key: string) => {
  if (!key) { return null }
  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  return searchParams.get(key)
}
