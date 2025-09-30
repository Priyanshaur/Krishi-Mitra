import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Bell, Search, User } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import Button from '../ui/Button'

const Header = ({ onMenuToggle }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/marketplace') return 'Marketplace'
    if (path === '/diagnose') return 'Crop Diagnosis'
    if (path === '/profile') return 'Profile'
    return 'Krishi Mitra'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="small"
              onClick={onMenuToggle}
              className="lg:hidden mr-3"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="small" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <Button variant="ghost" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header