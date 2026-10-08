import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory IP rate limiter for login and admin APIs
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

const LIMIT = 15 // Max 15 requests per 1-minute window
const WINDOW_MS = 60 * 1000

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/api/admin/login')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
    const now = Date.now()

    const current = rateLimitMap.get(ip) || { count: 0, lastReset: now }

    if (now - current.lastReset > WINDOW_MS) {
      current.count = 1
      current.lastReset = now
    } else {
      current.count += 1
    }

    rateLimitMap.set(ip, current)

    if (current.count > LIMIT) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/admin/:path*'
}

