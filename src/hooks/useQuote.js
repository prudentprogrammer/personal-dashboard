import { useState, useEffect, useCallback } from 'react'

// Fallback quotes if API fails
const fallbackQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
]

const STORAGE_KEY = 'dashboard-quote'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

function getRandomQuote() {
  return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
}

export function useQuote() {
  const [quote, setQuote] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        const { quote: savedQuote, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return savedQuote
        }
      }
    } catch {
      // Ignore errors
    }
    return getRandomQuote()
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      quote,
      timestamp: Date.now(),
    }))
  }, [quote])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      // Try fetching from ZenQuotes API via a proxy to avoid CORS
      const response = await fetch('https://api.quotable.io/random')
      if (response.ok) {
        const data = await response.json()
        setQuote({ text: data.content, author: data.author })
      } else {
        throw new Error('API failed')
      }
    } catch {
      // Fallback to local quotes
      setQuote(getRandomQuote())
    } finally {
      setLoading(false)
    }
  }, [])

  return { quote, loading, refresh }
}
