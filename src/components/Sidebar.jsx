import { MODES, modeConfig } from '../hooks/useDashboardMode'
import './Sidebar.css'

function Sidebar({ currentMode, onModeChange, isCollapsed, onToggleCollapse }) {
  const navItems = [
    { mode: MODES.HOME, ...modeConfig[MODES.HOME] },
    { mode: MODES.WORK, ...modeConfig[MODES.WORK] },
    { mode: MODES.PERSONAL, ...modeConfig[MODES.PERSONAL] },
  ]

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          {!isCollapsed && (
            <>
              <h1 className="sidebar__logo">Dashboard</h1>
              <p className="sidebar__tagline">Command Center</p>
            </>
          )}
          {isCollapsed && <span className="sidebar__logo-icon">📊</span>}
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.mode}
              className={`sidebar__nav-item ${currentMode === item.mode ? 'sidebar__nav-item--active' : ''}`}
              onClick={() => onModeChange(item.mode)}
              title={isCollapsed ? item.name : undefined}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="sidebar__nav-text">{item.name}</span>}
            </button>
          ))}
        </nav>
      </div>

      <button
        className="sidebar__toggle"
        onClick={onToggleCollapse}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '→' : '←'}
      </button>
    </aside>
  )
}

export default Sidebar
