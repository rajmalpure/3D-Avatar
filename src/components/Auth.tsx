import React, { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import '../auth.css'

interface AuthProps {
  onBack?: () => void
}

export const Auth: React.FC<AuthProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(false) // Default to signup as per request
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({})

  const validateForm = () => {
    const errors: { [key: string]: boolean } = {}

    if (!isLogin && !fullName.trim()) errors.fullName = true

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) errors.email = true

    if (password.length < 8) errors.password = true

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setErrorMsg('Please fix the errors before continuing.')
      return
    }

    if (!isSupabaseConfigured) {
      setErrorMsg('Configuration missing: Please check your Supabase connection.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })
        if (error) throw error
        alert('Check your email for the confirmation link!')
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/'
        }
      })
      if (error) throw error
    } catch (error: any) {
      setErrorMsg(error.message || 'An error occurred during Google sign in')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-root">
      <div className="auth-card-wrapper">
        <header className="auth-logo-header">
          <span className="auth-logo-text" onClick={onBack}>prepmate</span>
        </header>

        <div className="auth-card-container">
          <h1 className="auth-card-title">
            {isLogin ? 'Sign in to PrepMate' : 'Create your account'}
          </h1>
          <p className="auth-card-subtitle">
            {isLogin ? 'Welcome back, explorer' : 'Start practicing in under 60 seconds'}
          </p>

          {errorMsg && <div className="auth-error-msg">{errorMsg}</div>}

          <form onSubmit={handleAuth} className="auth-form" noValidate>
            {!isLogin && (
              <div className="auth-form-group">
                <label className="auth-label">Full name</label>
                <input
                  className={`auth-input ${validationErrors.fullName ? 'invalid' : ''}`}
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Arjun Kumar"
                />
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                className={`auth-input ${validationErrors.email ? 'invalid' : ''}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <input
                className={`auth-input ${validationErrors.password ? 'invalid' : ''}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign in →' : 'Get started free →')}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          <button
            id="google-signin-btn"
            className="auth-google-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>

          <footer className="auth-card-footer">
            <p className="auth-footer-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setValidationErrors({});
              }} className="auth-footer-link">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
