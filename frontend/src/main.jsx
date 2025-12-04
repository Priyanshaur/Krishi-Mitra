import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google' // ✅ Import Google Provider
import { I18nextProvider } from 'react-i18next'
import { store } from './store/store.js'
import i18n from './i18n/index.js'
import { ThemeProvider } from './context/ThemeContext.jsx'
import App from './App.jsx'
import './index.css'

// 1. Initialize dark mode from localStorage immediately to prevent flash
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

// 2. Render App with all Providers
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        {/* ✅ Wrap App with Google OAuth */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
)