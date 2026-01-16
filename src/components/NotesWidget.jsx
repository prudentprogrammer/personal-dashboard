import Widget from './Widget'
import { useNotes } from '../hooks/useNotes'
import './NotesWidget.css'

function NotesWidget({ className = '' }) {
  const { content, updateContent, clear } = useNotes()

  return (
    <Widget title="Notes" size="medium" className={className}>
      <div className="notes">
        <textarea
          className="notes__textarea"
          placeholder="Quick notes..."
          value={content}
          onChange={(e) => updateContent(e.target.value)}
        />
        <div className="notes__footer">
          <span className="notes__count">{content.length} chars</span>
          {content && (
            <button className="notes__clear" onClick={clear}>
              Clear
            </button>
          )}
        </div>
      </div>
    </Widget>
  )
}

export default NotesWidget
