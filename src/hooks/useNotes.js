import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'dashboard-notes'

export function useNotes() {
  const [content, setContent] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content)
  }, [content])

  const updateContent = useCallback((newContent) => {
    setContent(newContent)
  }, [])

  const clear = useCallback(() => {
    setContent('')
  }, [])

  return {
    content,
    updateContent,
    clear,
  }
}
