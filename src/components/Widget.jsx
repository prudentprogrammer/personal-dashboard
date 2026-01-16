import './Widget.css'

function Widget({ title, children, className = '', size = 'medium' }) {
  return (
    <div className={`widget widget--${size} ${className}`}>
      {title && <h2 className="widget__title">{title}</h2>}
      <div className="widget__content">
        {children}
      </div>
    </div>
  )
}

export default Widget
