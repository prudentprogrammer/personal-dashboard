import Widget from './Widget'
import { useHabits } from '../hooks/useHabits'
import './HabitsWidget.css'

function HabitsWidget({ className = '' }) {
  const { habits, completedCount, totalCount, toggleHabit } = useHabits()

  return (
    <Widget title="Habits" size="medium" className={className}>
      <div className="habits">
        <div className="habits__progress">
          <span className="habits__progress-text">
            {completedCount}/{totalCount} completed today
          </span>
          <div className="habits__progress-bar">
            <div
              className="habits__progress-fill"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        <div className="habits__list">
          {habits.map((habit) => (
            <button
              key={habit.id}
              className={`habits__item ${habit.completedToday ? 'habits__item--done' : ''}`}
              onClick={() => toggleHabit(habit.id)}
            >
              <span className="habits__icon">{habit.icon}</span>
              <span className="habits__name">{habit.name}</span>
              <span className="habits__streak">
                🔥 {habit.streak}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Widget>
  )
}

export default HabitsWidget
