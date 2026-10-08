import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()

    // Support entering username or email (e.g. admin@ragasboutique.com)
    const loginIdentifier = email || (username && username.includes('@') ? username : `${username}@ragasboutique.com`)

    if (!loginIdentifier || !password) {
      return NextResponse.json({ error: 'Email/Username and password required' }, { status: 400 })
    }

    // Authenticate securely via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginIdentifier,
      password: password
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || 'Invalid login credentials' }, { status: 401 })
    }

    // Determine user role from user metadata (defaults to superadmin for superadmin email, or admin)
    const userRole: 'admin' | 'superadmin' = 
      authData.user.user_metadata?.role || 
      (loginIdentifier.toLowerCase().includes('super') ? 'superadmin' : 'admin')

    const response = NextResponse.json({
      success: true,
      role: userRole,
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    })

    // Set secure HttpOnly, SameSite=Strict session cookie
    response.cookies.set('ragas_session', JSON.stringify({
      role: userRole,
      authenticated: true,
      userId: authData.user.id
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Supabase authentication failed' }, { status: 400 })
  }
}

export async function DELETE() {
  try {
    await supabase.auth.signOut()
  } catch {
    // Ignore signout network error
  }
  const response = NextResponse.json({ success: true })
  response.cookies.delete('ragas_session')
  return response
}
