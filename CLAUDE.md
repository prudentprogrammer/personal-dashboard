# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal dashboard web app built with React + Vite for displaying on a portable monitor. Features 12 widgets with dark/light theme support.

## Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Architecture

```
src/
├── components/     # Presentation components (widgets)
├── hooks/          # Data logic and state management
└── data/           # Mock data (swap for API calls)
```

### Data Layer

**Mock Data** (`src/data/mockData.js`): Centralized mock data for widgets that need it.

**Custom Hooks** (`src/hooks/`): Each widget has a corresponding hook:
- `useClock` - Live time with formatting
- `useWeather` - Weather data (mock, ready for OpenWeatherMap)
- `useCalendar` - Events filtered by today/upcoming
- `useTodos` - CRUD with localStorage persistence
- `useHealth` - Health metrics with progress
- `useBooks` - Reading progress and goals
- `usePomodoro` - Timer with work/break modes
- `useQuote` - Quotes with localStorage cache
- `useHabits` - Habit tracking with streaks, localStorage
- `useNotes` - Scratchpad with localStorage
- `useGitHub` - Activity data (mock, ready for GitHub API)
- `useSpotify` - Now playing (mock, ready for Spotify API)
- `useTheme` - Dark/light theme toggle, localStorage

### Widgets

| Widget | Features |
|--------|----------|
| Clock | Live time, date |
| Weather | Current + 5-day forecast |
| Calendar | Today's + upcoming events |
| Todo | Add/complete/delete, priorities |
| Health | Steps, water, sleep, calories |
| Books | Currently reading, yearly goal |
| Pomodoro | 25/5/15 timer, session counter |
| Quote | Daily quote, refresh button |
| Habits | Daily habits with streaks |
| Notes | Quick scratchpad |
| GitHub | Contributions, recent activity |
| Spotify | Now playing, controls |

### Layout

- 4-column CSS Grid in `App.css`
- Responsive: 1200px (2 cols), 768px (1 col)
- Grid classes: `grid-span-1` to `grid-span-4`, `grid-row-span-2`

### Styling

- Theme toggle: `useTheme` hook, `data-theme` attribute on `<html>`
- CSS variables in `src/index.css` for both dark and light themes
- Key variables: `--bg-primary`, `--bg-widget`, `--text-primary`, `--text-secondary`, `--accent`, `--border`
- BEM naming convention

### Persistence

Several hooks use localStorage:
- `dashboard-todos` - Todo items
- `dashboard-theme` - Theme preference
- `dashboard-habits` - Habits and streaks
- `dashboard-notes` - Notes content
- `dashboard-quote` - Cached quote (24h)

## Adding New Widgets

1. Create hook `src/hooks/useYourData.js` (add localStorage if needed)
2. Create `src/components/YourWidget.jsx` and `.css`
3. Import hook in widget, keep component purely presentational
4. Add to `App.jsx` with optional grid class
