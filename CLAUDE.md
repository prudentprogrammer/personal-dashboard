# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal dashboard web app built with React + Vite for displaying on a portable monitor. Features multiple widgets: Clock, Weather, Calendar, Todo, Health tracking, and Books.

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

**Mock Data** (`src/data/mockData.js`): Centralized mock data for all widgets. Replace exports with API calls when ready.

**Custom Hooks** (`src/hooks/`): Each widget has a corresponding hook that handles data fetching, state, and business logic:
- `useClock` - Time formatting, auto-updates every second
- `useWeather` - Weather data with loading/error states
- `useCalendar` - Events filtered by today/upcoming
- `useTodos` - CRUD operations for tasks
- `useHealth` - Metrics with computed progress values
- `useBooks` - Reading progress and yearly goals

### Widget System

Widgets in `src/components/` are pure presentation:
- Use the `Widget` wrapper for consistent styling
- Consume data from hooks
- Accept `className` prop for grid positioning

### Layout

- 4-column CSS Grid in `App.css`
- Responsive: 1200px (2 cols), 768px (1 col)
- Grid classes: `grid-span-1` to `grid-span-4`, `grid-row-span-2`

### Styling

- CSS variables in `src/index.css` (dark theme)
- Variables: `--bg-primary`, `--bg-widget`, `--text-primary`, `--text-secondary`, `--accent`, `--border`
- BEM naming convention

## Adding New Widgets

1. Add mock data to `src/data/mockData.js`
2. Create hook `src/hooks/useYourData.js`
3. Create component `src/components/YourWidget.jsx` and `.css`
4. Import hook in widget, keep component purely presentational
5. Add to `App.jsx` with grid class
