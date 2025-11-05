// components/CountryDetailsModal.js
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

export default function CountryDetailsModal({ country, onClose }) {
  const [weather, setWeather] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      if (!country.capital?.[0]) return

      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: country.capital[0],
            appid: apiKey,
            units: 'metric',
          },
        })
        setWeather(response.data)
      } catch (err) {
        console.error('Weather fetch error:', err)
        setWeather(null)
      }
    }

    fetchWeather()
  }, [country.capital])

  // If not mounted (e.g. during SSR) don't try to render portal
  if (!mounted) return null

  const modal = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={onClose} className="modal-close-btn">
          ×
        </button>

        {/* Country Header */}
        <h2 className="modal-header">
          {country.name.common}
          {country.flags?.svg && (
            <img
              src={country.flags.svg}
              alt={`${country.name.common} flag`}
              className="modal-flag"
            />
          )}
        </h2>

        {/* Basic Info */}
        <div className="modal-info">
          <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
          <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
          <p>
            <strong>Currency:</strong>{' '}
            {country.currencies
              ? Object.entries(country.currencies)
                  .map(([code, info]) => `${code}${info.symbol ? ` (${info.symbol})` : ''}`)
                  .join(', ')
              : 'N/A'}
          </p>
        </div>

        {/* Google Map */}
        {country.latlng && (
          <iframe
            width="100%"
            height="300"
            className="modal-map"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(country.capital?.[0] || country.name.common)}`}
          ></iframe>
        )}

        {/* Weather */}
        {weather ? (
          <div className="modal-weather">
            <h4>Weather in {country.capital?.[0]}</h4>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Condition: {weather.weather[0].description}</p>
          </div>
        ) : (
          <p className="modal-weather">No weather data available</p>
        )}
      </div>
    </div>
  )

  return ReactDOM.createPortal(modal, document.body)
}
