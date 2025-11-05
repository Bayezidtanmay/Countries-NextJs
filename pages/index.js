import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import { FcGoogle } from 'react-icons/fc' // 👈 import Google icon

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    async function check() {
      const s = await supabase.auth.getSession()
      if (s?.data?.session) {
        alert('Already logged in — redirecting to dashboard')
        router.push('/dashboard')
      }
    }
    check()
  }, [])

  async function handleEmailLogin(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return alert(error.message)
    alert('Successfully logged in')
    router.push('/dashboard')
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) alert(error.message)
    // Supabase handles redirect
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Welcome Back</h1>
      <form onSubmit={handleEmailLogin} className="login-form">
        <input
          className="login-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="login-btn">Login</button>
      </form>

      <div className="divider">or</div>

      <button className="google-login-btn" onClick={handleGoogle}>
        <FcGoogle size={22} />
        Sign in with Google
      </button>
    </div>
  )
}
