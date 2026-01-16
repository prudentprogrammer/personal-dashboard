import { useState } from 'react'

// Mock Spotify data - replace with Spotify Web API
const mockSpotifyData = {
  isPlaying: true,
  currentTrack: {
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    albumArt: null, // Would be album art URL
    progress: 65, // percentage
    duration: '3:20',
  },
  recentTracks: [
    { id: 1, name: 'Starboy', artist: 'The Weeknd' },
    { id: 2, name: 'Shape of You', artist: 'Ed Sheeran' },
    { id: 3, name: 'Levitating', artist: 'Dua Lipa' },
  ],
}

export function useSpotify() {
  const [data] = useState(mockSpotifyData)
  const [isPlaying, setIsPlaying] = useState(mockSpotifyData.isPlaying)

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
    // TODO: Integrate with Spotify API
  }

  return {
    data,
    isPlaying,
    togglePlay,
  }
}
