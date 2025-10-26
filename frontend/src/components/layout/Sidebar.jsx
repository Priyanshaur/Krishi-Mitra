import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import {
  X,
  BarChart3,
  ShoppingCart,
  Leaf,
  Package,
  User,
  Bot,
  LogOut,
  Settings as SettingsIcon,
  Home,
  Plus,
  List,
  Truck,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const farmerNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Home Page", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Sell Produce", href: "/marketplace/create", icon: Plus },
    { name: "My Listings", href: "/marketplace/my", icon: List },
    { name: "Orders", href: "/marketplace/orders", icon: Truck },
    { name: "Crop Diagnosis", href: "/diagnose", icon: Leaf },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const buyerNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Home Page", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "My Orders", href: "/orders", icon: Package },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const navigation = user?.role === "farmer" ? farmerNavigation : buyerNavigation;

  const isActive = (href) => location.pathname === href;

  const handleNavigation = (href) => {
    navigate(href);
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Dark backdrop for mobile */}
      <div
        className={`sidebar-backdrop ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar itself */}
      <div className={`sidebar-container ${open ? "open" : ""}`}>
        {/* Logo + Close button */}
        <header>
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-800">Krishi Mitra</span>
          </Link>

          {/* Close on mobile */}
          <button onClick={() => setOpen(false)} className="mobile-only">
            <X className="h-5 w-5 text-green-700" />
          </button>
        </header>

        <nav>
          {isAuthenticated ? (
            <>
              <div className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`sidebar-button ${
                      isActive(item.href) ? "active" : ""
                    }`}
                  >
                    <item.icon className="sidebar-icon" />
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="ai-assistant">
                <div className="ai-header">
                  <Bot className="ai-icon" />
                  <span className="ai-title">AI Assistant</span>
                </div>
                <p className="ai-description">
                  Get instant help with farming queries, market prices, and crop advice
                </p>
                <button
                  onClick={() => handleNavigation("/chat")}
                  className="chat-button"
                >
                  💬 Chat Now
                </button>
              </div>
            </>
          ) : (
            <div className="welcome-section">
              <p className="welcome-text">Welcome! Please sign in.</p>
              <Link
                to="/login"
                className="auth-button"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="auth-button register-button"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {isAuthenticated && (
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">{user?.role}</p>
              </div>
            </div>

            <div className="action-buttons">
              <button
                onClick={() => handleNavigation("/profile")}
                className="action-button"
              >
                Profile
              </button>
              <button
                onClick={() => handleNavigation("/settings")}
                className="action-button"
              >
                Settings
              </button>
            </div>

            <button onClick={handleLogout} className="logout-button">
              <LogOut className="logout-icon" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;