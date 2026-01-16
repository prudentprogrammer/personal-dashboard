import { useState } from 'react'
import Widget from './Widget'
import { useWeather } from '../hooks/useWeather'
import './WeatherWidget.css'

function WeatherConfig({ onConfigure }) {
  const [apiKey, setApiKey] = useState('')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (apiKey && lat && lon) {
      onConfigure(apiKey, parseFloat(lat), parseFloat(lon))
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toFixed(4))
          setLon(position.coords.longitude.toFixed(4))
        },
        () => alert('Unable to get location')
      )
    }
  }

  return (
    <form className="weather-config" onSubmit={handleSubmit}>
      <p className="weather-config__hint">Using mock data. Configure API for live weather.</p>
      <input
        type="text"
        placeholder="OpenWeatherMap API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="weather-config__input"
      />
      <div className="weather-config__coords">
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="weather-config__input weather-config__input--small"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          className="weather-config__input weather-config__input--small"
        />
        <button type="button" onClick={handleGetLocation} className="weather-config__locate" title="Use my location">
          📍
        </button>
      </div>
      <button type="submit" className="weather-config__submit">Save</button>
    </form>
  )
}

function WeatherWidget() {
  const { weather, loading, error, weatherIcons, isConfigured, configure, unit, toggleUnit, convertTemp } = useWeather()
  const [showConfig, setShowConfig] = useState(false)

  if (loading) {
    return (
      <Widget title="Weather" size="medium">
        <div className="weather weather--loading">Loading...</div>
      </Widget>
    )
  }

  const handleConfigure = (apiKey, lat, lon) => {
    configure(apiKey, lat, lon)
    setShowConfig(false)
  }

  return (
    <Widget
      title="Weather"
      size="medium"
      headerAction={
        <div className="weather__header-actions">
          <button
            className="widget__header-btn"
            onClick={toggleUnit}
            title={`Switch to °${unit === 'F' ? 'C' : 'F'}`}
          >
            °{unit}
          </button>
          <button
            className="widget__header-btn"
            onClick={() => setShowConfig(!showConfig)}
            title="Configure weather"
          >
            {isConfigured ? '✓' : '⚙️'}
          </button>
        </div>
      }
    >
      {showConfig ? (
        <WeatherConfig onConfigure={handleConfigure} />
      ) : (
        <div className="weather">
          {error && <div className="weather__error">{error}</div>}
          <div className="weather__current">
            <span className="weather__icon">
              {weatherIcons[weather.current.condition] || '🌤️'}
            </span>
            <div className="weather__temp">{convertTemp(weather.current.temp)}°</div>
            <div className="weather__details">
              <div className="weather__location">{weather.location}</div>
              <div className="weather__meta">
                Feels like {convertTemp(weather.current.feelsLike)}° • {weather.current.humidity}% humidity
              </div>
            </div>
          </div>

          <div className="weather__forecast">
            {weather.forecast.map((day) => (
              <div key={day.day} className="weather__forecast-day">
                <span className="weather__forecast-label">{day.day}</span>
                <span className="weather__forecast-icon">
                  {weatherIcons[day.condition] || '🌤️'}
                </span>
                <span className="weather__forecast-temps">
                  <span className="weather__forecast-high">{convertTemp(day.high)}°</span>
                  <span className="weather__forecast-low">{convertTemp(day.low)}°</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Widget>
  )
}

export default WeatherWidget
