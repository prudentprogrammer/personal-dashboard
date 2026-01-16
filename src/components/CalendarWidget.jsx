import { useState } from 'react'
import Widget from './Widget'
import { useCalendar } from '../hooks/useCalendar'
import './CalendarWidget.css'

function CalendarConfig({ onConfigure }) {
  const [icalUrl, setIcalUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (icalUrl.trim()) {
      onConfigure(icalUrl.trim())
    }
  }

  return (
    <form className="calendar-config" onSubmit={handleSubmit}>
      <p className="calendar-config__hint">
        Enter your Google Calendar secret iCal URL:
      </p>
      <p className="calendar-config__instructions">
        Calendar Settings → Your calendar → "Secret address in iCal format"
      </p>
      <input
        type="url"
        placeholder="https://calendar.google.com/calendar/ical/..."
        value={icalUrl}
        onChange={(e) => setIcalUrl(e.target.value)}
        className="calendar-config__input"
      />
      <button type="submit" className="calendar-config__submit">Connect Calendar</button>
    </form>
  )
}

function CalendarWidget({ className = '' }) {
  const { todayEvents, upcomingEvents, loading, error, isConfigured, configure } = useCalendar()
  const [showConfig, setShowConfig] = useState(false)

  const handleConfigure = (url) => {
    configure(url)
    setShowConfig(false)
  }

  if (loading) {
    return (
      <Widget title="Calendar" size="medium" className={className}>
        <div className="calendar calendar--loading">Loading...</div>
      </Widget>
    )
  }

  return (
    <Widget
      title="Calendar"
      size="medium"
      className={className}
      headerAction={
        <button
          className="widget__header-btn"
          onClick={() => setShowConfig(!showConfig)}
          title="Configure calendar"
        >
          {isConfigured ? '✓' : '⚙️'}
        </button>
      }
    >
      {showConfig ? (
        <CalendarConfig onConfigure={handleConfigure} />
      ) : (
        <div className="calendar">
          {error && <div className="calendar__error">{error}</div>}

          <div className="calendar__section">
            <h3 className="calendar__section-title">Today</h3>
            <div className="calendar__events">
              {todayEvents.map((event) => (
                <div key={event.id} className="calendar__event">
                  <div
                    className="calendar__event-indicator"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="calendar__event-content">
                    <div className="calendar__event-title">{event.title}</div>
                    <div className="calendar__event-time">
                      {event.time}{event.duration && ` • ${event.duration}`}
                    </div>
                  </div>
                </div>
              ))}
              {todayEvents.length === 0 && (
                <p className="calendar__empty">No events today</p>
              )}
            </div>
          </div>

          <div className="calendar__section">
            <h3 className="calendar__section-title">Upcoming</h3>
            <div className="calendar__events">
              {upcomingEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="calendar__event">
                  <div
                    className="calendar__event-indicator"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="calendar__event-content">
                    <div className="calendar__event-title">{event.title}</div>
                    <div className="calendar__event-time">
                      {event.date} • {event.time}
                    </div>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="calendar__empty">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Widget>
  )
}

export default CalendarWidget
