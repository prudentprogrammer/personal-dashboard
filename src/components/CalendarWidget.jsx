import Widget from './Widget'
import { useCalendar } from '../hooks/useCalendar'
import './CalendarWidget.css'

function CalendarWidget({ className = '' }) {
  const { todayEvents, upcomingEvents } = useCalendar()

  return (
    <Widget title="Calendar" size="medium" className={className}>
      <div className="calendar">
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
                    {event.time} • {event.duration}
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
            {upcomingEvents.map((event) => (
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
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default CalendarWidget
