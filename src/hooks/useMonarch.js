import { useState, useEffect } from 'react'

// Mock data for when monarch-data.json doesn't exist
const mockMonarchData = {
  lastUpdated: new Date().toISOString(),
  netWorth: 125750.42,
  totalAssets: 156200.00,
  totalLiabilities: 30449.58,
  accounts: [
    { id: '1', name: 'Checking', type: 'Depository', balance: 5420.50, institution: 'Chase' },
    { id: '2', name: '401(k)', type: 'Investment', balance: 85000.00, institution: 'Fidelity' },
    { id: '3', name: 'Savings', type: 'Depository', balance: 12500.00, institution: 'Marcus' },
    { id: '4', name: 'Brokerage', type: 'Investment', balance: 45000.00, institution: 'Vanguard' },
    { id: '5', name: 'Credit Card', type: 'Credit Card', balance: -2450.00, institution: 'Amex' },
    { id: '6', name: 'Car Loan', type: 'Loan', balance: -15000.00, institution: 'Capital One' },
  ],
  accountsByType: {
    'Depository': [
      { id: '1', name: 'Checking', balance: 5420.50, institution: 'Chase' },
      { id: '3', name: 'Savings', balance: 12500.00, institution: 'Marcus' },
    ],
    'Investment': [
      { id: '2', name: '401(k)', balance: 85000.00, institution: 'Fidelity' },
      { id: '4', name: 'Brokerage', balance: 45000.00, institution: 'Vanguard' },
    ],
    'Credit Card': [
      { id: '5', name: 'Credit Card', balance: -2450.00, institution: 'Amex' },
    ],
    'Loan': [
      { id: '6', name: 'Car Loan', balance: -15000.00, institution: 'Capital One' },
    ],
  },
  cashflow: {
    income: 8500,
    expenses: 5200,
    savings: 3300,
    savingsRate: 38.8,
  },
}

export function useMonarch() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/monarch-data.json')
        if (response.ok) {
          const json = await response.json()
          setData(json)
        } else {
          // Use mock data if file doesn't exist
          console.log('Using mock Monarch data (run scripts/fetch_monarch.py to get real data)')
          setData(mockMonarchData)
        }
      } catch (err) {
        console.log('Using mock Monarch data:', err.message)
        setData(mockMonarchData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount)
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(absAmount)
    return amount < 0 ? `-${formatted}` : formatted
  }

  const formatLastUpdated = (isoString) => {
    if (!isoString) return 'Never'
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  return {
    data,
    loading,
    error,
    formatCurrency,
    formatLastUpdated,
  }
}
