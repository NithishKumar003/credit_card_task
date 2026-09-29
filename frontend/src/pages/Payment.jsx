import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Payment() {
    const navigate = useNavigate()
    const [cards, setCards] = useState([])
    const [loadingCards, setLoadingCards] = useState(true)

    const [selectedCard, setSelectedCard] = useState('')
    const [amount, setAmount] = useState('')

    const [cardholderName, setCardholderName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [cvv, setCvv] = useState('')
    const [expMonth, setExpMonth] = useState('')
    const [expYear, setExpYear] = useState('')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const [paymentResult, setPaymentResult] = useState(null)

    useEffect(() => {
    const loadCards = async () => {
        try {
        const response = await api.get('/api/cards/')

        console.log('Payment cards:', response.data)

        setCards(response.data)
        } catch (error) {
        console.log('Payment cards error:', error.response?.data)
        } finally {
        setLoadingCards(false)
        }
    }

    loadCards()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()

        setPaymentResult(null)
        setError('')
        setSuccess('')

        try {
            setLoading(true)

            // console.log('Payment data:', {
            //     cardholder_name: cardholderName,
            //     card_number: cardNumber,
            //     exp_month: Number(expMonth),
            //     exp_year: Number(expYear),
            //     cvv: cvv,
            //     amount: Number(amount),
            //     currency: 'USD',
            // })

            const response = await api.post('/api/payments/process/', {
                cardholder_name: cardholderName,
                card_number: cardNumber,
                exp_month: Number(expMonth),
                exp_year: Number(expYear),
                cvv: cvv,
                amount: Number(amount),
                currency: 'USD',
            })

            console.log('Payment response:', response.data)

            setPaymentResult(response.data)

            setCardNumber('')
            setCvv('')

            if (response.data.status === 'SUCCESS') {
                setSuccess('Payment processed successfully.')
                } else {
                setSuccess('Payment was declined.')
            }

        } catch (error) {
            console.log('Payment error:', error)
            console.log('Django response:', error.response?.data)

            setError(
                error.response?.data?.detail ||
                'Payment failed. Please check your details.'
            )
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
                className="text-gray-700 hover:text-blue-600 font-medium"
                >
                Cards
                </Link>

                <Link
                to="/payment"
                className="text-blue-600 font-semibold"
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

        <main className="max-w-2xl mx-auto px-6 py-8">

            <div className="bg-white rounded-xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-gray-800">
                Make Payment
            </h2>

            <p className="text-gray-500 mt-2">
                Enter the payment details below.
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

             {paymentResult && (
                <div
                    className={
                        paymentResult.status === 'SUCCESS'
                        ? 'mt-6 border border-green-200 bg-green-50 rounded-xl p-5'
                        : 'mt-6 border border-red-200 bg-red-50 rounded-xl p-5'
                    }
                >
                    <h2
                        className={
                            paymentResult.status === 'SUCCESS'
                            ? 'text-xl font-bold text-green-700'
                            : 'text-xl font-bold text-red-700'
                        }
                        >
                        {paymentResult.status === 'SUCCESS'
                            ? 'Payment Successful'
                            : 'Payment Declined'}
                    </h2>

                    <div className="mt-4 space-y-2 text-gray-700">
                    <p>
                        <span className="font-semibold">Transaction ID:</span>{' '}
                        {paymentResult.transaction_id}
                    </p>

                    <p>
                        <span className="font-semibold">Amount:</span>{' '}
                        {paymentResult.amount}
                    </p>

                    <p>
                        <span className="font-semibold">Currency:</span>{' '}
                        {paymentResult.currency}
                    </p>

                    <p>
                        <span className="font-semibold">Status:</span>{' '}
                        {paymentResult.status}
                    </p>

                    <p>
                        <span className="font-semibold">Card:</span>{' '}
                        {paymentResult.masked_card}
                    </p>

                    <p>
                        <span className="font-semibold">Message:</span>{' '}
                        {paymentResult.message}
                    </p>
                    </div>
                </div>
             )}

            <form onSubmit={handleSubmit} className="mt-6">

                <div>
                {/* <label className="block text-gray-700 mb-2">
                    Select Card
                </label> */}

                {/* <select
                    value={selectedCard}
                    onChange={(event) => {
                        const cardId = event.target.value
                        console.log('Selected card ID:', cardId)
                        console.log('Saved cards:', cards)
                        setSelectedCard(cardId)

                        const selectedSavedCard = cards.find(
                            (card) => String(card.id) === cardId
                        )

                        if (!selectedSavedCard) {
                            return
                        }

                        setCardholderName(selectedSavedCard.cardholder_name)
                        setExpMonth(String(selectedSavedCard.exp_month))
                        setExpYear(String(selectedSavedCard.exp_year))
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    disabled={loadingCards}
                >
                    <option value="">
                        {loadingCards ? 'Loading cards...' : 'Select a card'}
                    </option>

                    {cards.map((card) => (
                        <option key={card.id} value={card.id}>
                        {card.masked_card}
                        </option>
                    ))}
                </select> */}

                </div>

                <div>
                    {cards.length > 0 && (
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Use Saved Card
                            </label>

                            <select
                            value={selectedCard}
                            onChange={(event) => {
                                const cardId = event.target.value

                                setSelectedCard(cardId)

                                const selectedSavedCard = cards.find(
                                    (card) => String(card.id) === String(cardId)
                                )

                                if (!selectedSavedCard) {
                                    setCardholderName('')
                                    setExpMonth('')
                                    setExpYear('')
                                    return
                                }

                                setCardholderName(selectedSavedCard.cardholder_name)
                                setExpMonth(String(selectedSavedCard.exp_month))
                                setExpYear(String(selectedSavedCard.exp_year))
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            >
                            <option value="">
                                Select a saved card
                            </option>

                            {cards.map((card) => (
                                <option
                                key={card.id}
                                value={card.id}
                                >
                                {card.masked_card} - {card.cardholder_name}
                                </option>
                            ))}
                            </select>
                        </div>
                    )}
                    <label className="block text-gray-700 mb-2">
                        Cardholder Name
                    </label>

                    <input
                        type="text"
                        value={cardholderName}
                        onChange={(event) => setCardholderName(event.target.value)}
                        placeholder="Enter cardholder name"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                    </div>

                    <div className="mt-5">
                    <label className="block text-gray-700 mb-2">
                        Card Number
                    </label>

                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(event) => setCardNumber(event.target.value)}
                        placeholder="Enter card number"
                        maxLength="19"
                        inputMode="numeric"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                    </div>

                    <div className="mt-5">
                    <label className="block text-gray-700 mb-2">
                        CVV
                    </label>

                    <input
                        type="password"
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value)}
                        placeholder="Enter CVV"
                        maxLength="4"
                        inputMode="numeric"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-5">

                    <div>
                        <label className="block text-gray-700 mb-2">
                        Expiry Month
                        </label>

                        <input
                        type="number"
                        min="1"
                        max="12"
                        value={expMonth}
                        onChange={(event) => setExpMonth(event.target.value)}
                        placeholder="MM"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                    </div>

                </div>

                <div className="mt-5">
                <label className="block text-gray-700 mb-2">
                    Amount
                </label>

                <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {loading ? 'Processing Payment...' : 'Pay Now'}
                </button>

            </form>

            </div>

        </main>
        </div>
    )
}

export default Payment