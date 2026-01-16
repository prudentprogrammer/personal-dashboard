import { useState, useMemo, useCallback, useEffect } from 'react'
import { initialTodos } from '../data/mockData'

const STORAGE_KEY = 'dashboard-todos'

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : initialTodos
  } catch {
    return initialTodos
  }
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const addTodo = useCallback((text) => {
    if (!text.trim()) return

    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        priority: 'medium',
      },
    ])
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const pendingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  )

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  )

  return {
    todos,
    pendingCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
  }
}
