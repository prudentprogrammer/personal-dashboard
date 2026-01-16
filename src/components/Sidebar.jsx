import { MODES, modeConfig } from '../hooks/useDashboardMode'
import './Sidebar.css'

function Sidebar({ currentMode, onModeChange, userName }) {
  const navItems = [
    { mode: MODES.HOME, ...modeConfig[MODES.HOME] },
    { mode: MODES.WORK, ...modeConfig[MODES.WORK] },
    { mode: MODES.PERSONAL, ...modeConfig[MODES.PERSONAL] },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <h1 className="sidebar__logo">Dashboard</h1>
          <p className="sidebar__tagline">Personal Command Center</p>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.mode}
              className={`sidebar__nav-item ${currentMode === item.mode ? 'sidebar__nav-item--active' : ''}`}
              onClick={() => onModeChange(item.mode)}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="sidebar__nav-text">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar__bottom">
        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {userName ? userName.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{userName || 'Guest'}</span>
            <span className="sidebar__user-plan">Free Plan</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
