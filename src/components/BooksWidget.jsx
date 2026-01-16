import Widget from './Widget'
import { useBooks } from '../hooks/useBooks'
import './BooksWidget.css'

function BookCard({ book, showProgress = true }) {
  return (
    <div className="book-card">
      <div
        className="book-card__cover"
        style={{ backgroundColor: book.coverColor }}
      >
        <span className="book-card__cover-icon">📚</span>
      </div>
      <div className="book-card__info">
        <div className="book-card__title">{book.title}</div>
        <div className="book-card__author">{book.author}</div>
        {showProgress ? (
          <div className="book-card__progress">
            <div className="book-card__progress-bar">
              <div
                className="book-card__progress-fill"
                style={{
                  width: `${book.progress}%`,
                  backgroundColor: book.coverColor,
                }}
              />
            </div>
            <span className="book-card__progress-text">
              {book.currentPage} / {book.totalPages} pages ({book.progress}%)
            </span>
          </div>
        ) : (
          <div className="book-card__finished">{book.finishedDate}</div>
        )}
      </div>
    </div>
  )
}

function BooksWidget({ className = '' }) {
  const { currentlyReading, yearlyGoal, goalProgress } = useBooks()

  return (
    <Widget title="Books" size="medium" className={className}>
      <div className="books">
        <div className="books__section">
          <h3 className="books__section-title">Currently Reading</h3>
          <div className="books__list">
            {currentlyReading.map((book) => (
              <BookCard key={book.id} book={book} showProgress={true} />
            ))}
          </div>
        </div>

        <div className="books__goal">
          <div className="books__goal-header">
            <span className="books__goal-label">2024 Goal</span>
            <span className="books__goal-count">
              {yearlyGoal.read} / {yearlyGoal.goal} books
            </span>
          </div>
          <div className="books__goal-bar">
            <div
              className="books__goal-fill"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default BooksWidget
