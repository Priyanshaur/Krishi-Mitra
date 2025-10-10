import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Chatbot from '../Chat/Chatbot'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-gray-900">
      {/* Sidebar - now handled entirely by the Sidebar component */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        
        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* AI Assistant Chatbot */}
      <Chatbot />
    </div>
  )
}

export default Layout