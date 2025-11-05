// components/CountryCard.js
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '../lib/supabaseClient'
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice'
import CountryDetailsModal from './CountryDetailsModal'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

export default function CountryCard({ country }) {
  const [showDetails, setShowDetails] = useState(false)
  const dispatch = useDispatch()

  const favoriteIds = useSelector((state) => state.favorites.ids)
  const isFavorite = favoriteIds.includes(country.cca3)

  const handleToggleFavorite = async (e) => {
    e.stopPropagation()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Auth error:', error.message)
      alert('Error fetching user session. Please log in again.')
      return
    }

    if (!user) {
      alert('Please log in to manage favorites.')
      return
    }

    dispatch(
      toggleFavoriteAsync({
        userId: user.id,
        country,
        isFavorite,
      })
    )
  }

  const getCurrencies = () => {
    if (!country.currencies) return 'N/A'
    return Object.entries(country.currencies)
      .map(([code, info]) => `${code}${info?.symbol ? ` (${info.symbol})` : ''}`)
      .join(', ')
  }

  return (
    <div className="country-card">
      <h3 className="country-header">
        <span className="country-name-wrapper">
          <span className="country-name">{country.name?.common}</span>

          {country.flags?.svg || country.flags?.png ? (
            <img
              src={country.flags?.svg || country.flags?.png}
              alt={`${country.name?.common} flag`}
              className="country-flag"
            />
          ) : null}
        </span>

        {/* Heart icon */}
        <div
          onClick={handleToggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`favorite-icon ${isFavorite ? 'active' : ''}`}
        >
          {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </div>
      </h3>

      <div className="country-info">
        <p>
          <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
        </p>
        <p>
          <strong>Population:</strong> {(country.population || 0).toLocaleString()}
        </p>
        <p>
          <strong>Currency:</strong> {getCurrencies()}
        </p>

        <div className="details-btn-wrapper">
          <button onClick={() => setShowDetails(true)} className="details-btn">
            Details
          </button>
        </div>
      </div>

      {showDetails && (
        <CountryDetailsModal
          country={country}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  )
}
