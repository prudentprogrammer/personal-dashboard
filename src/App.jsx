import './App.css'
import Widget from './components/Widget'
import ClockWidget from './components/ClockWidget'

function App() {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Personal Dashboard</h1>
      </header>

      <main className="dashboard__grid">
        <ClockWidget />

        <Widget title="Weather" size="medium">
          <p>Weather widget coming soon</p>
        </Widget>

        <Widget title="Calendar" size="medium" className="grid-span-2">
          <p>Calendar widget coming soon</p>
        </Widget>

        <Widget title="Todo" size="large" className="grid-row-span-2">
          <p>Todo widget coming soon</p>
        </Widget>

        <Widget title="Health" size="medium">
          <p>Health widget coming soon</p>
        </Widget>

        <Widget title="Books" size="medium" className="grid-span-2">
          <p>Books widget coming soon</p>
        </Widget>
      </main>
    </div>
  )
}

export default App
