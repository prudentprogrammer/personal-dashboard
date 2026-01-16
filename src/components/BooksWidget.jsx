import Widget from './Widget'
import './BooksWidget.css'

// Mock books data - can be replaced with Goodreads API or similar
const booksData = {
  currentlyReading: [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      currentPage: 156,
      totalPages: 320,
      coverColor: '#f59e0b',
    },
    {
      id: 2,
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      currentPage: 89,
      totalPages: 352,
      coverColor: '#8b5cf6',
    },
  ],
  recentlyFinished: [
    {
      id: 3,
      title: 'Deep Work',
      author: 'Cal Newport',
      finishedDate: '2 weeks ago',
      coverColor: '#3b82f6',
    },
  ],
  yearlyGoal: { read: 12, goal: 24 },
}

function BookCard({ book, showProgress = true }) {
  const progress = showProgress
    ? Math.round((book.currentPage / book.totalPages) * 100)
    : 100

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
                  width: `${progress}%`,
                  backgroundColor: book.coverColor,
                }}
              />
            </div>
            <span className="book-card__progress-text">
              {book.currentPage} / {book.totalPages} pages ({progress}%)
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
  const goalProgress = (booksData.yearlyGoal.read / booksData.yearlyGoal.goal) * 100

  return (
    <Widget title="Books" size="medium" className={className}>
      <div className="books">
        <div className="books__section">
          <h3 className="books__section-title">Currently Reading</h3>
          <div className="books__list">
            {booksData.currentlyReading.map((book) => (
              <BookCard key={book.id} book={book} showProgress={true} />
            ))}
          </div>
        </div>

        <div className="books__goal">
          <div className="books__goal-header">
            <span className="books__goal-label">2024 Goal</span>
            <span className="books__goal-count">
              {booksData.yearlyGoal.read} / {booksData.yearlyGoal.goal} books
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
