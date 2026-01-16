import { useState, useEffect, useCallback, useMemo } from 'react'
import { calendarEvents as mockEvents } from '../data/mockData'

const STORAGE_KEY = 'dashboard-calendar-config'
const CACHE_KEY = 'dashboard-calendar-cache'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

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

// Parse iCal date format (e.g., "20250116T090000Z" or "20250116")
function parseICalDate(dateStr, tzid) {
  if (!dateStr) return null

  // Remove any quotes
  dateStr = dateStr.replace(/"/g, '')

  // Handle all-day events (just date, no time)
  if (dateStr.length === 8) {
    const year = parseInt(dateStr.slice(0, 4))
    const month = parseInt(dateStr.slice(4, 6)) - 1
    const day = parseInt(dateStr.slice(6, 8))
    return new Date(year, month, day)
  }

  // Handle datetime format
  const year = parseInt(dateStr.slice(0, 4))
  const month = parseInt(dateStr.slice(4, 6)) - 1
  const day = parseInt(dateStr.slice(6, 8))
  const hour = parseInt(dateStr.slice(9, 11)) || 0
  const minute = parseInt(dateStr.slice(11, 13)) || 0
  const second = parseInt(dateStr.slice(13, 15)) || 0

  // If ends with Z, it's UTC
  if (dateStr.endsWith('Z')) {
    return new Date(Date.UTC(year, month, day, hour, minute, second))
  }

  // Otherwise treat as local time
  return new Date(year, month, day, hour, minute, second)
}

// Parse iCal content
function parseICal(icalContent) {
  const events = []
  const lines = icalContent.split(/\r?\n/)

  let currentEvent = null
  let currentKey = null
  let currentValue = ''

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Handle line folding (lines starting with space/tab are continuations)
    if (line.startsWith(' ') || line.startsWith('\t')) {
      currentValue += line.slice(1)
      continue
    }

    // Process the previous key-value pair
    if (currentKey && currentEvent) {
      processKeyValue(currentEvent, currentKey, currentValue)
    }

    // Parse new line
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    currentKey = line.slice(0, colonIndex)
    currentValue = line.slice(colonIndex + 1)

    if (line === 'BEGIN:VEVENT') {
      currentEvent = {}
    } else if (line === 'END:VEVENT' && currentEvent) {
      // Process the last key-value
      if (currentKey) {
        processKeyValue(currentEvent, currentKey, currentValue)
      }

      if (currentEvent.summary && currentEvent.start) {
        events.push(currentEvent)
      }
      currentEvent = null
      currentKey = null
    }
  }

  return events
}

function processKeyValue(event, key, value) {
  // Handle keys with parameters (e.g., "DTSTART;TZID=America/New_York")
  const [baseKey, ...params] = key.split(';')
  const tzid = params.find(p => p.startsWith('TZID='))?.split('=')[1]

  switch (baseKey) {
    case 'SUMMARY':
      event.summary = value.replace(/\\,/g, ',').replace(/\\n/g, ' ')
      break
    case 'DTSTART':
      event.start = parseICalDate(value, tzid)
      event.allDay = value.length === 8
      break
    case 'DTEND':
      event.end = parseICalDate(value, tzid)
      break
    case 'DESCRIPTION':
      event.description = value.replace(/\\,/g, ',').replace(/\\n/g, '\n')
      break
    case 'LOCATION':
      event.location = value.replace(/\\,/g, ',')
      break
    case 'UID':
      event.uid = value
      break
  }
}

// Format time for display
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Format duration
function formatDuration(start, end) {
  if (!end) return ''
  const diffMs = end - start
  const diffMins = Math.round(diffMs / 60000)

  if (diffMins < 60) return `${diffMins}m`
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

// Generate a color based on event title
function getEventColor(title) {
  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Convert parsed iCal events to our format
function convertEvents(icalEvents) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  return icalEvents
    .filter(e => e.start >= today && e.start < nextWeek)
    .sort((a, b) => a.start - b.start)
    .map((e, i) => {
      const isToday = e.start >= today && e.start < tomorrow

      return {
        id: e.uid || `event-${i}`,
        title: e.summary,
        time: e.allDay ? 'All day' : formatTime(e.start),
        duration: e.allDay ? '' : formatDuration(e.start, e.end),
        date: isToday ? 'Today' : e.start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        color: getEventColor(e.summary),
        isToday,
        start: e.start,
      }
    })
}

// Fetch iCal from URL (using a CORS proxy since Google Calendar doesn't allow direct fetch)
async function fetchICal(url) {
  // Try direct fetch first
  try {
    const response = await fetch(url)
    if (response.ok) {
      return await response.text()
    }
  } catch {
    // Direct fetch failed, try CORS proxy
  }

  // Use codetabs CORS proxy (more reliable for Google Calendar)
  const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  const response = await fetch(proxyUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch calendar')
  }

  return await response.text()
}

export function useCalendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isConfigured, setIsConfigured] = useState(false)

  const fetchCalendar = useCallback(async () => {
    const config = getConfig()
    if (!config?.icalUrl) {
      setEvents(mockEvents)
      setIsConfigured(false)
      return
    }

    setIsConfigured(true)

    // Check cache first
    const cached = getCache()
    if (cached) {
      setEvents(cached)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const icalContent = await fetchICal(config.icalUrl)
      const parsedEvents = parseICal(icalContent)
      const convertedEvents = convertEvents(parsedEvents)
      setEvents(convertedEvents)
      setCache(convertedEvents)
    } catch (err) {
      setError(err.message)
      setEvents(mockEvents)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCalendar()

    // Refresh every 15 minutes
    const interval = setInterval(fetchCalendar, CACHE_DURATION)
    return () => clearInterval(interval)
  }, [fetchCalendar])

  const configure = useCallback(async (icalUrl) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ icalUrl }))
    localStorage.removeItem(CACHE_KEY)

    setLoading(true)
    setError(null)

    try {
      const icalContent = await fetchICal(icalUrl)
      const parsedEvents = parseICal(icalContent)
      const convertedEvents = convertEvents(parsedEvents)
      setEvents(convertedEvents)
      setCache(convertedEvents)
      setIsConfigured(true)
    } catch (err) {
      setError(err.message)
      setEvents(mockEvents)
    } finally {
      setLoading(false)
    }
  }, [])

  const todayEvents = useMemo(
    () => events.filter((e) => e.isToday),
    [events]
  )

  const upcomingEvents = useMemo(
    () => events.filter((e) => !e.isToday),
    [events]
  )

  return {
    events,
    todayEvents,
    upcomingEvents,
    loading,
    error,
    isConfigured,
    configure,
    refresh: fetchCalendar,
  }
}
