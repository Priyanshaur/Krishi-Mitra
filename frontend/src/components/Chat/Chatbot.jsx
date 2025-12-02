import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Minimize2, Maximize2, MessageCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { chatAPI } from '../../services/api' // Import the API

const Chatbot = ({ isPage = false }) => {
  const [isOpen, setIsOpen] = useState(isPage)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm your Krishi Mitra AI assistant. How can I help you with your farm today? 🌱",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, isOpen])

  const handleSendMessage = async (text = inputMessage) => {
    if (!text.trim()) return

    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      // ✅ REAL API CALL
      const data = await chatAPI.sendMessage(text)
      
      const botResponse = {
        id: Date.now() + 1,
        text: data.response, 
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to the server. Please try again later. ⚠️",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "Best time to plant tomatoes?",
    "Current wheat prices?",
    "Organic pest control methods",
    "Weather forecast this week"
  ]

  if (!isPage && !isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white z-50 flex items-center justify-center"
      >
        <MessageCircle className="h-8 w-8" />
      </Button>
    )
  }

  if (!isPage && isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 w-80 z-50">
        <Card className="shadow-2xl border-green-200">
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-white rounded-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-sm">Krishi Mitra Assistant</h3>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="small" onClick={() => setIsMinimized(false)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="small" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const containerClasses = isPage 
    ? "w-full h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200" 
    : "fixed bottom-6 right-6 w-80 h-[500px] z-50 flex flex-col bg-white rounded-xl shadow-2xl border border-green-100"

  return (
    <div className={containerClasses}>
      <div className="flex flex-row items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <Bot className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-green-900">Krishi Mitra AI</h3>
            <p className="text-xs text-green-700 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        {!isPage && (
          <div className="flex space-x-1">
            <Button variant="ghost" size="small" onClick={() => setIsMinimized(true)} className="hover:bg-green-200/50">
              <Minimize2 className="h-4 w-4 text-green-800" />
            </Button>
            <Button variant="ghost" size="small" onClick={() => setIsOpen(false)} className="hover:bg-red-100">
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 scroll-smooth">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${message.sender === 'user' ? 'bg-green-600' : 'bg-white border border-green-200'}`}>
                  {message.sender === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-green-600" />}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${message.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <div className="w-8 h-8 rounded-full bg-white border border-green-200 flex items-center justify-center shadow-sm">
                  <Bot className="h-4 w-4 text-green-600" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {messages.length <= 2 && (
        <div className="px-4 pb-2 bg-gray-50/50">
          <p className="text-xs text-gray-500 mb-2 font-medium ml-1">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button key={index} onClick={() => handleSendMessage(question)} className="text-xs bg-white hover:bg-green-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors shadow-sm whitespace-nowrap">
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4 bg-white border-t rounded-b-xl">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={() => handleSendMessage()} disabled={!inputMessage.trim() || loading} variant="primary" className="bg-green-600 hover:bg-green-700 px-4">
            {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Chatbot