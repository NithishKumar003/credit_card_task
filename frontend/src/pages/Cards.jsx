
import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'

console.log('Cards.jsx loaded')

function Cards() {
  const navigate = useNavigate()
  const [cardholderName, setCardholderName] = useState('')
  const [cardType, setCardType] = useState('Credit')
  const [cardNumber, setCardNumber] = useState('')
  const [cvv, setCvv] = useState('')
  const [expMonth, setExpMonth] = useState('')
  const [expYear, setExpYear] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  
  const [cards, setCards] = useState([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [loading, setLoading] = useState(false)
  

    useEffect(() => {
        const loadCards = async () => {
            setLoadingCards(true)

            try {
            const response = await api.get('/api/cards/')
            setCards(response.data)
            } catch (error) {
            console.log('Card loading error:', error)
            console.log('Django response:', error.response?.data)

                setError(
                    error.response?.data?.detail ||
                    'Unable to load your cards.'
                )
            } finally {
            setLoadingCards(false)
            }
        }

        loadCards()
    }, [])


    const handleDelete = async (cardId) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this card?'
        )

        if (!confirmDelete) {
            return
        }
        try {
            await api.delete(`/api/cards/card-detail/${cardId}/`)

            setCards((currentCards) =>
            currentCards.filter((card) => card.id !== cardId)
            )

        } catch (error) {
            console.log('Card delete error:', error)
            console.log('Django response:', error.response?.data)
        }
    }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    try {
        setLoading(true)

        const response = await api.post('/api/cards/', {
        cardholder_name: cardholderName,
        card_type: cardType,
        card_number: cardNumber,
        cvv: cvv,
        exp_month: Number(expMonth),
        exp_year: Number(expYear),
        })

        console.log('Card added successfully:', response.data)

        setSuccess('Card added successfully.')

        const cardsResponse = await api.get('/api/cards/')
        setCards(cardsResponse.data)

        setCardholderName('')
        setCardType('Credit')
        setCardNumber('')
        setCvv('')
        setExpMonth('')
        setExpYear('')

    } catch (error) {
        console.log('Card creation error:', error)
        console.log('Django response:', error.response?.data)

        const responseData = error.response?.data

        if (responseData?.detail) {
        setError(responseData.detail)
        } else if (responseData?.card_number) {
        setError(responseData.card_number[0])
        } else if (responseData?.cvv) {
        setError(responseData.cvv[0])
        } else if (responseData?.exp_month) {
        setError(responseData.exp_month[0])
        } else {
        setError('Unable to add card. Please check your details.')
        }

    } finally {
        setLoading(false)
    }


    }

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        navigate('/login')
    }
    
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-2xl font-bold text-blue-600">
            Credit Card Payment
          </h1>

          <nav className="flex items-center gap-5">

            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>

            <Link
              to="/cards"
              className="text-blue-600 font-semibold"
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

            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
                Logout
            </button>

          </nav>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-8">

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-800">
            Add New Card
          </h2>

          <p className="text-gray-500 mt-2">
            Add your credit or debit card securely.
          </p>

          {error && (
            <div className="mt-5 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
            )}

            {success && (
            <div className="mt-5 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
                {success}
            </div>
            )}

          <form onSubmit={handleSubmit} className="mt-6">

            {/* Cardholder Name */}
            <div>
              <label className="block text-gray-700 mb-2">
                Cardholder Name
              </label>

              <input
                type="text"
                value={cardholderName}
                onChange={(event) => setCardholderName(event.target.value)}
                placeholder="Enter cardholder name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Card Type */}
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">
                Card Type
              </label>

              <select
                value={cardType}
                onChange={(event) => setCardType(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Credit">Credit Card</option>
                <option value="Debit">Debit Card</option>
              </select>
            </div>

            {/* Card Number */}
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">
                Card Number
              </label>

              <input
                type="text"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                placeholder="Enter card number"
                inputMode="numeric"
                maxLength="19"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-sm text-gray-500 mt-1">
                Your full card number will not be stored.
              </p>
            </div>

            {/* CVV */}
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">
                CVV
              </label>

              <input
                type="password"
                value={cvv}
                onChange={(event) => setCvv(event.target.value)}
                placeholder="Enter CVV"
                inputMode="numeric"
                maxLength="4"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-sm text-gray-500 mt-1">
                CVV is used only for validation and is not stored.
              </p>
            </div>

            {/* Expiry */}
            <div className="grid grid-cols-2 gap-4 mt-4">

              <div>
                <label className="block text-gray-700 mb-2">
                  Expiry Month
                </label>

                <input
                  type="number"
                  value={expMonth}
                  onChange={(event) => setExpMonth(event.target.value)}
                  placeholder="MM"
                  min="1"
                  max="12"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Expiry Year
                </label>

                <input
                  type="number"
                  value={expYear}
                  onChange={(event) => setExpYear(event.target.value)}
                  placeholder="YYYY"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                >
                {loading ? 'Adding Card...' : 'Add Card'}
            </button>

          </form>

          <div className="mt-10">

            <h2 className="text-xl font-bold text-gray-800">
                Your Saved Cards
            </h2>

            {loadingCards ? (
                <p className="text-gray-500 mt-4">
                Loading cards...
                </p>
            ) : cards.length === 0 ? (
                <p className="text-gray-500 mt-4">
                No cards added yet.
                </p>
            ) : (
                <div className="space-y-4 mt-4">

                {cards.map((card) => (
                    <div
                    key={card.id}
                    className="border border-gray-200 rounded-xl p-5"
                    >

                    <div className="flex items-center justify-between">

                        <div>
                        <h3 className="font-semibold text-gray-800">
                            {card.cardholder_name}
                        </h3>

                        <p className="text-gray-600 mt-1">
                            {card.masked_card}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            {card.card_type} • Expires {card.exp_month}/{card.exp_year}
                        </p>
                        </div>

                        <span className="text-sm text-green-600 font-semibold">
                        Saved
                        </span>

                        <button
                            onClick={() => handleDelete(card.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Delete
                        </button>

                    </div>

                    </div>
                ))}

                </div>
            )}

            </div>

        </div>

      </main>

    </div>
  )
}

export default Cards