import { fetcher } from 'app/composables/use-fetcher'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

setTimeout(() => {
  fetcher({
    url: '/api/task',
    method: 'POST',
    data: {}
  })
}, 1000)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  console.log('pathname', pathname)

  return NextResponse.next()
}

export const config = {}
