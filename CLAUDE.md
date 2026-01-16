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

### Widget System

Each widget is a self-contained component in `src/components/`:
- Uses the base `Widget` component wrapper for consistent styling
- Accepts `className` prop for grid positioning (e.g., `grid-span-2`, `grid-row-span-2`)
- Contains its own CSS file with BEM naming convention

### Layout

- 4-column CSS Grid layout defined in `App.css`
- Responsive breakpoints: 1200px (2 columns), 768px (1 column)
- Grid span classes: `grid-span-1` through `grid-span-4`, `grid-row-span-2`

### Styling

- CSS variables for theming defined in `src/index.css` (dark theme by default)
- Key variables: `--bg-primary`, `--bg-widget`, `--text-primary`, `--text-secondary`, `--accent`, `--border`
- BEM naming convention for CSS classes

### Data

All widgets currently use mock data. Each widget has commented TODO sections for API integration:
- Weather: Ready for weather API (OpenWeatherMap, etc.)
- Calendar: Ready for calendar API (Google Calendar, etc.)
- Health: Ready for fitness API (Apple Health, Fitbit, etc.)
- Books: Ready for reading API (Goodreads, etc.)

## Adding New Widgets

1. Create `src/components/YourWidget.jsx` and `YourWidget.css`
2. Import and use the `Widget` wrapper component
3. Add to `App.jsx` with appropriate grid class
4. Follow existing patterns for mock data structure
