import { BrowserRouter, Routes, Route,  Navigate, } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Payment from './pages/Payment'
import Transactions from './pages/Transactions'
import AdminDashboard from './pages/AdminDashboard'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            localStorage.getItem('access_token') ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/cards" element={
          <ProtectedRoute>
            <Cards />
          </ProtectedRoute>
          } 
        />

        <Route path="/payment" element={
          <ProtectedRoute> 
            <Payment /> 
          </ProtectedRoute>
          } 
        />

        <Route path="/transactions" element={
          <ProtectedRoute> 
            <Transactions /> 
          </ProtectedRoute>
        } 
        />

        <Route path="/admin" element={
          <AdminRoute> 
            <AdminDashboard /> 
            </AdminRoute>
          } 
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App