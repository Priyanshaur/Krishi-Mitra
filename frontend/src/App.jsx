import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, fetchUser } from './store/slices/authSlice'

// Pages
import HomePage from './pages/Homepage'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import FarmerDashboard from './pages/Dashboard/FarmerDashboard'
import BuyerDashboard from './pages/Dashboard/BuyerDashboard'
import MarketList from './pages/Marketplace/MarketList'
import MarketItem from './pages/Marketplace/MarketItem'
import CreateListing from './pages/Marketplace/CreateListing'
import MyListings from './pages/Marketplace/MyListings'
import Orders from './pages/Marketplace/Orders'
import OrderDetails from './pages/Marketplace/OrderDetails'
import Diagnose from './pages/Diagnose/Diagnose'
import Settings from './pages/Settings/Settings'
import Profile from './pages/Profile/Profile'

// Layout
import Layout from './components/layout/Layout'

//chatbot
import Chatbot from './components/Chat/Chatbot'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth)
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, token } = useSelector(state => state.auth)

  // Validate token on app start
  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  // Handle unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logoutUser());
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                {user?.role === 'farmer' ? <FarmerDashboard /> : <BuyerDashboard />}
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <Layout>
                <MarketList />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/marketplace/:id" element={
            <ProtectedRoute>
              <Layout>
                <MarketItem />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/marketplace/create" element={
            <ProtectedRoute>
              <Layout>
                <CreateListing />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/marketplace/my" element={
            <ProtectedRoute>
              <Layout>
                <MyListings />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/marketplace/orders" element={
            <ProtectedRoute>
              <Layout>
                <Orders />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/marketplace/orders/:id" element={
            <ProtectedRoute>
              <Layout>
                <OrderDetails />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/diagnose" element={
            <ProtectedRoute>
              <Layout>
                <Diagnose />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout>
                <Chatbot />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App