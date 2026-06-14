'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Reports() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7')

  useEffect(() => {
    fetchTransactions()
  }, [period])

  const fetchTransactions = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(period))
    const dateStr = daysAgo.toISOString().split('T')[0]

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', dateStr)
      .order('date', { ascending: true })

    setTransactions(data || [])
    setLoading(false)
  }

  const grouped: Record<string, { date: string, sales: number, expenses: number, profit: number }> = {}
  transactions.forEach(t => {
    const d = t.date
    if (!grouped[d]) grouped[d] = { date: d, sales: 0, expenses: 0, profit: 0 }
    if (t.type === 'sale') grouped[d].sales += Number(t.amount)
    else grouped[d].expenses += Number(t.amount)
    grouped[d].profit = grouped[d].sales - grouped[d].expenses
  })
  const chartData = Object.values(grouped).map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

  const totalSales = transactions.filter(t => t.type === 'sale').reduce((a, t) => a + Number(t.amount), 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + Number(t.amount), 0)
  const totalProfit = totalSales - totalExpenses

  const pieData = [
    { name: 'Sales', value: totalSales, color: '#4ade80' },
    { name: 'Expenses', value: totalExpenses, color: '#f87171' },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">B</div>
          <span className="text-xl font-bold text-white">BizMind</span>
        </div>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
          ← Back to Dashboard
        </a>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Profit & Loss Reports</h1>
            <p className="text-gray-400 text-sm mt-1">Visualize your business performance over time</p>
          </div>
          <div className="flex gap-2">
            {[
              { value: '7', label: '7 Days' },
              { value: '30', label: '30 Days' },
              { value: '90', label: '90 Days' },
            ].map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${period === p.value ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="text-gray-400 text-sm mb-1">Total Sales</div>
            <div className="text-2xl font-bold text-green-400">${totalSales.toFixed(2)}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="text-gray-400 text-sm mb-1">Total Expenses</div>
            <div className="text-2xl font-bold text-red-400">${totalExpenses.toFixed(2)}</div>
          </div>
          <div className={`border rounded-2xl p-5 ${totalProfit >= 0 ? 'bg-purple-950 border-purple-800' : 'bg-red-950 border-red-800'}`}>
            <div className="text-gray-400 text-sm mb-1">Net Profit</div>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-purple-300' : 'text-red-300'}`}>${totalProfit.toFixed(2)}</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading your data...</div>
        ) : chartData.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-white font-medium mb-2">No data yet for this period</h3>
            <p className="text-gray-500 text-sm">Use AI Chat in the dashboard to record sales and expenses. Your charts will appear here!</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Profit Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="#a78bfa" strokeWidth={3} name="Profit" dot={{ fill: '#a78bfa' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Sales vs Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="sales" fill="#4ade80" name="Sales" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#f87171" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Overall Split</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

      </div>
    </div>
  )
}