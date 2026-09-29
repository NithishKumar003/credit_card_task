import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../services/api'


function AdminDashboard() {
  const navigate = useNavigate()

  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [cards, setCards] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


    const loadAdminData = async () => {
    setLoading(true)
    setError('')

    try {
        const response = await api.get(
        '/api/payments/admin/daily-summary/'
        )

        setSummary(response.data)

        const usersResponse = await api.get(
        '/api/auth/admin/users/'
        )

        setUsers(usersResponse.data)

        const cardsResponse = await api.get(
        '/api/cards/admin/cards/'
        )

        setCards(cardsResponse.data)

        const transactionsResponse = await api.get(
        '/api/payments/admin/transactions/'
        )

        setTransactions(transactionsResponse.data)

    } catch (error) {
        console.log('Admin dashboard error:', error)
        console.log('Django response:', error.response?.data)

        setError('Unable to load admin dashboard data.')
    } finally {
        setLoading(false)
    }
    }

    useEffect(() => {
    loadAdminData()
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

          <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                    Admin Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                    Manage users, cards and transactions
                    </p>
                </div>

                <button
                    onClick={loadAdminData}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>

            </div>

          <nav className="flex items-center gap-5 text-sm">
            <Link
                to="/"
                className="text-gray-600 hover:text-blue-600"
            >
                Home
            </Link>
            
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-blue-600"
            >
              User Dashboard
            </Link>

            <Link
                to="/admin"
                className="text-purple-600 font-semibold"
            >
                Admin Panel
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </nav>

        </div>
      </header>


      <main className="max-w-6xl mx-auto px-6 py-8">

        {loading && (
            <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500">
                Loading admin dashboard...
                </p>
            </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800">
          Daily Summary
        </h2>

        <p className="text-gray-500 mt-1">
          Today's payment activity
        </p>


        {loading && (
          <p className="mt-6 text-gray-500">
            Loading summary...
          </p>
        )}


        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        )}


        {summary && !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

            <div className="bg-white rounded-xl shadow p-5">
                <p className="text-gray-500 text-sm">
                    Total Users
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-2">
                    {summary.total_users}
                </p>
                </div>


                <div className="bg-white rounded-xl shadow p-5">
                <p className="text-gray-500 text-sm">
                    Total Cards
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-2">
                    {summary.total_cards}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500 text-sm">
                Total Transactions
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-2">
                {summary.total_transactions}
              </p>
            </div>


            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500 text-sm">
                Successful
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {summary.successful_transactions}
              </p>
            </div>


            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500 text-sm">
                Declined
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {summary.declined_transactions}
              </p>
            </div>


            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500 text-sm">
                Total Amount
              </p>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                {summary.total_amount}
              </p>
            </div>

          </div>
        )}
        {summary && !loading && !error && (
            <div className="mt-8">

                <h2 className="text-xl font-bold text-gray-800">
                    Today's Activity
                </h2>

                <p className="text-gray-500 mt-1">
                    Payment activity for today
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">

                    <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Today's Transactions
                    </p>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {summary.today_transactions}
                    </p>
                    </div>


                    <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Today's Successful
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {summary.today_successful}
                    </p>
                    </div>


                    <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Today's Declined
                    </p>

                    <p className="text-3xl font-bold text-red-600 mt-2">
                        {summary.today_declined}
                    </p>
                    </div>


                    <div className="bg-white rounded-xl shadow p-5">
                    <p className="text-gray-500 text-sm">
                        Today's Amount
                    </p>

                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {summary.today_amount}
                    </p>
                    </div>

                </div>

            </div>
        )}

        {!loading && !error && (
            <div className="mt-8">

                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                        Users
                        </h2>

                        <p className="text-gray-500 mt-1">
                        Registered users in the system
                        </p>
                    </div>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {users.length} Users
                    </span>

                </div>

                <div className="mt-5 bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            ID
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Username
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Email
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Staff
                        </th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.length === 0 ? (
                            <tr>
                            <td
                                colSpan="4"
                                className="px-5 py-6 text-center text-gray-500"
                            >
                                No users found.
                            </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t"
                            >
                                <td className="px-5 py-3 text-sm text-gray-700">
                                {user.id}
                                </td>

                                <td className="px-5 py-3 text-sm text-gray-700">
                                {user.username}
                                </td>

                                <td className="px-5 py-3 text-sm text-gray-700">
                                {user.email}
                                </td>

                                <td className="px-5 py-3 text-sm text-gray-700">
                                {user.is_staff ? 'Yes' : 'No'}
                                </td>
                            </tr>
                            ))
                        )}

                    </tbody>
                </table>

                </div>

                </div>

            </div>
        )}

        {!loading && !error && (
            <div className="mt-8">

                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                        Cards
                        </h2>

                        <p className="text-gray-500 mt-1">
                        Cards registered in the system
                        </p>
                    </div>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {cards.length} Cards
                    </span>

                </div>

                <div className="mt-5 bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            ID
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            User
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Cardholder
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Card
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Type
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Expiry
                        </th>
                        </tr>
                    </thead>

                    <tbody>

                        {cards.length === 0 ? (
                            <tr>
                                <td
                                colSpan="6"
                                className="px-5 py-6 text-center text-gray-500"
                                >
                                No cards found.
                                </td>
                            </tr>
                            ) : (
                            cards.map((card) => (
                                <tr
                                key={card.id}
                                className="border-t"
                                >

                                <td className="px-5 py-3 text-sm text-gray-700">
                                    {card.id}
                                </td>

                                <td className="px-5 py-3 text-sm text-gray-700">
                                    {card.user}
                                </td>

                                <td className="px-5 py-3 text-sm text-gray-700">
                                    {card.cardholder_name}
                                </td>

                                <td className="px-5 py-3 text-sm text-gray-700">
                                    {card.masked_card}
                                </td>

                                <td className="px-5 py-3 text-sm text-gray-700">
                                    {card.card_type}
                                </td>

                                <td className="px-5 py-3 text-sm text-gray-700">
                                    {card.exp_month}/{card.exp_year}
                                </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                    </table>

                </div>

                </div>

            </div>
        )}

        {!loading && !error && (
            <div className="mt-8">

                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                        Transactions
                        </h2>

                        <p className="text-gray-500 mt-1">
                        All payment transactions in the system
                        </p>
                    </div>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {transactions.length} Transactions
                    </span>

                </div>

                <div className="mt-5 bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                    <thead className="bg-gray-50">
                        <tr>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            ID
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Transaction ID
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            User
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Amount
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Status
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Card
                        </th>

                        <th className="px-5 py-3 text-sm font-semibold text-gray-600">
                            Date
                        </th>

                        </tr>
                    </thead>

                    <tbody>

                        {transactions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-5 py-6 text-center text-gray-500"
                                >
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="border-t"
                                >

                                    <td className="px-5 py-3 text-sm text-gray-700">
                                        {transaction.id}
                                    </td>

                                    <td className="px-5 py-3 text-sm text-gray-700">
                                        {transaction.transaction_id}
                                    </td>

                                    <td className="px-5 py-3 text-sm text-gray-700">
                                        {transaction.user}
                                    </td>

                                    <td className="px-5 py-3 text-sm text-gray-700">
                                        {transaction.amount} {transaction.currency}
                                    </td>

                                    <td className="px-5 py-3 text-sm font-semibold">

                                        <span
                                            className={
                                                transaction.status === 'SUCCESS'
                                                    ? 'px-3 py-1 rounded-full bg-green-100 text-green-700'
                                                    : 'px-3 py-1 rounded-full bg-red-100 text-red-700'
                                            }
                                        >
                                            {transaction.status}
                                        </span>

                                    </td>

                                    <td className="px-5 py-3 text-sm text-gray-700">
                                        {transaction.masked_card}
                                    </td>

                                    <td className="px-5 py-3 text-sm text-gray-700">
                                        {new Date(
                                            transaction.created_at
                                        ).toLocaleString()}
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>

                    </table>

                </div>

                </div>

            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

          <Link
            to="/transactions"
            className="bg-white rounded-xl shadow p-6 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Transactions
            </h3>

            <p className="text-gray-500 mt-2">
              View transaction history and filters.
            </p>
          </Link>


          <Link
            to="/cards"
            className="bg-white rounded-xl shadow p-6 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Cards
            </h3>

            <p className="text-gray-500 mt-2">
              View the cards managed by the system.
            </p>
          </Link>

        </div>

      </main>

    </div>
  )
}

export default AdminDashboard