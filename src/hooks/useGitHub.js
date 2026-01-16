import { useState } from 'react'

// Mock GitHub data - replace with GitHub API
const mockGitHubData = {
  username: 'lakshmi',
  contributions: {
    today: 5,
    thisWeek: 23,
    streak: 7,
  },
  recentActivity: [
    { id: 1, type: 'push', repo: 'personal-dashboard', message: 'Add new widgets', time: '2h ago' },
    { id: 2, type: 'pr', repo: 'awesome-project', message: 'Fix authentication bug', time: '5h ago' },
    { id: 3, type: 'push', repo: 'personal-dashboard', message: 'Update README', time: '1d ago' },
    { id: 4, type: 'issue', repo: 'open-source-lib', message: 'Report memory leak', time: '2d ago' },
  ],
  // Simplified contribution graph (last 7 days)
  contributionGraph: [3, 5, 2, 7, 4, 6, 5],
}

const activityIcons = {
  push: '📤',
  pr: '🔀',
  issue: '🐛',
  star: '⭐',
}

export function useGitHub() {
  const [data] = useState(mockGitHubData)
  const [loading] = useState(false)

  return {
    data,
    loading,
    activityIcons,
  }
}
