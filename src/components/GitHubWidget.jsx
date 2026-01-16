import Widget from './Widget'
import { useGitHub } from '../hooks/useGitHub'
import './GitHubWidget.css'

function GitHubWidget({ className = '' }) {
  const { data, activityIcons } = useGitHub()

  const maxContribution = Math.max(...data.contributionGraph)

  return (
    <Widget title="GitHub" size="medium" className={className}>
      <div className="github">
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
                {activityIcons[activity.type]}
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
    </Widget>
  )
}

export default GitHubWidget
