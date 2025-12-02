import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Chatbot from '../Chat/Chatbot'

// 1. Add useLocation to imports
import { useLocation } from 'react-router-dom' 

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // 2. Get current location
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 3. Only show floating chatbot if NOT on the chat page */}
      {!isChatPage && <Chatbot />} 
    </div>
  )
}

export default Layout