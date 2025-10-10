import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { store } from './store/store.js'
import i18n from './i18n/index.js'
import App from './App.jsx'
import './index.css'

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark')
}

// Language is handled by i18next automatically through the i18n configuration

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
          <App />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
)