'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hello! I am your BizMind AI. Tell me about your sales, expenses, or ask anything about your business!' }
  ])
  const [transactions, setTransactions] = useState([
    { type: 'sale', description: 'Sample sale', amount: 1500, date: 'Today' },
    { type: 'expense', description: 'Sample expense', amount: 300, date: 'Today' },
  ])
  const [loading, setLoading] = useState(false)

  const totalSales = transactions.filter(t => t.type === 'sale').reduce((a, t) => a + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const netProfit = totalSales - totalExpenses

  const sendMessage = async () => {
    if (!chatMessage.trim()) return
    const userMsg = chatMessage
    setChatMessage('')
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          businessProfile: {
            business_name: 'My Business',
            business_type: 'retail',
            language: 'English',
            daily_revenue_estimate: 500,
            billing_method: 'manual'
          }
        }),
      })

      const data = await response.json()

      const msg = userMsg.toLowerCase()
      const amount = userMsg.match(/\d+(\.\d+)?/)
      if (amount && (msg.includes('sold') || msg.includes('sale'))) {
        setTransactions(prev => [...prev, {
          type: 'sale',
          description: userMsg,
          amount: parseFloat(amount[0]),
          date: 'Today'
        }])
      } else if (amount && (msg.includes('spent') || msg.includes('expense') || msg.includes('paid'))) {
        setTransactions(prev => [...prev, {
          type: 'expense',
          description: userMsg,
          amount: parseFloat(amount[0]),
          date: 'Today'
        }])
      }

      setChatHistory(prev => [...prev, { role: 'ai', text: data.response }])
    } catch (error) {
      setChatHistory(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, something went wrong. Please try again!'
      }])
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Top Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">B</div>
          <span className="text-xl font-bold text-white">BizMind</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Welcome back!</span>
          <button
            onClick={() => window.location.href = '/'}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {['overview', 'ai chat', 'transactions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-gray-400 text-sm mb-2">Total Sales Today</div>
                <div className="text-3xl font-bold text-green-400">${totalSales}</div>
                <div className="text-gray-600 text-xs mt-2">From {transactions.filter(t => t.type === 'sale').length} transactions</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-gray-400 text-sm mb-2">Total Expenses Today</div>
                <div className="text-3xl font-bold text-red-400">${totalExpenses}</div>
                <div className="text-gray-600 text-xs mt-2">From {transactions.filter(t => t.type === 'expense').length} expenses</div>
              </div>
              <div className={`border rounded-2xl p-6 ${netProfit >= 0 ? 'bg-purple-950 border-purple-800' : 'bg-red-950 border-red-800'}`}>
                <div className="text-gray-400 text-sm mb-2">Net Profit Today</div>
                <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-purple-300' : 'text-red-300'}`}>${netProfit}</div>
                <div className="text-gray-600 text-xs mt-2">{netProfit >= 0 ? '🟢 Profitable day!' : '🔴 Review expenses'}</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: '💰', label: 'Add Sale', action: () => setActiveTab('ai chat') },
                  { icon: '📦', label: 'Add Expense', action: () => setActiveTab('ai chat') },
                  { icon: '👥', label: 'Customers', action: () => window.location.href = '/customers' },
                  { icon: '📊', label: 'Reports', action: () => setActiveTab('transactions') },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-center transition-colors"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-white text-sm font-medium">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {transactions.slice(-3).reverse().map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${t.type === 'sale' ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'}`}>
                        {t.type === 'sale' ? '↑' : '↓'}
                      </div>
                      <div>
                        <div className="text-white text-sm">{t.description}</div>
                        <div className="text-gray-500 text-xs">{t.date}</div>
                      </div>
                    </div>
                    <div className={`font-semibold ${t.type === 'sale' ? 'text-green-400' : 'text-red-400'}`}>
                      {t.type === 'sale' ? '+' : '-'}${t.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === 'ai chat' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">🤖</div>
              <div>
                <div className="text-white font-medium">BizMind AI</div>
                <div className="text-green-400 text-xs">● Online — Powered by Claude AI</div>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-200 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex gap-3">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Tell me your sales, expenses... e.g. Sold $500 today"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-white font-semibold">All Transactions</h3>
              <div className="flex gap-4 text-sm">
                <span className="text-green-400">Sales: ${totalSales}</span>
                <span className="text-red-400">Expenses: ${totalExpenses}</span>
                <span className="text-purple-400">Profit: ${netProfit}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No transactions yet. Use AI Chat to add your sales and expenses!</div>
              ) : (
                [...transactions].reverse().map((t, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'sale' ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'}`}>
                        {t.type === 'sale' ? '💰' : '📦'}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium capitalize">{t.type}</div>
                        <div className="text-gray-500 text-xs">{t.description}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${t.type === 'sale' ? 'text-green-400' : 'text-red-400'}`}>
                      {t.type === 'sale' ? '+' : '-'}${t.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}