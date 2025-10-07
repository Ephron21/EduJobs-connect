import { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, Send, X, Bot, User, Minimize2, Maximize2,
  Loader, Sparkles, HelpCircle, Phone, Mail
} from 'lucide-react'

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "👋 Hello! I'm EduBot, your AI assistant. I'm here to help you with questions about universities, jobs, applications, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Predefined responses for common questions
  const predefinedResponses = {
    greeting: [
      "hello", "hi", "hey", "good morning", "good afternoon", "good evening"
    ],
    universities: [
      "university", "universities", "college", "education", "study", "degree", "bachelor", "master"
    ],
    jobs: [
      "job", "jobs", "work", "employment", "career", "vacancy", "position", "hiring"
    ],
    applications: [
      "apply", "application", "applications", "how to apply", "requirements", "documents"
    ],
    contact: [
      "contact", "phone", "email", "whatsapp", "support", "help", "admin"
    ],
    fees: [
      "fee", "fees", "cost", "price", "tuition", "payment", "scholarship"
    ]
  }

  const responses = {
    greeting: [
      "Hello! 😊 I'm here to help you with any questions about education and career opportunities in Rwanda. What would you like to know?",
      "Hi there! 👋 Welcome to EduJobs Connect. I can help you find universities, jobs, or answer any questions you have!",
      "Hey! Great to see you here. I'm your AI assistant ready to help with universities, jobs, and career guidance. What's on your mind?"
    ],
    universities: [
      "🎓 Great question about universities! We partner with top institutions in Rwanda including:\n\n• University of Rwanda (UR)\n• Kigali Institute of Science and Technology (KIST)\n• African Leadership University (ALU)\n• And many more!\n\nWould you like information about specific programs, admission requirements, or application processes?",
      "🏫 We have partnerships with 50+ universities offering various programs. You can find:\n\n• Undergraduate degrees\n• Master's programs\n• PhD opportunities\n• Certificate courses\n\nWhat field of study interests you most?"
    ],
    jobs: [
      "💼 Excellent! We have 200+ job opportunities across various sectors:\n\n• Technology & IT\n• Healthcare\n• Education\n• Finance & Banking\n• Engineering\n• Marketing & Sales\n\nWhat type of position are you looking for? I can help you find the perfect match!",
      "🚀 Our job board features opportunities from entry-level to executive positions. We work with top companies in Rwanda and internationally. What's your area of expertise?"
    ],
    applications: [
      "📝 I'd be happy to help with applications! Here's what you typically need:\n\n**For Universities:**\n• Academic transcripts\n• Personal statement\n• Recommendation letters\n• Language proficiency (if required)\n\n**For Jobs:**\n• Updated CV/Resume\n• Cover letter\n• Portfolio (if applicable)\n\nWhich type of application do you need help with?",
      "✅ Application process made easy! We provide step-by-step guidance for both university and job applications. Our success rate is 85%! What specific help do you need?"
    ],
    contact: [
      "📞 **Get in Touch with Us:**\n\n🔹 **WhatsApp:** +250 787 846 344 (Instant support)\n🔹 **Email:** info@edujobsconnect.rw\n🔹 **Office Hours:** Mon-Fri 8AM-5PM, Sat 9AM-1PM\n🔹 **Location:** Kigali, Rwanda - KG 9 Ave, Nyarugenge District\n\n💬 You can also use our contact form for detailed inquiries. We respond within 24 hours!",
      "🤝 **We're Here to Help!**\n\nFor immediate assistance:\n• WhatsApp: +250 787 846 344\n• Live chat (right here!)\n• Email support\n\nOur team is dedicated to your success. What's the best way for us to assist you?"
    ],
    fees: [
      "💰 **Transparent Pricing & Financial Support:**\n\n🎯 **Our Services:** FREE consultation and guidance\n🎓 **University Fees:** Vary by institution (we help find scholarships!)\n💼 **Job Placement:** No fees for job seekers\n🏆 **Scholarships:** We've helped students secure $2M+ in scholarships\n\nWould you like information about specific costs or financial aid options?",
      "💡 **Financial Options Available:**\n\n• Merit-based scholarships\n• Need-based financial aid\n• Payment plans\n• Student loans\n• Work-study programs\n\nLet me know your situation and I'll help find the best financial solution!"
    ],
    default: [
      "🤔 That's an interesting question! While I try to help with most inquiries, I might need to connect you with our human experts for detailed assistance.\n\n**Quick options:**\n• Ask me about universities, jobs, or applications\n• Contact our team via WhatsApp: +250 787 846 344\n• Use our contact form for complex queries\n\nWhat specific area would you like help with?",
      "💭 I want to make sure I give you the best answer! Could you rephrase your question or let me know if you're asking about:\n\n• University programs\n• Job opportunities\n• Application processes\n• Contact information\n• Fees and scholarships\n\nOr feel free to reach out to our human team for personalized assistance!"
    ]
  }

  const getResponseCategory = (message) => {
    const lowerMessage = message.toLowerCase()
    
    for (const [category, keywords] of Object.entries(predefinedResponses)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return category
      }
    }
    return 'default'
  }

  const generateResponse = (userMessage) => {
    const category = getResponseCategory(userMessage)
    const categoryResponses = responses[category]
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateResponse(inputMessage),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000) // Random delay between 1.5-2.5 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "How do I apply to universities?",
    "What jobs are available?",
    "Tell me about scholarships",
    "How can I contact support?",
    "What are the requirements?"
  ]

  const handleQuickQuestion = (question) => {
    setInputMessage(question)
    setTimeout(() => handleSendMessage(), 100)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chat with EduBot AI 🤖
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold">EduBot AI</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-md'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-md shadow-md">
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

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows="1"
                    style={{ minHeight: '44px', maxHeight: '100px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Powered by EduBot AI • Press Enter to send
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AIChatbot