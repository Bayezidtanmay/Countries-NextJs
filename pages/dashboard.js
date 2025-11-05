import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadCountries } from '../store/slices/countriesSlice'
import CountryCard from '../components/CountryCard'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import { fetchFavoritesAsync } from '../store/slices/favoritesSlice'
import UserProfile from '../components/UserProfile'

export default function Dashboard() {
  const dispatch = useDispatch()
  const router = useRouter()
  const countries = useSelector(s => s.countries.items)
  const authUser = useSelector(s => s.auth.user)
  const favoriteIds = useSelector(s => s.favorites.ids)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('name-asc')
  const [showFavorites, setShowFavorites] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!authUser) {
      alert('You must be logged in')
      router.push('/')
    } else {
      dispatch(fetchFavoritesAsync(authUser.id))
    }
  }, [authUser, dispatch, router])

  useEffect(() => {
    dispatch(loadCountries())
  }, [dispatch])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    alert('You have been logged out')
    router.push('/')
  }

  const filteredCountries = countries
    .filter(c => (showFavorites ? favoriteIds.includes(c.cca3) : true))
    .filter(c => {
      const q = searchQuery.toLowerCase()
      const name = c.name?.common?.toLowerCase() || ''
      const capital = c.capital?.[0]?.toLowerCase() || ''
      const currency = c.currencies
        ? Object.keys(c.currencies).join(',').toLowerCase()
        : ''
      return name.includes(q) || capital.includes(q) || currency.includes(q)
    })
    .slice()
    .sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.common.localeCompare(b.name.common)
        case 'name-desc':
          return b.name.common.localeCompare(a.name.common)
        case 'population':
          return b.population - a.population
        default:
          return 0
      }
    })

  return (
    <div className="dashboard">

      {/* Elegant Navbar */}
      <nav className="navbar">
        <div
          className="navbar-left"
          onClick={() => router.push('/dashboard')}
        >
          🌍 <span className="navbar-logo-text">Explore the World</span>
        </div>

        <div className="navbar-right">
          <div
            className="navbar-user"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img
              src={authUser?.user_metadata?.avatar_url || '/default-avatar.png'}
              alt="user avatar"
              className="navbar-avatar"
            />
            <span>{authUser?.user_metadata?.full_name || authUser?.email}</span>
          </div>

          {menuOpen && (
            <div className="navbar-dropdown">
              <button onClick={() => router.push('/profile')}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* User profile display */}
      <UserProfile />

      {/* Search & filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search by name, capital, or currency..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
        >
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="population">By Population</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={showFavorites}
            onChange={e => setShowFavorites(e.target.checked)}
          />
          ❤️ Show Favorites
        </label>
      </div>

      {/* Countries grid */}
      <div className="countries-grid">
        {filteredCountries.length === 0 ? (
          <p className="no-results">
            {showFavorites
              ? 'No favorites selected 🌙'
              : 'No countries found 🚫'}
          </p>
        ) : (
          filteredCountries.map(country => (
            <CountryCard
              key={country.cca3}
              country={country}
              isFavorite={favoriteIds.includes(country.cca3)}
            />
          ))
        )}
      </div>
    </div>
  )
}

