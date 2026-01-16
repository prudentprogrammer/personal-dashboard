import { useState, useMemo, useCallback } from 'react'
import { initialTodos } from '../data/mockData'

export function useTodos() {
  const [todos, setTodos] = useState(initialTodos)

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
