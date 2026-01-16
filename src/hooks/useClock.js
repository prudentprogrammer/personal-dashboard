import { useState, useEffect } from 'react'

export function useClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const formattedSeconds = time.toLocaleTimeString('en-US', {
    second: '2-digit',
  }).slice(-2)

  return {
    time,
    formattedTime,
    formattedDate,
    formattedSeconds,
  }
}
