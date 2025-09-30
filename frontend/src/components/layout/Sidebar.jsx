import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/slices/authSlice" // adjust path
import {
  X,
  BarChart3,
  ShoppingCart,
  Leaf,
  Package,
  User,
  Bot,
  LogOut,
} from "lucide-react"
import Button from "../ui/Button"

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const farmerNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Crop Diagnosis", href: "/diagnose", icon: Leaf },
    { name: "My Listings", href: "/marketplace/my", icon: Package },
  ]

  const buyerNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "My Orders", href: "/orders", icon: Package },
  ]

  const navigation = user?.role === "farmer" ? farmerNavigation : buyerNavigation

  const isActive = (href) => location.pathname === href

  const handleNavigation = (href) => {
    navigate(href)
    setOpen(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    setOpen(false)
    navigate("/") // back to homepage after logout
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Krishi Mitra</span>
        </Link>
        <Button
          variant="ghost"
          size="small"
          onClick={() => setOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 flex flex-col overflow-y-auto py-4">
        {isAuthenticated ? (
          <>
            {/* Authenticated Navigation */}
            <div className="px-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </button>
              ))}
            </div>

            {/* AI Assistant */}
            <div className="mt-8 px-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">
                    AI Assistant
                  </span>
                </div>
                <p className="text-xs text-blue-700 mb-3">
                  Get instant help with farming queries, market prices, and crop
                  advice
                </p>
                <button
                  onClick={() => handleNavigation("/chat")}
                  className="w-full bg-white text-blue-600 text-xs font-medium py-2 px-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  💬 Chat Now
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-4">
            <p className="text-gray-600 text-sm mb-3">Welcome! Please sign in.</p>
            <Link
              to="/login"
              className="block w-full bg-green-500 text-white text-center py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block w-full mt-2 bg-gray-100 text-gray-700 text-center py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              onClick={() => setOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </nav>

      {/* User Section - only when logged in */}
      {isAuthenticated && (
        <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs font-medium text-green-600 capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleNavigation("/profile")}
              className="flex-1 bg-gray-100 text-gray-700 text-xs font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => handleNavigation("/settings")}
              className="flex-1 bg-gray-100 text-gray-700 text-xs font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Settings
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center text-red-600 text-sm font-medium py-2 px-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar
