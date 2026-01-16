import { useState, useMemo } from 'react'
import { calendarEvents } from '../data/mockData'

export function useCalendar() {
  const [events] = useState(calendarEvents)

  const todayEvents = useMemo(
    () => events.filter((e) => e.isToday),
    [events]
  )

  const upcomingEvents = useMemo(
    () => events.filter((e) => !e.isToday),
    [events]
  )

  return {
    events,
    todayEvents,
    upcomingEvents,
  }
}
