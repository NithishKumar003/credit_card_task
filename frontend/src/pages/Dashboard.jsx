import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'

function Dashboard() {

    const navigate = useNavigate()

    const [isAdmin, setIsAdmin] = useState(false)
    const [cards, setCards] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        navigate('/login')
    }

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true)
            setError('')

            try {
                const cardsResponse = await api.get('/api/cards/')
                const transactionsResponse = await api.get(
                    '/api/payments/history/'
                )

                setCards(cardsResponse.data)
                setTransactions(transactionsResponse.data)

            } catch (error) {
                console.log('Dashboard data error:', error)
                console.log('Django response:', error.response?.data)

                setError(
                    error.response?.data?.detail ||
                    'Unable to load dashboard data.'
                )
            } finally {
                setLoading(false)
            }
        }

        const checkAdmin = async () => {
            try {
                const response = await api.get('/api/auth/admin-check/')
                setIsAdmin(response.data.is_admin)
            } catch (error) {
                console.log('Admin check error:', error)
                setIsAdmin(false)
            }
        }

        loadDashboardData()
        checkAdmin()
    }, [])

    const totalAmount = transactions.reduce(
        (total, transaction) => {
            return total + Number(transaction.amount)
        },
        0
    )

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-blue-600">
        Credit Card Payment
        </h1>

        <nav className="flex items-center gap-6">

        <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 font-medium"
        >
            Dashboard
        </Link>

        <Link
            to="/cards"
            className="text-gray-700 hover:text-blue-600 font-medium"
        >
            Cards
        </Link>

        <Link
            to="/payment"
            className="text-gray-700 hover:text-blue-600 font-medium"
        >
            Payment
        </Link>

        <Link
            to="/transactions"
            className="text-gray-700 hover:text-blue-600 font-medium"
        >
            Transactions
        </Link>

        {isAdmin && (
            <Link
                to="/admin"
                className="text-purple-600 hover:text-purple-800 font-medium"
            >
                Admin Panel
            </Link>
        )}

        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
            Logout
        </button>

        </nav>

    </div>
    </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back!
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your cards and payments from one place.
          </p>
        </div>

        {loading && (
            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <p className="text-gray-500">
                    Loading dashboard data...
                </p>
            </div>
        )}

        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                {error}
            </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Total Cards
            </p>

            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {cards.length}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Total Transactions
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {transactions.length}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Total Amount Spent
            </p>

            <h3 className="text-3xl font-bold text-purple-600 mt-2">
                ₹{totalAmount.toFixed(2)}
            </h3>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8">

          <h2 className="text-xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">

            <Link
              to="/cards"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                Manage Cards
              </h3>

              <p className="text-gray-500 mt-2">
                Add or remove your saved cards.
              </p>
            </Link>

            <Link
              to="/payment"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-green-600">
                Make Payment
              </h3>

              <p className="text-gray-500 mt-2">
                Make a secure card payment.
              </p>
            </Link>

            <Link
              to="/transactions"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-purple-600">
                Transactions
              </h3>

              <p className="text-gray-500 mt-2">
                View your payment history.
              </p>
            </Link>

          </div>

        </div>

        {/* Recent Transactions */}
        <div className="mt-8">

          <h2 className="text-xl font-bold text-gray-800">
            Recent Transactions
          </h2>

          <div className="bg-white rounded-xl shadow mt-4 p-6">

            {transactions.length === 0 ? (
                <p className="text-gray-500 text-center">
                    No transactions yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between border-b pb-4 last:border-b-0"
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    {transaction.masked_card}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {transaction.transaction_id}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-gray-800">
                                    {transaction.currency} {transaction.amount}
                                </p>

                                <span
                                    className={
                                        transaction.status === 'SUCCESS'
                                            ? 'text-sm text-green-600'
                                            : 'text-sm text-red-600'
                                    }
                                >
                                    {transaction.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

          </div>
          <div className="mt-6 text-center">
                <Link
                    to="/transactions"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    View All Transactions →
                </Link>
           </div>

        </div>

      </main>

    </div>
  )
}

export default Dashboard