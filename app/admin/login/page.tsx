'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ShieldCheck, User, Eye, EyeOff } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        sessionStorage.setItem('ragas_admin_token', 'authenticated_session')
        sessionStorage.setItem('ragas_admin_role', data.role)
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid username or password.')
      }
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">Admin Portal Login</h1>
            <p className="text-xs text-gray-500 mt-1">Sign in to manage Ragas Boutique blouse fabrics</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-accent font-semibold uppercase text-gray-700 mb-2">
                Email / Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin@ragasboutique.com or admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-accent font-semibold uppercase text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                
                {/* Eye toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1 rounded-lg"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold shadow-md mt-2"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              Restricted Access • Authorized Boutique Management Only
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

