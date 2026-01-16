import { useState, useEffect } from 'react'
import Widget from './Widget'
import './WeatherWidget.css'

// Weather condition icons (using unicode for simplicity)
const weatherIcons = {
  sunny: '☀️',
  cloudy: '☁️',
  partlyCloudy: '⛅',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '🌨️',
  foggy: '🌫️',
}

// Mock weather data - replace with API call
const mockWeather = {
  location: 'San Francisco',
  current: {
    temp: 68,
    condition: 'partlyCloudy',
    humidity: 65,
    wind: 12,
    feelsLike: 66,
  },
  forecast: [
    { day: 'Mon', high: 70, low: 58, condition: 'sunny' },
    { day: 'Tue', high: 68, low: 56, condition: 'partlyCloudy' },
    { day: 'Wed', high: 65, low: 54, condition: 'cloudy' },
    { day: 'Thu', high: 62, low: 52, condition: 'rainy' },
    { day: 'Fri', high: 66, low: 55, condition: 'partlyCloudy' },
  ],
}

function WeatherWidget() {
  const [weather, setWeather] = useState(mockWeather)
  const [loading, setLoading] = useState(false)

  // Placeholder for future API integration
  useEffect(() => {
    // TODO: Fetch real weather data
    // async function fetchWeather() {
    //   setLoading(true)
    //   const response = await fetch(`API_URL?location=${location}`)
    //   const data = await response.json()
    //   setWeather(data)
    //   setLoading(false)
    // }
    // fetchWeather()
  }, [])

  if (loading) {
    return (
      <Widget title="Weather" size="medium">
        <div className="weather weather--loading">Loading...</div>
      </Widget>
    )
  }

  return (
    <Widget title="Weather" size="medium">
      <div className="weather">
        <div className="weather__current">
          <div className="weather__icon">
            {weatherIcons[weather.current.condition]}
          </div>
          <div className="weather__temp">{weather.current.temp}°</div>
          <div className="weather__details">
            <div className="weather__location">{weather.location}</div>
            <div className="weather__meta">
              Feels like {weather.current.feelsLike}° • {weather.current.humidity}% humidity
            </div>
          </div>
        </div>

        <div className="weather__forecast">
          {weather.forecast.map((day) => (
            <div key={day.day} className="weather__forecast-day">
              <span className="weather__forecast-label">{day.day}</span>
              <span className="weather__forecast-icon">
                {weatherIcons[day.condition]}
              </span>
              <span className="weather__forecast-temps">
                <span className="weather__forecast-high">{day.high}°</span>
                <span className="weather__forecast-low">{day.low}°</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

export default WeatherWidget
