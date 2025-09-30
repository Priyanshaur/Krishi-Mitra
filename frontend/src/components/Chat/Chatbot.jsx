import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Minimize2, Maximize2, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm your Krishi Mitra AI assistant. I can help you with crop diseases, market prices, farming tips, and more. How can I assist you today? 🌱",
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
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    // Simulate AI response based on message content
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setLoading(false)
    }, 1500)
  }

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('disease') || lowerMessage.includes('leaf') || lowerMessage.includes('sick')) {
      return "For disease diagnosis, please upload a clear image of the affected leaf in the Diagnosis section. I can identify common diseases like Early Blight, Late Blight, Powdery Mildew, and suggest organic and chemical treatments. 🍃"
    } 
    else if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('sell')) {
      return "Current market prices vary by region. In Maharashtra, tomatoes are ₹40-60/kg, wheat ₹22-25/kg. Check the Marketplace for real-time prices from local buyers. I can help you find the best selling opportunities! 💰"
    }
    else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient') || lowerMessage.includes('soil')) {
      return "For fertilizer recommendations, consider soil testing first. Organic options include compost, vermicompost, and green manure. Chemical fertilizers should be used based on soil analysis. Different crops need different NPK ratios. 🌿"
    }
    else if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('monsoon')) {
      return "I recommend checking real-time weather forecasts for your location. For Maharashtra, the monsoon pattern suggests good rainfall this week. Consider protecting crops if heavy rain is expected. ⛈️"
    }
    else if (lowerMessage.includes('tomato') || lowerMessage.includes('wheat') || lowerMessage.includes('crop')) {
      return "For tomato cultivation: Maintain soil pH 6-7, spacing 45-60cm. Wheat needs well-drained soil, temperature 20-25°C. Both benefit from crop rotation. Need specific crop advice? Just ask! 🌾"
    }
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return "Namaste! 🌱 I'm here to help with all your farming needs - from crop management to market insights. What would you like to know today?"
    }
    else {
      return "I can help with farming advice, disease diagnosis, market prices, weather information, and crop management tips. Please ask me about specific crops, farming techniques, or market opportunities. How else can I assist you? 🤔"
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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 w-80 z-50">
        <Card className="shadow-2xl border-green-200">
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-sm">Krishi Mitra Assistant</h3>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <p className="text-sm text-gray-600 text-center">Chat minimized - Click to expand</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 z-50">
      <Card className="h-full flex flex-col shadow-2xl border-green-200">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Krishi Mitra Assistant</h3>
              <p className="text-xs text-green-600">AI Farming Expert</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="small"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-4 overflow-y-auto bg-white">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className={`text-xs mt-1 block ${
                      message.sender === 'user' ? 'text-green-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crops, prices, diseases..."
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              variant="primary"
              size="small"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Chatbot