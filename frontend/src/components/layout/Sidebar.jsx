import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const farmerNavigation = [
    { name: t('common.dashboard'), href: "/dashboard", icon: BarChart3 },
    { name: t('sidebar.home'), href: "/", icon: Home },
    { name: t('common.marketplace'), href: "/marketplace", icon: ShoppingCart },
    { name: t('sidebar.sellProduce'), href: "/marketplace/create", icon: Plus },
    { name: t('sidebar.myListings'), href: "/marketplace/my", icon: List },
    { name: t('sidebar.orders'), href: "/marketplace/orders", icon: Truck },
    { name: t('common.diagnose'), href: "/diagnose", icon: Leaf },
    { name: t('common.settings'), href: "/settings", icon: SettingsIcon },
  ];

  const buyerNavigation = [
    { name: t('common.dashboard'), href: "/dashboard", icon: BarChart3 },
    { name: t('sidebar.home'), href: "/", icon: Home },
    { name: t('common.marketplace'), href: "/marketplace", icon: ShoppingCart },
    { name: t('sidebar.myOrders'), href: "/orders", icon: Package },
    { name: t('common.settings'), href: "/settings", icon: SettingsIcon },
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
            <span className="text-xl font-bold text-green-800 dark:text-green-400">Krishi Mitra</span>
          </Link>

          {/* Close on mobile */}
          <button onClick={() => setOpen(false)} className="mobile-only">
            <X className="h-5 w-5 text-green-700 dark:text-green-400" />
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
                    className={`sidebar-button ${isActive(item.href) ? "active" : ""
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
                  <span className="ai-title">{t('sidebar.aiTitle')}</span>
                </div>
                <p className="ai-description">
                  {t('sidebar.aiDescription')}
                </p>
                <button
                  onClick={() => handleNavigation("/chat")}
                  className="chat-button"
                >
                  💬 {t('sidebar.chatNow')}
                </button>
              </div>
            </>
          ) : (
            <div className="welcome-section">
              <p className="welcome-text">{t('sidebar.welcomeGuest')}</p>
              <Link
                to="/login"
                className="auth-button"
                onClick={() => setOpen(false)}
              >
                {t('common.login')}
              </Link>
              <Link
                to="/register"
                className="auth-button register-button"
                onClick={() => setOpen(false)}
              >
                {t('common.register')}
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
                <p className="user-role">{user?.role === 'farmer' ? t('auth.roleFarmer') : t('auth.roleBuyer')}</p>
              </div>
            </div>

            <div className="action-buttons">
              <button
                onClick={() => handleNavigation("/profile")}
                className="action-button"
              >
                {t('common.profile')}
              </button>
              <button
                onClick={() => handleNavigation("/settings")}
                className="action-button"
              >
                {t('common.settings')}
              </button>
            </div>

            <button onClick={handleLogout} className="logout-button">
              <LogOut className="logout-icon" />
              {t('common.logout')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;