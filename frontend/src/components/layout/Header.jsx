import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Menu, Bell, Search, User, Home } from 'lucide-react'
import { logoutUser } from '../../store/slices/authSlice'
import { markAsRead } from '../../store/slices/notificationSlice'
import Button from '../ui/Button'

const Header = ({ onMenuToggle }) => {
  // 1. Hooks & State
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()
  const [showNotifications, setShowNotifications] = useState(false)

  // 2. Redux Selectors
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const { items, unreadCount } = useSelector(state => state.notifications)

  // 3. Handlers
  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (unreadCount > 0) {
      dispatch(markAsRead());
    }
  };

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return t('common.dashboard')
    if (path === '/marketplace') return t('common.marketplace')
    if (path === '/diagnose') return t('common.diagnose')
    if (path === '/profile') return t('common.profile')
    if (path === '/settings') return t('common.settings')
    return 'Krishi Mitra'
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 z-20 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="small"
              onClick={onMenuToggle}
              className="lg:hidden mr-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent dark:from-green-400 dark:to-green-600">
                  Krishi Mitra
                </span>
              </Link>
              
              <h1 className="text-xl font-semibold text-gray-900 hidden sm:block dark:text-white">
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
                placeholder={t('header.searchPlaceholder')}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="small" 
                onClick={handleNotificationClick}
                className="relative text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <Bell className="h-5 w-5" />
                
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden dark:bg-gray-800 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {items.length > 0 ? (
                        items.map((item) => (
                          <div key={item.id} className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors dark:hover:bg-gray-700/50 dark:border-gray-700">
                            <p className="text-sm text-gray-800 dark:text-gray-200">{item.text}</p>
                            <span className="text-xs text-gray-500 mt-1 block">{item.time}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="font-medium text-gray-900 dark:text-white">{user?.name}</div>
                  <div className="text-sm text-gray-500 capitalize dark:text-gray-400">{user?.role}</div>
                </div>
                <Link to="/profile">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:hover:bg-green-800/50">
                    <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  size="small" 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {t('common.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium dark:text-green-400 dark:hover:text-green-300">
                  {t('common.login')}
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800">
                  {t('header.getStarted')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header