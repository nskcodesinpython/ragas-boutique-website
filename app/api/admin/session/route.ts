import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('ragas_session')

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    if (session.authenticated) {
      return NextResponse.json({ authenticated: true, role: session.role })
    }
  } catch (err) {
    // Ignore JSON parse error
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}

