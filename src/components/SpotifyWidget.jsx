import Widget from './Widget'
import { useSpotify } from '../hooks/useSpotify'
import './SpotifyWidget.css'

function SpotifyWidget({ className = '' }) {
  const { data, isPlaying, togglePlay } = useSpotify()
  const { currentTrack, recentTracks } = data

  return (
    <Widget title="Spotify" size="medium" className={className}>
      <div className="spotify">
        <div className="spotify__now-playing">
          <div className="spotify__album-art">
            🎵
          </div>
          <div className="spotify__track-info">
            <div className="spotify__track-name">{currentTrack.name}</div>
            <div className="spotify__track-artist">{currentTrack.artist}</div>
            <div className="spotify__progress">
              <div className="spotify__progress-bar">
                <div
                  className="spotify__progress-fill"
                  style={{ width: `${currentTrack.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="spotify__controls">
          <button className="spotify__btn">⏮</button>
          <button className="spotify__btn spotify__btn--play" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="spotify__btn">⏭</button>
        </div>

        <div className="spotify__recent">
          <div className="spotify__recent-title">Recently Played</div>
          {recentTracks.map((track) => (
            <div key={track.id} className="spotify__recent-track">
              <span className="spotify__recent-name">{track.name}</span>
              <span className="spotify__recent-artist">{track.artist}</span>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

export default SpotifyWidget
