import './Widget.css'

function Widget({ title, children, className = '', size = 'medium', headerAction }) {
  return (
    <div className={`widget widget--${size} ${className}`}>
      {title && (
        <div className="widget__header">
          <h2 className="widget__title">{title}</h2>
          {headerAction && <div className="widget__header-action">{headerAction}</div>}
        </div>
      )}
      <div className="widget__content">
        {children}
      </div>
    </div>
  )
}

export default Widget
