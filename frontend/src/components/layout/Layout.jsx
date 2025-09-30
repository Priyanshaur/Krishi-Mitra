import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Chatbot from '../Chat/Chatbot'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
      `}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* AI Assistant Chatbot */}
      <Chatbot />
    </div>
  )
}

export default Layout