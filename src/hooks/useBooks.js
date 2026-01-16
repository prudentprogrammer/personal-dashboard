import { useMemo } from 'react'
import { booksData } from '../data/mockData'

export function useBooks() {
  const currentlyReading = useMemo(
    () =>
      booksData.currentlyReading.map((book) => ({
        ...book,
        progress: Math.round((book.currentPage / book.totalPages) * 100),
      })),
    []
  )

  const recentlyFinished = booksData.recentlyFinished

  const yearlyGoal = booksData.yearlyGoal

  const goalProgress = useMemo(
    () => (yearlyGoal.read / yearlyGoal.goal) * 100,
    [yearlyGoal]
  )

  return {
    currentlyReading,
    recentlyFinished,
    yearlyGoal,
    goalProgress,
  }
}
