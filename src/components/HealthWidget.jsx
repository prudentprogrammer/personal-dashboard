import Widget from './Widget'
import './HealthWidget.css'

// Mock health data - can be replaced with fitness API integration
const healthData = {
  steps: { current: 7842, goal: 10000 },
  water: { current: 6, goal: 8 },
  sleep: { hours: 7.5, quality: 'good' },
  calories: { consumed: 1650, goal: 2000 },
}

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
  const stepsProgress = (healthData.steps.current / healthData.steps.goal) * 100
  const waterProgress = (healthData.water.current / healthData.water.goal) * 100
  const caloriesProgress = (healthData.calories.consumed / healthData.calories.goal) * 100
  const sleepProgress = (healthData.sleep.hours / 8) * 100

  return (
    <Widget title="Health" size="medium" className={className}>
      <div className="health">
        <HealthMetric
          icon="👣"
          label="Steps"
          value={healthData.steps.current.toLocaleString()}
          subtext={`/ ${healthData.steps.goal.toLocaleString()}`}
          progress={Math.min(stepsProgress, 100)}
          color="var(--accent)"
        />
        <HealthMetric
          icon="💧"
          label="Water"
          value={`${healthData.water.current} cups`}
          subtext={`/ ${healthData.water.goal} cups`}
          progress={Math.min(waterProgress, 100)}
          color="#38bdf8"
        />
        <HealthMetric
          icon="😴"
          label="Sleep"
          value={`${healthData.sleep.hours}h`}
          subtext={healthData.sleep.quality}
          progress={Math.min(sleepProgress, 100)}
          color="#a78bfa"
        />
        <HealthMetric
          icon="🔥"
          label="Calories"
          value={healthData.calories.consumed}
          subtext={`/ ${healthData.calories.goal}`}
          progress={Math.min(caloriesProgress, 100)}
          color="#fb923c"
        />
      </div>
    </Widget>
  )
}

export default HealthWidget
