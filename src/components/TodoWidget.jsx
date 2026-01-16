import { useState } from 'react'
import Widget from './Widget'
import './TodoWidget.css'

const initialTodos = [
  { id: 1, text: 'Review pull requests', completed: false, priority: 'high' },
  { id: 2, text: 'Update documentation', completed: false, priority: 'medium' },
  { id: 3, text: 'Fix login bug', completed: true, priority: 'high' },
  { id: 4, text: 'Write unit tests', completed: false, priority: 'low' },
  { id: 5, text: 'Plan sprint goals', completed: false, priority: 'medium' },
]

function TodoWidget({ className = '' }) {
  const [todos, setTodos] = useState(initialTodos)
  const [newTodo, setNewTodo] = useState('')

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: 'medium',
      },
    ])
    setNewTodo('')
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const pendingCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length

  return (
    <Widget title="Todo" size="large" className={className}>
      <div className="todo">
        <form className="todo__form" onSubmit={addTodo}>
          <input
            type="text"
            className="todo__input"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="todo__add-btn">
            +
          </button>
        </form>

        <div className="todo__stats">
          <span className="todo__stat">
            <span className="todo__stat-count">{pendingCount}</span> pending
          </span>
          <span className="todo__stat">
            <span className="todo__stat-count">{completedCount}</span> completed
          </span>
        </div>

        <div className="todo__list">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo__item ${todo.completed ? 'todo__item--completed' : ''}`}
            >
              <button
                className={`todo__checkbox ${todo.completed ? 'todo__checkbox--checked' : ''}`}
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {todo.completed && '✓'}
              </button>
              <span className="todo__text">{todo.text}</span>
              <span className={`todo__priority todo__priority--${todo.priority}`}>
                {todo.priority}
              </span>
              <button
                className="todo__delete"
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

export default TodoWidget
