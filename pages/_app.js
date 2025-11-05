// pages/_app.js
import '../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '../store'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { setUser, clearUser } from '../store/slices/authSlice'
import { fetchFavoritesAsync, clearFavorites } from '../store/slices/favoritesSlice'
import { fetchUserProfileAsync, clearProfile } from '../store/slices/profileSlice'

function MyApp({ Component, pageProps }) {
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get current session
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (data?.session?.user) {
          const user = data.session.user
          store.dispatch(setUser(user))
          store.dispatch(fetchFavoritesAsync(user.id))
          store.dispatch(fetchUserProfileAsync(user.id)) // ✅ Fetch user profile
        } else {
          store.dispatch(clearUser())
          store.dispatch(clearFavorites())
          store.dispatch(clearProfile())
        }
      } catch (err) {
        console.error('Supabase session error:', err)
        store.dispatch(clearUser())
        store.dispatch(clearFavorites())
        store.dispatch(clearProfile())
      } finally {
        setAuthReady(true)
      }
    }

    initAuth()

    // Listen for Supabase auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user
        store.dispatch(setUser(user))
        store.dispatch(fetchFavoritesAsync(user.id))
        store.dispatch(fetchUserProfileAsync(user.id)) // ✅ Fetch user profile on change
      } else {
        store.dispatch(clearUser())
        store.dispatch(clearFavorites())
        store.dispatch(clearProfile())
      }
    })

    return () => {
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  if (!authReady) return <div style={{ padding: 24 }}>Loading...</div>

  return (
    <Provider store={store}>
        <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp

