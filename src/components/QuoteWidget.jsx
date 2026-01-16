import Widget from './Widget'
import { useQuote } from '../hooks/useQuote'
import './QuoteWidget.css'

function QuoteWidget({ className = '' }) {
  const { quote, loading, refresh } = useQuote()

  return (
    <Widget title="Quote" size="small" className={className}>
      <div className="quote">
        <blockquote className="quote__text">
          "{quote.text}"
        </blockquote>
        <cite className="quote__author">— {quote.author}</cite>
        <button
          className="quote__refresh"
          onClick={refresh}
          disabled={loading}
          aria-label="Get new quote"
        >
          {loading ? '...' : '↻'}
        </button>
      </div>
    </Widget>
  )
}

export default QuoteWidget
