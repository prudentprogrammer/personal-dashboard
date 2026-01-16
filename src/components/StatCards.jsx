import './StatCards.css'

const stats = [
  { id: 'focus', icon: '🔥', label: 'Focus Score', value: '84%', color: '#f97316' },
  { id: 'sleep', icon: '😴', label: 'Sleep', value: '7h 45m', color: '#3b82f6' },
  { id: 'savings', icon: '💰', label: 'Savings', value: '$1,250', color: '#a855f7' },
  { id: 'calories', icon: '🍎', label: 'Calories', value: '1,850', color: '#10b981' },
]

function StatCards() {
  return (
    <div className="stat-cards">
      {stats.map((stat) => (
        <div key={stat.id} className="stat-card">
          <div
            className="stat-card__icon"
            style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
          >
            {stat.icon}
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">{stat.label}</span>
            <span className="stat-card__value">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatCards
