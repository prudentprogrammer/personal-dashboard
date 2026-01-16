import Widget from './Widget'
import { useClock } from '../hooks/useClock'
import './ClockWidget.css'

function ClockWidget() {
  const { formattedTime, formattedDate, formattedSeconds } = useClock()

  return (
    <Widget title="Clock" size="medium">
      <div className="clock">
        <div className="clock__time">
          {formattedTime}
          <span className="clock__seconds">{formattedSeconds}</span>
        </div>
        <div className="clock__date">{formattedDate}</div>
      </div>
    </Widget>
  )
}

export default ClockWidget
