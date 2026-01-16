import { useState, useEffect, useCallback, useRef } from 'react'

const WORK_DURATION = 25 * 60 // 25 minutes in seconds
const SHORT_BREAK = 5 * 60   // 5 minutes
const LONG_BREAK = 15 * 60  // 15 minutes

export function usePomodoro() {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work') // 'work', 'shortBreak', 'longBreak'
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const intervalRef = useRef(null)

  const getDuration = useCallback((modeType) => {
    switch (modeType) {
      case 'shortBreak': return SHORT_BREAK
      case 'longBreak': return LONG_BREAK
      default: return WORK_DURATION
    }
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Timer completed
      if (mode === 'work') {
        setSessionsCompleted((prev) => prev + 1)
        // After 4 work sessions, take a long break
        const newSessions = sessionsCompleted + 1
        if (newSessions % 4 === 0) {
          setMode('longBreak')
          setTimeLeft(LONG_BREAK)
        } else {
          setMode('shortBreak')
          setTimeLeft(SHORT_BREAK)
        }
      } else {
        setMode('work')
        setTimeLeft(WORK_DURATION)
      }
      setIsRunning(false)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft, mode, sessionsCompleted])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(getDuration(mode))
  }, [mode, getDuration])

  const switchMode = useCallback((newMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(getDuration(newMode))
  }, [getDuration])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    mode,
    sessionsCompleted,
    progress,
    start,
    pause,
    reset,
    switchMode,
  }
}
