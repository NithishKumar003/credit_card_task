import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import api from '../services/api'


function AdminRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const accessToken = localStorage.getItem('access_token')

  useEffect(() => {
    const checkAdmin = async () => {
      if (!accessToken) {
        setChecking(false)
        return
      }

      try {
        const response = await api.get(
          '/api/auth/admin-check/'
        )

        setIsAdmin(response.data.is_admin)
      } catch (error) {
        console.log('Admin check error:', error)
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    checkAdmin()
  }, [accessToken])

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Checking admin access...
        </p>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute