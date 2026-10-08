import { cookies } from 'next/headers'

export function verifyAdminSession(): { authenticated: boolean; role?: 'admin' | 'superadmin' } {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('ragas_session')
    if (!sessionCookie || !sessionCookie.value) {
      return { authenticated: false }
    }
    const session = JSON.parse(sessionCookie.value)
    if (session && session.authenticated) {
      return { authenticated: true, role: session.role }
    }
  } catch {
    // Return unauthenticated on error
  }
  return { authenticated: false }
}

