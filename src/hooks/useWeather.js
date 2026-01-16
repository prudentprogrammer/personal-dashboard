import { useState, useEffect, useCallback } from 'react'
import { weatherData as mockWeatherData } from '../data/mockData'

const STORAGE_KEY = 'dashboard-weather-config'
const CACHE_KEY = 'dashboard-weather-cache'
const UNIT_KEY = 'dashboard-weather-unit'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

function getStoredUnit() {
  try {
    return localStorage.getItem(UNIT_KEY) || 'F'
  } catch {
    return 'F'
  }
}

function fahrenheitToCelsius(f) {
  return Math.round((f - 32) * 5 / 9)
}

export const weatherIcons = {
  sunny: '☀️',
  clear: '🌙',
  cloudy: '☁️',
  partlyCloudy: '⛅',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '❄️',
  foggy: '🌫️',
  mist: '🌫️',
  default: '🌤️',
}

// OpenWeatherMap icon codes to icon URLs (higher quality)
export const getWeatherIconUrl = (iconCode) => {
  if (!iconCode) return null
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

// Map OpenWeatherMap condition codes to our icons
const owmConditionMap = {
  '01d': 'sunny', '01n': 'clear',
  '02d': 'partlyCloudy', '02n': 'partlyCloudy',
  '03d': 'cloudy', '03n': 'cloudy',
  '04d': 'cloudy', '04n': 'cloudy',
  '09d': 'rainy', '09n': 'rainy',
  '10d': 'rainy', '10n': 'rainy',
  '11d': 'stormy', '11n': 'stormy',
  '13d': 'snowy', '13n': 'snowy',
  '50d': 'foggy', '50n': 'foggy',
}

function getConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function getCache() {
  try {
    const stored = localStorage.getItem(CACHE_KEY)
    if (stored) {
      const { data, timestamp } = JSON.parse(stored)
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data
      }
    }
  } catch {
    // Ignore
  }
  return null
}

function setCache(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now(),
  }))
}

async function fetchFromOpenWeatherMap(apiKey, lat, lon) {
  // Fetch current weather
  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  )
  const current = await currentRes.json()
  if (!currentRes.ok) {
    throw new Error(current.message || 'Failed to fetch current weather')
  }

  // Fetch 5-day forecast
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  )
  const forecastData = await forecastRes.json()
  if (!forecastRes.ok) {
    throw new Error(forecastData.message || 'Failed to fetch forecast')
  }

  // Process forecast - get one entry per day (noon)
  const dailyMap = new Map()
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toLocaleDateString('en-US', { weekday: 'short' })
    const hour = date.getHours()

    // Prefer midday readings
    if (!dailyMap.has(day) || Math.abs(hour - 12) < Math.abs(dailyMap.get(day).hour - 12)) {
      dailyMap.set(day, {
        day,
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: owmConditionMap[item.weather[0].icon] || 'cloudy',
        iconCode: item.weather[0].icon,
        hour,
      })
    }
  })

  const forecast = Array.from(dailyMap.values()).slice(0, 5)

  return {
    location: current.name,
    current: {
      temp: Math.round(current.main.temp),
      condition: owmConditionMap[current.weather[0].icon] || 'cloudy',
      iconCode: current.weather[0].icon,
      humidity: current.main.humidity,
      wind: Math.round(current.wind.speed),
      feelsLike: Math.round(current.main.feels_like),
    },
    forecast,
  }
}

export function useWeather() {
  const [weather, setWeather] = useState(mockWeatherData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isConfigured, setIsConfigured] = useState(false)
  const [unit, setUnit] = useState(getStoredUnit)

  const toggleUnit = useCallback(() => {
    setUnit(prev => {
      const newUnit = prev === 'F' ? 'C' : 'F'
      localStorage.setItem(UNIT_KEY, newUnit)
      return newUnit
    })
  }, [])

  const convertTemp = useCallback((temp) => {
    return unit === 'C' ? fahrenheitToCelsius(temp) : temp
  }, [unit])

  const fetchWeather = useCallback(async () => {
    const config = getConfig()
    if (!config?.apiKey || !config?.lat || !config?.lon) {
      setWeather(mockWeatherData)
      setIsConfigured(false)
      return
    }

    setIsConfigured(true)

    // Check cache first
    const cached = getCache()
    if (cached) {
      setWeather(cached)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchFromOpenWeatherMap(config.apiKey, config.lat, config.lon)
      setWeather(data)
      setCache(data)
    } catch (err) {
      setError(err.message)
      setWeather(mockWeatherData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather()

    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, CACHE_DURATION)
    return () => clearInterval(interval)
  }, [fetchWeather])

  const configure = useCallback(async (apiKey, lat, lon) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey, lat, lon }))
    localStorage.removeItem(CACHE_KEY)
    // Force immediate fetch bypassing cache
    setLoading(true)
    setError(null)
    try {
      const data = await fetchFromOpenWeatherMap(apiKey, lat, lon)
      setWeather(data)
      setCache(data)
      setIsConfigured(true)
    } catch (err) {
      setError(err.message)
      setWeather(mockWeatherData)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    weather,
    loading,
    error,
    weatherIcons,
    getWeatherIconUrl,
    isConfigured,
    configure,
    unit,
    toggleUnit,
    convertTemp,
  }
}
