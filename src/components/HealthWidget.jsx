import Widget from './Widget'
import { useHealth } from '../hooks/useHealth'
import './HealthWidget.css'

function ProgressRing({ progress, size = 60, strokeWidth = 6, color }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        className="progress-ring__background"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="progress-ring__progress"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset: offset,
          stroke: color,
        }}
      />
    </svg>
  )
}

function HealthMetric({ icon, label, value, subtext, progress, color }) {
  return (
    <div className="health__metric">
      <div className="health__metric-ring">
        <ProgressRing progress={progress} color={color} />
        <span className="health__metric-icon">{icon}</span>
      </div>
      <div className="health__metric-info">
        <div className="health__metric-value">{value}</div>
        <div className="health__metric-label">{label}</div>
        {subtext && <div className="health__metric-subtext">{subtext}</div>}
      </div>
    </div>
  )
}

function HealthWidget({ className = '' }) {
  const { metrics } = useHealth()

  return (
    <Widget title="Health" size="medium" className={className}>
      <div className="health">
        <HealthMetric
          icon={metrics.steps.icon}
          label={metrics.steps.label}
          value={metrics.steps.displayValue}
          subtext={`/ ${metrics.steps.displayGoal}`}
          progress={metrics.steps.progress}
          color={metrics.steps.color}
        />
        <HealthMetric
          icon={metrics.water.icon}
          label={metrics.water.label}
          value={metrics.water.displayValue}
          subtext={`/ ${metrics.water.displayGoal}`}
          progress={metrics.water.progress}
          color={metrics.water.color}
        />
        <HealthMetric
          icon={metrics.sleep.icon}
          label={metrics.sleep.label}
          value={metrics.sleep.displayValue}
          subtext={metrics.sleep.displayGoal}
          progress={metrics.sleep.progress}
          color={metrics.sleep.color}
        />
        <HealthMetric
          icon={metrics.calories.icon}
          label={metrics.calories.label}
          value={metrics.calories.displayValue}
          subtext={`/ ${metrics.calories.displayGoal}`}
          progress={metrics.calories.progress}
          color={metrics.calories.color}
        />
      </div>
    </Widget>
  )
}

export default HealthWidget
