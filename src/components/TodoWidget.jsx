import { useState } from 'react'
import Widget from './Widget'
import { useTodos } from '../hooks/useTodos'
import './TodoWidget.css'

function TodoWidget({ className = '' }) {
  const { todos, pendingCount, completedCount, addTodo, toggleTodo, deleteTodo } = useTodos()
  const [newTodo, setNewTodo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    addTodo(newTodo)
    setNewTodo('')
  }

  return (
    <Widget title="Todo" size="large" className={className}>
      <div className="todo">
        <form className="todo__form" onSubmit={handleSubmit}>
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
