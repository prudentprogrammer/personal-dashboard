import { useState } from 'react'
import Widget from './Widget'
import { useCountdown } from '../hooks/useCountdown'
import './CountdownWidget.css'

const ICONS = ['📅', '🎂', '✈️', '🎉', '💼', '🎓', '💍', '🏠', '🎄', '⚡']

function AddCountdownForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [icon, setIcon] = useState('📅')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && date) {
      onAdd(name.trim(), date, icon)
      setName('')
      setDate('')
      setIcon('📅')
    }
  }

  return (
    <form className="countdown-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="countdown-form__input"
        autoFocus
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="countdown-form__input"
      />
      <div className="countdown-form__icons">
        {ICONS.map((i) => (
          <button
            key={i}
            type="button"
            className={`countdown-form__icon ${icon === i ? 'countdown-form__icon--selected' : ''}`}
            onClick={() => setIcon(i)}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="countdown-form__actions">
        <button type="button" onClick={onCancel} className="countdown-form__btn countdown-form__btn--cancel">
          Cancel
        </button>
        <button type="submit" className="countdown-form__btn countdown-form__btn--submit">
          Add
        </button>
      </div>
    </form>
  )
}

function CountdownWidget({ className = '' }) {
  const { countdowns, addCountdown, removeCountdown } = useCountdown()
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (name, date, icon) => {
    addCountdown(name, date, icon)
    setShowForm(false)
  }

  const formatTimeLeft = (timeLeft) => {
    if (timeLeft.isPast) return 'Past'
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`
    }
    return `${timeLeft.hours}h ${timeLeft.minutes}m`
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Widget
      title="Countdowns"
      size="medium"
      className={className}
      headerAction={
        !showForm && (
          <button
            className="widget__header-btn"
            onClick={() => setShowForm(true)}
            title="Add countdown"
          >
            +
          </button>
        )
      }
    >
      <div className="countdown">
        {showForm ? (
          <AddCountdownForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        ) : countdowns.length === 0 ? (
          <div className="countdown__empty">
            <span>No countdowns yet</span>
            <button onClick={() => setShowForm(true)} className="countdown__add-btn">
              Add your first countdown
            </button>
          </div>
        ) : (
          <div className="countdown__list">
            {countdowns.map((countdown) => (
              <div
                key={countdown.id}
                className={`countdown__item ${countdown.timeLeft.isPast ? 'countdown__item--past' : ''}`}
              >
                <span className="countdown__icon">{countdown.icon}</span>
                <div className="countdown__info">
                  <span className="countdown__name">{countdown.name}</span>
                  <span className="countdown__date">{formatDate(countdown.date)}</span>
                </div>
                <div className="countdown__time">
                  {countdown.timeLeft.isPast ? (
                    <span className="countdown__past">Passed</span>
                  ) : (
                    <>
                      <span className="countdown__days">{countdown.timeLeft.days}</span>
                      <span className="countdown__label">days</span>
                    </>
                  )}
                </div>
                <button
                  className="countdown__remove"
                  onClick={() => removeCountdown(countdown.id)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Widget>
  )
}

export default CountdownWidget
