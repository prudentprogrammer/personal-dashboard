import { useState } from 'react'
import Widget from './Widget'
import './CalendarWidget.css'

// Mock events data - can be replaced with calendar API integration
const mockEvents = [
  {
    id: 1,
    title: 'Team standup',
    time: '09:00 AM',
    duration: '30m',
    color: '#646cff',
    isToday: true,
  },
  {
    id: 2,
    title: 'Project review',
    time: '11:00 AM',
    duration: '1h',
    color: '#4ade80',
    isToday: true,
  },
  {
    id: 3,
    title: 'Lunch with Alex',
    time: '12:30 PM',
    duration: '1h',
    color: '#fbbf24',
    isToday: true,
  },
  {
    id: 4,
    title: 'Design workshop',
    time: '02:00 PM',
    duration: '2h',
    color: '#f87171',
    isToday: false,
    date: 'Tomorrow',
  },
  {
    id: 5,
    title: 'Weekly planning',
    time: '10:00 AM',
    duration: '1h',
    color: '#a78bfa',
    isToday: false,
    date: 'Wed, Jan 15',
  },
]

function CalendarWidget({ className = '' }) {
  const [events] = useState(mockEvents)

  const todayEvents = events.filter((e) => e.isToday)
  const upcomingEvents = events.filter((e) => !e.isToday)

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
