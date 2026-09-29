import { useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import api from '../services/api'

function Transactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [statusFilter, setStatusFilter] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionAmount = Number(transaction.amount)

    if (
      statusFilter !== '' &&
      transaction.status !== statusFilter
    ) {
      return false
    }

    if (
      minAmount !== '' &&
      transactionAmount < Number(minAmount)
    ) {
      return false
    }

    if (
      maxAmount !== '' &&
      transactionAmount > Number(maxAmount)
    ) {
      return false
    }

    if (fromDate !== '') {
      const transactionDate = new Date(transaction.created_at)
      const selectedFromDate = new Date(`${fromDate}T00:00:00`)

      if (transactionDate < selectedFromDate) {
        return false
      }
    }

    if (toDate !== '') {
      const transactionDate = new Date(transaction.created_at)
      const selectedToDate = new Date(`${toDate}T23:59:59`)

      if (transactionDate > selectedToDate) {
        return false
      }
    }

    return true
  })

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await api.get('/api/payments/history/')
        setTransactions(response.data)
      } catch (error) {
        console.log('Transaction error:', error)
        console.log('Django response:', error.response?.data)

        setError(
          error.response?.data?.detail ||
          'Unable to load transactions.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            Credit Card Payment
          </h1>

          <nav className="flex gap-5 text-sm">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/cards"
              className="text-gray-600 hover:text-blue-600"
            >
              Cards
            </Link>

            <Link
              to="/payment"
              className="text-gray-600 hover:text-blue-600"
            >
              Payment
            </Link>

            <Link
              to="/transactions"
              className="text-blue-600 font-semibold"
            >
              Transactions
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Transaction History
        </h2>

        <p className="mt-2 text-gray-600">
          View your previous payment transactions.
        </p>

        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Filter by Status
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
          >
            <option value="">All Transactions</option>
            <option value="SUCCESS">Success</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Minimum Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={minAmount}
            onChange={(event) => setMinAmount(event.target.value)}
            placeholder="Enter minimum amount"
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Maximum Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={maxAmount}
            onChange={(event) => setMaxAmount(event.target.value)}
            placeholder="Enter maximum amount"
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">
            From Date
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">
            To Date
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
          />
        </div>

        <div className="mt-6">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}
          {loading ? (
              <p className="text-gray-500">
                Loading transactions...
              </p>
            ) : filteredTransactions.length === 0 ? (
            <p className="text-gray-500">
              No transactions match the selected filters.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl shadow p-6"
                >
                  <p>
                    <span className="font-semibold">
                      Transaction ID:
                    </span>{' '}
                    {transaction.transaction_id}
                  </p>

                  <p className="mt-2">
                    <span className="font-semibold">
                      Amount:
                    </span>{' '}
                    {transaction.amount} {transaction.currency}
                  </p>

                  <p className="mt-2">
                    <span className="font-semibold">
                      Status:
                    </span>{' '}
                    {transaction.status}
                  </p>

                  <p className="mt-2">
                    <span className="font-semibold">
                      Card:
                    </span>{' '}
                    {transaction.masked_card}
                  </p>

                  <p className="mt-2">
                    <span className="font-semibold">
                      Message:
                    </span>{' '}
                    {transaction.message}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {transaction.created_at}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Transactions