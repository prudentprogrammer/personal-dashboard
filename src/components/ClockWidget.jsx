import { useState, useEffect } from 'react'
import Widget from './Widget'
import './ClockWidget.css'

function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatSeconds = (date) => {
    return date.toLocaleTimeString('en-US', {
      second: '2-digit',
    }).slice(-2)
  }

  return (
    <Widget title="Clock" size="medium">
      <div className="clock">
        <div className="clock__time">
          {formatTime(time)}
          <span className="clock__seconds">{formatSeconds(time)}</span>
        </div>
        <div className="clock__date">{formatDate(time)}</div>
      </div>
    </Widget>
  )
}

export default ClockWidget
