// import { fetcher } from 'app/composables/use-fetcher'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// setTimeout(() => {
//   fetcher({
//     url: '/api/task',
//     method: 'POST',
//     data: {}
//   })
// }, 1000)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // GET /_next/data/build-id/hello.json

  console.log('pathname', pathname)

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: '/about/:path*'
}
