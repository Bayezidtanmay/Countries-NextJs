// components/LogoutButton.js
import React from 'react'
import { useDispatch } from 'react-redux'
import { clearUser } from '../store/slices/authSlice'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function LogoutButton() {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      dispatch(clearUser())
      router.push('/login') // Redirect to login page
    } catch (err) {
      console.error('Logout error:', err)
      alert('Failed to log out. Please try again.')
    }
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        border: 'none',
        background: '#f44336',
        color: '#fff',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  )
}

