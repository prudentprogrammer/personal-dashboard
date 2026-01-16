import { useState, useEffect } from 'react'
import { weatherData } from '../data/mockData'

export const weatherIcons = {
  sunny: '☀️',
  cloudy: '☁️',
  partlyCloudy: '⛅',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '🌨️',
  foggy: '🌫️',
}

export function useWeather() {
  const [weather, setWeather] = useState(weatherData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // TODO: Replace with actual API call
    // async function fetchWeather() {
    //   setLoading(true)
    //   try {
    //     const response = await fetch(`API_URL?location=${location}`)
    //     const data = await response.json()
    //     setWeather(data)
    //   } catch (err) {
    //     setError(err.message)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    // fetchWeather()
  }, [])

  return {
    weather,
    loading,
    error,
    weatherIcons,
  }
}
