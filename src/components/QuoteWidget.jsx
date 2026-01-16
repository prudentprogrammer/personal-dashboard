import { useQuote } from '../hooks/useQuote'
import './QuoteWidget.css'

function QuoteWidget({ className = '' }) {
  const { quote, loading, refresh } = useQuote()

  return (
    <div className={`quote-widget ${className}`}>
      <span className="quote-widget__icon">"</span>
      <div className="quote-widget__content">
        <blockquote className="quote-widget__text">
          {quote.text}
        </blockquote>
        <cite className="quote-widget__author">— {quote.author}</cite>
      </div>
      <button
        className="quote-widget__refresh"
        onClick={refresh}
        disabled={loading}
        aria-label="Get new quote"
      >
        {loading ? '...' : '↻'}
      </button>
    </div>
  )
}

export default QuoteWidget
