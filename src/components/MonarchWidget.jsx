import Widget from './Widget'
import { useMonarch } from '../hooks/useMonarch'
import './MonarchWidget.css'

const typeIcons = {
  'Depository': '🏦',
  'Investment': '📈',
  'Credit Card': '💳',
  'Loan': '📋',
  'Other': '💰',
}

function MonarchWidget({ className = '' }) {
  const { data, loading, formatCurrency, formatLastUpdated } = useMonarch()

  if (loading) {
    return (
      <Widget title="Finances" size="large" className={className}>
        <div className="monarch monarch--loading">Loading...</div>
      </Widget>
    )
  }

  if (!data) {
    return (
      <Widget title="Finances" size="large" className={className}>
        <div className="monarch monarch--error">Unable to load data</div>
      </Widget>
    )
  }

  // Get top accounts (limit to 5)
  const topAccounts = data.accounts?.slice(0, 5) || []

  return (
    <Widget title="Finances" size="large" className={className}>
      <div className="monarch">
        <div className="monarch__net-worth">
          <div className="monarch__net-worth-label">Net Worth</div>
          <div className="monarch__net-worth-value">
            {formatCurrency(data.netWorth)}
          </div>
          <div className="monarch__net-worth-breakdown">
            <span className="monarch__assets">
              {formatCurrency(data.totalAssets)} assets
            </span>
            <span className="monarch__liabilities">
              {formatCurrency(data.totalLiabilities)} liabilities
            </span>
          </div>
        </div>

        {data.cashflow && (
          <div className="monarch__cashflow">
            <div className="monarch__cashflow-item">
              <span className="monarch__cashflow-label">Income</span>
              <span className="monarch__cashflow-value monarch__cashflow-value--income">
                +{formatCurrency(data.cashflow.income)}
              </span>
            </div>
            <div className="monarch__cashflow-item">
              <span className="monarch__cashflow-label">Expenses</span>
              <span className="monarch__cashflow-value monarch__cashflow-value--expense">
                -{formatCurrency(Math.abs(data.cashflow.expenses))}
              </span>
            </div>
            <div className="monarch__cashflow-item">
              <span className="monarch__cashflow-label">Savings</span>
              <span className="monarch__cashflow-value monarch__cashflow-value--savings">
                {data.cashflow.savingsRate?.toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        <div className="monarch__accounts">
          <div className="monarch__accounts-header">Accounts</div>
          {topAccounts.map((account) => (
            <div key={account.id} className="monarch__account">
              <span className="monarch__account-icon">
                {typeIcons[account.type] || typeIcons['Other']}
              </span>
              <div className="monarch__account-info">
                <span className="monarch__account-name">{account.name}</span>
                <span className="monarch__account-institution">{account.institution}</span>
              </div>
              <span className={`monarch__account-balance ${account.balance < 0 ? 'monarch__account-balance--negative' : ''}`}>
                {formatCurrency(account.balance)}
              </span>
            </div>
          ))}
        </div>

        <div className="monarch__updated">
          Updated {formatLastUpdated(data.lastUpdated)}
        </div>
      </div>
    </Widget>
  )
}

export default MonarchWidget
