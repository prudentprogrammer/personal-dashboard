import Widget from './Widget'
import { useHabits } from '../hooks/useHabits'
import './HabitsWidget.css'

function ProgressRing({ progress, color, size = 64, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg className="progress-ring" width={size} height={size}>
      <circle
        className="progress-ring__bg"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className="progress-ring__progress"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ stroke: color }}
      />
    </svg>
  )
}

const habitColors = {
  '🏃': '#f97316', // orange
  '📖': '#3b82f6', // blue
  '🧘': '#a855f7', // purple
  '💧': '#06b6d4', // cyan
  '✨': '#eab308', // yellow
}

function HabitsWidget({ className = '' }) {
  const { habits, completedCount, totalCount, toggleHabit } = useHabits()

  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <Widget title="Habits" size="medium" className={className}>
      <div className="habits">
        <div className="habits__rings">
          {habits.slice(0, 4).map((habit) => {
            const color = habitColors[habit.icon] || '#6b7280'
            const progress = habit.completedToday ? 100 : 0

            return (
              <button
                key={habit.id}
                className={`habits__ring-item ${habit.completedToday ? 'habits__ring-item--done' : ''}`}
                onClick={() => toggleHabit(habit.id)}
                title={`${habit.name} - ${habit.completedToday ? 'Done!' : 'Click to complete'}`}
              >
                <div className="habits__ring-container">
                  <ProgressRing progress={progress} color={color} size={56} strokeWidth={5} />
                  <span className="habits__ring-icon">{habit.icon}</span>
                </div>
                <span className="habits__ring-name">{habit.name}</span>
                <span className="habits__ring-streak">🔥 {habit.streak}</span>
              </button>
            )
          })}
        </div>

        <div className="habits__summary">
          <div className="habits__summary-ring">
            <ProgressRing progress={overallProgress} color="var(--success)" size={48} strokeWidth={4} />
            <span className="habits__summary-percent">{overallProgress}%</span>
          </div>
          <div className="habits__summary-text">
            <span className="habits__summary-count">{completedCount}/{totalCount}</span>
            <span className="habits__summary-label">completed today</span>
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default HabitsWidget
