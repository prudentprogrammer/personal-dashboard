import Widget from './Widget'
import { usePomodoro } from '../hooks/usePomodoro'
import './PomodoroWidget.css'

const modeLabels = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

function PomodoroWidget({ className = '' }) {
  const {
    formattedTime,
    isRunning,
    mode,
    sessionsCompleted,
    progress,
    start,
    pause,
    reset,
    switchMode,
  } = usePomodoro()

  return (
    <Widget title="Pomodoro" size="medium" className={className}>
      <div className="pomodoro">
        <div className="pomodoro__modes">
          {Object.entries(modeLabels).map(([key, label]) => (
            <button
              key={key}
              className={`pomodoro__mode ${mode === key ? 'pomodoro__mode--active' : ''}`}
              onClick={() => switchMode(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pomodoro__timer">
          <svg className="pomodoro__progress" viewBox="0 0 100 100">
            <circle
              className="pomodoro__progress-bg"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="pomodoro__progress-fill"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
              }}
            />
          </svg>
          <div className="pomodoro__time">{formattedTime}</div>
        </div>

        <div className="pomodoro__controls">
          {isRunning ? (
            <button className="pomodoro__btn pomodoro__btn--pause" onClick={pause}>
              Pause
            </button>
          ) : (
            <button className="pomodoro__btn pomodoro__btn--start" onClick={start}>
              Start
            </button>
          )}
          <button className="pomodoro__btn pomodoro__btn--reset" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="pomodoro__sessions">
          {sessionsCompleted} sessions completed
        </div>
      </div>
    </Widget>
  )
}

export default PomodoroWidget
