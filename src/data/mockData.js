// Mock data for all widgets
// Replace these with API calls when ready

export const weatherData = {
  location: 'San Francisco',
  current: {
    temp: 68,
    condition: 'partlyCloudy',
    humidity: 65,
    wind: 12,
    feelsLike: 66,
  },
  forecast: [
    { day: 'Mon', high: 70, low: 58, condition: 'sunny' },
    { day: 'Tue', high: 68, low: 56, condition: 'partlyCloudy' },
    { day: 'Wed', high: 65, low: 54, condition: 'cloudy' },
    { day: 'Thu', high: 62, low: 52, condition: 'rainy' },
    { day: 'Fri', high: 66, low: 55, condition: 'partlyCloudy' },
  ],
}

export const calendarEvents = [
  {
    id: 1,
    title: 'Team standup',
    time: '09:00 AM',
    duration: '30m',
    color: '#646cff',
    isToday: true,
  },
  {
    id: 2,
    title: 'Project review',
    time: '11:00 AM',
    duration: '1h',
    color: '#4ade80',
    isToday: true,
  },
  {
    id: 3,
    title: 'Lunch with Alex',
    time: '12:30 PM',
    duration: '1h',
    color: '#fbbf24',
    isToday: true,
  },
  {
    id: 4,
    title: 'Design workshop',
    time: '02:00 PM',
    duration: '2h',
    color: '#f87171',
    isToday: false,
    date: 'Tomorrow',
  },
  {
    id: 5,
    title: 'Weekly planning',
    time: '10:00 AM',
    duration: '1h',
    color: '#a78bfa',
    isToday: false,
    date: 'Wed, Jan 15',
  },
]

export const initialTodos = [
  { id: 1, text: 'Review pull requests', completed: false, priority: 'high' },
  { id: 2, text: 'Update documentation', completed: false, priority: 'medium' },
  { id: 3, text: 'Fix login bug', completed: true, priority: 'high' },
  { id: 4, text: 'Write unit tests', completed: false, priority: 'low' },
  { id: 5, text: 'Plan sprint goals', completed: false, priority: 'medium' },
]

export const healthData = {
  steps: { current: 7842, goal: 10000 },
  water: { current: 6, goal: 8 },
  sleep: { hours: 7.5, quality: 'good' },
  calories: { consumed: 1650, goal: 2000 },
}

export const booksData = {
  currentlyReading: [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      currentPage: 156,
      totalPages: 320,
      coverColor: '#f59e0b',
    },
    {
      id: 2,
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      currentPage: 89,
      totalPages: 352,
      coverColor: '#8b5cf6',
    },
  ],
  recentlyFinished: [
    {
      id: 3,
      title: 'Deep Work',
      author: 'Cal Newport',
      finishedDate: '2 weeks ago',
      coverColor: '#3b82f6',
    },
  ],
  yearlyGoal: { read: 12, goal: 24 },
}
