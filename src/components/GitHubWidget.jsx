import { useState } from 'react'
import Widget from './Widget'
import { useGitHub } from '../hooks/useGitHub'
import './GitHubWidget.css'

function GitHubConfig({ onConfigure }) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      onConfigure(username.trim())
    }
  }

  return (
    <form className="github-config" onSubmit={handleSubmit}>
      <p className="github-config__hint">Using demo data. Enter your GitHub username for live data.</p>
      <input
        type="text"
        placeholder="GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="github-config__input"
      />
      <button type="submit" className="github-config__submit">Save</button>
    </form>
  )
}

function GitHubWidget({ className = '' }) {
  const { data, loading, error, activityIcons, isConfigured, configure } = useGitHub()
  const [showConfig, setShowConfig] = useState(false)

  const maxContribution = Math.max(...data.contributionGraph, 1)

  const handleConfigure = (username) => {
    configure(username)
    setShowConfig(false)
  }

  if (loading) {
    return (
      <Widget title="GitHub" size="medium" className={className}>
        <div className="github github--loading">Loading...</div>
      </Widget>
    )
  }

  return (
    <Widget
      title="GitHub"
      size="medium"
      className={className}
      headerAction={
        <button
          className="widget__header-btn"
          onClick={() => setShowConfig(!showConfig)}
          title="Configure GitHub"
        >
          {isConfigured ? '✓' : '⚙️'}
        </button>
      }
    >
      {showConfig ? (
        <GitHubConfig onConfigure={handleConfigure} />
      ) : (
        <div className="github">
          {error && <div className="github__error">{error}</div>}
          <div className="github__stats">
            <div className="github__stat">
              <span className="github__stat-value">{data.contributions.today}</span>
              <span className="github__stat-label">Today</span>
            </div>
            <div className="github__stat">
              <span className="github__stat-value">{data.contributions.thisWeek}</span>
              <span className="github__stat-label">This week</span>
            </div>
            <div className="github__stat">
              <span className="github__stat-value">{data.contributions.streak}🔥</span>
              <span className="github__stat-label">Streak</span>
            </div>
          </div>

          <div className="github__graph">
            {data.contributionGraph.map((count, i) => (
              <div
                key={i}
                className="github__graph-bar"
                style={{ height: `${(count / maxContribution) * 100}%` }}
                title={`${count} contributions`}
              />
            ))}
          </div>

          <div className="github__activity">
            {data.recentActivity.slice(0, 3).map((activity) => (
              <div key={activity.id} className="github__activity-item">
                <span className="github__activity-icon">
                  {activityIcons[activity.type] || '📌'}
                </span>
                <div className="github__activity-content">
                  <span className="github__activity-message">{activity.message}</span>
                  <span className="github__activity-meta">
                    {activity.repo} • {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Widget>
  )
}

export default GitHubWidget
