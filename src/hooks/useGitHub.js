import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'dashboard-github-config'
const CACHE_KEY = 'dashboard-github-cache'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

// Mock GitHub data for fallback
const mockGitHubData = {
  username: 'demo',
  contributions: {
    today: 5,
    thisWeek: 23,
    streak: 7,
  },
  recentActivity: [
    { id: 1, type: 'push', repo: 'personal-dashboard', message: 'Add new widgets', time: '2h ago' },
    { id: 2, type: 'pr', repo: 'awesome-project', message: 'Fix authentication bug', time: '5h ago' },
    { id: 3, type: 'push', repo: 'personal-dashboard', message: 'Update README', time: '1d ago' },
  ],
  contributionGraph: [3, 5, 2, 7, 4, 6, 5],
}

export const activityIcons = {
  push: '📤',
  pr: '🔀',
  issue: '🐛',
  star: '⭐',
  fork: '🍴',
  create: '✨',
  watch: '👀',
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

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function mapEventType(event) {
  switch (event.type) {
    case 'PushEvent':
      return 'push'
    case 'PullRequestEvent':
      return 'pr'
    case 'IssuesEvent':
      return 'issue'
    case 'WatchEvent':
      return 'star'
    case 'ForkEvent':
      return 'fork'
    case 'CreateEvent':
      return 'create'
    default:
      return 'push'
  }
}

function getEventMessage(event) {
  switch (event.type) {
    case 'PushEvent':
      return event.payload?.commits?.[0]?.message?.split('\n')[0] || 'Pushed commits'
    case 'PullRequestEvent':
      return event.payload?.pull_request?.title || 'Pull request activity'
    case 'IssuesEvent':
      return event.payload?.issue?.title || 'Issue activity'
    case 'WatchEvent':
      return 'Starred repository'
    case 'ForkEvent':
      return 'Forked repository'
    case 'CreateEvent':
      return `Created ${event.payload?.ref_type || 'repository'}`
    default:
      return event.type.replace('Event', '')
  }
}

async function fetchFromGitHub(username) {
  // Fetch user events
  const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=10`)
  const events = await eventsRes.json()

  if (!eventsRes.ok) {
    throw new Error(events.message || 'Failed to fetch GitHub data')
  }

  // Handle empty events (user exists but no public activity)
  if (!Array.isArray(events) || events.length === 0) {
    return {
      username,
      contributions: { today: 0, thisWeek: 0, streak: 0 },
      recentActivity: [],
      contributionGraph: [0, 0, 0, 0, 0, 0, 0],
      noPublicActivity: true,
    }
  }

  // Process events into activity
  const recentActivity = events.slice(0, 5).map((event, i) => ({
    id: event.id || i,
    type: mapEventType(event),
    repo: event.repo?.name?.split('/')[1] || event.repo?.name || 'unknown',
    message: getEventMessage(event),
    time: formatTimeAgo(event.created_at),
  }))

  // Count contributions by day (simplified - based on push events)
  const today = new Date()
  const last7Days = Array(7).fill(0)
  let todayContribs = 0
  let weekContribs = 0

  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const eventDate = new Date(event.created_at)
      const dayDiff = Math.floor((today - eventDate) / 86400000)
      const commitCount = event.payload?.commits?.length || 1

      if (dayDiff < 7) {
        last7Days[6 - dayDiff] += commitCount
        weekContribs += commitCount
        if (dayDiff === 0) todayContribs += commitCount
      }
    }
  })

  // Calculate streak (simplified - consecutive days with activity)
  let streak = 0
  for (let i = last7Days.length - 1; i >= 0; i--) {
    if (last7Days[i] > 0) streak++
    else break
  }

  return {
    username,
    contributions: {
      today: todayContribs,
      thisWeek: weekContribs,
      streak,
    },
    recentActivity,
    contributionGraph: last7Days,
  }
}

export function useGitHub() {
  const [data, setData] = useState(mockGitHubData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isConfigured, setIsConfigured] = useState(false)

  const fetchData = useCallback(async () => {
    const config = getConfig()
    if (!config?.username) {
      setData(mockGitHubData)
      setIsConfigured(false)
      return
    }

    setIsConfigured(true)

    // Check cache first
    const cached = getCache()
    if (cached) {
      setData(cached)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fetchFromGitHub(config.username)
      setData(result)
      setCache(result)
    } catch (err) {
      setError(err.message)
      setData(mockGitHubData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // Refresh every 15 minutes
    const interval = setInterval(fetchData, CACHE_DURATION)
    return () => clearInterval(interval)
  }, [fetchData])

  const configure = useCallback(async (username) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ username }))
    localStorage.removeItem(CACHE_KEY)
    // Force immediate fetch bypassing cache
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFromGitHub(username)
      setData(result)
      setCache(result)
      setIsConfigured(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    error,
    activityIcons,
    isConfigured,
    configure,
  }
}
