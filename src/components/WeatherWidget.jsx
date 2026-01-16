import Widget from './Widget'
import { useWeather } from '../hooks/useWeather'
import './WeatherWidget.css'

function WeatherWidget() {
  const { weather, loading, weatherIcons } = useWeather()

  if (loading) {
    return (
      <Widget title="Weather" size="medium">
        <div className="weather weather--loading">Loading...</div>
      </Widget>
    )
  }

  return (
    <Widget title="Weather" size="medium">
      <div className="weather">
        <div className="weather__current">
          <div className="weather__icon">
            {weatherIcons[weather.current.condition]}
          </div>
          <div className="weather__temp">{weather.current.temp}°</div>
          <div className="weather__details">
            <div className="weather__location">{weather.location}</div>
            <div className="weather__meta">
              Feels like {weather.current.feelsLike}° • {weather.current.humidity}% humidity
            </div>
          </div>
        </div>

        <div className="weather__forecast">
          {weather.forecast.map((day) => (
            <div key={day.day} className="weather__forecast-day">
              <span className="weather__forecast-label">{day.day}</span>
              <span className="weather__forecast-icon">
                {weatherIcons[day.condition]}
              </span>
              <span className="weather__forecast-temps">
                <span className="weather__forecast-high">{day.high}°</span>
                <span className="weather__forecast-low">{day.low}°</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

export default WeatherWidget
