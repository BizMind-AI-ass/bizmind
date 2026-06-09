'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setIsError(true)
        setMessage(error.message)
      } else {
        window.location.href = '/dashboard'
      }
    } else {
      if (!name) {
        setIsError(true)
        setMessage('Please enter your name')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) {
        setIsError(true)
        setMessage(error.message)
      } else {
        setIsError(false)
        window.location.href = '/onboarding'
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-white">B</div>
            <span className="text-2xl font-bold text-white">BizMind</span>
          </a>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-400">
            {isLogin ? 'Login to your BizMind dashboard' : 'Start managing your business with AI'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          {/* Toggle */}
          <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setMessage('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setMessage('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">

            {!isLogin && (
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Raju Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

          </div>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-xl text-sm ${isError ? 'bg-red-950 border border-red-800 text-red-300' : 'bg-green-950 border border-green-800 text-green-300'}`}>
              {message}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login to BizMind' : 'Create Account'}
          </button>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setMessage('') }}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              {isLogin ? 'Sign up free' : 'Login here'}
            </button>
          </p>

        </div>

        {/* Back to home */}
        <p className="text-center text-gray-600 text-sm mt-6">
          <a href="/" className="hover:text-gray-400 transition-colors">← Back to BizMind home</a>
        </p>

      </div>
    </div>
  )
}