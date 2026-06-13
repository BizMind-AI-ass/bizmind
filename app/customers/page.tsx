'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dueAmount, setDueAmount] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setCustomers(data || [])
    setLoading(false)
  }

  const addCustomer = async () => {
  if (!name.trim()) return
  setSaving(true)

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    alert('Not logged in! Error: ' + JSON.stringify(userError))
    setSaving(false)
    return
  }

  const { data, error } = await supabase.from('customers').insert({
    user_id: user.id,
    name: name.trim(),
    phone: phone.trim(),
    total_due: parseFloat(dueAmount) || 0,
    total_spent: 0,
    visit_count: 1,
  })

  if (error) {
    alert('Save failed: ' + error.message)
    setSaving(false)
    return
  }

  setName('')
  setPhone('')
  setDueAmount('')
  setShowAddForm(false)
  setSaving(false)
  fetchCustomers()
}

  const markAsPaid = async (id: string) => {
    await supabase.from('customers').update({ total_due: 0 }).eq('id', id)
    fetchCustomers()
  }

  const deleteCustomer = async (id: string) => {
    await supabase.from('customers').delete().eq('id', id)
    fetchCustomers()
  }

  const sendReminder = (customer: any) => {
    if (!customer.phone) {
      alert('Add a phone number for this customer first!')
      return
    }
    const message = encodeURIComponent(
      `Hi ${customer.name}! This is a friendly reminder that you have a pending amount of $${customer.total_due}. Thank you for your business! 🙏`
    )
    const phone = customer.phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const totalDue = customers.reduce((a, c) => a + (c.total_due || 0), 0)
  const totalSpent = customers.reduce((a, c) => a + (c.total_spent || 0), 0)

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Top Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">B</div>
          <span className="text-xl font-bold text-white">BizMind</span>
        </div>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
          ← Back to Dashboard
        </a>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Tracker</h1>
            <p className="text-gray-400 text-sm mt-1">Manage customers and track who owes you money</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            {showAddForm ? '✕ Cancel' : '+ Add Customer'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="text-gray-400 text-sm mb-1">Total Customers</div>
            <div className="text-2xl font-bold text-white">{customers.length}</div>
          </div>
          <div className="bg-red-950 border border-red-800 rounded-2xl p-5">
            <div className="text-gray-400 text-sm mb-1">Total Pending Dues</div>
            <div className="text-2xl font-bold text-red-300">${totalDue.toFixed(2)}</div>
          </div>
          <div className="bg-green-950 border border-green-800 rounded-2xl p-5">
            <div className="text-gray-400 text-sm mb-1">Total Lifetime Spent</div>
            <div className="text-2xl font-bold text-green-300">${totalSpent.toFixed(2)}</div>
          </div>
        </div>

        {/* Add Customer Form */}
        {showAddForm && (
          <div className="bg-gray-900 border border-purple-800 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Add New Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Customer Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramu Sharma"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Amount Due (if any)</label>
                <input
                  type="number"
                  value={dueAmount}
                  onChange={e => setDueAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
            </div>
            <button
              onClick={addCustomer}
              disabled={saving || !name.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              {saving ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        )}

        {/* Customer List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-white font-medium mb-2">No customers yet</h3>
              <p className="text-gray-500 text-sm">Add your first customer or tell BizMind AI about a customer in chat!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {customers.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-950 rounded-full flex items-center justify-center text-purple-300 font-semibold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{c.name}</div>
                      <div className="text-gray-500 text-xs">{c.phone || 'No phone number'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-gray-500 text-xs">Total Spent</div>
                      <div className="text-green-400 font-medium text-sm">${(c.total_spent || 0).toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 text-xs">Due</div>
                      <div className={`font-semibold text-sm ${c.total_due > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                        ${(c.total_due || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {c.total_due > 0 && (
                        <>
                          <button
                            onClick={() => sendReminder(c)}
                            title="Send WhatsApp reminder"
                            className="bg-green-950 hover:bg-green-900 text-green-400 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                          >
                            💬 Remind
                          </button>
                          <button
                            onClick={() => markAsPaid(c.id)}
                            title="Mark as paid"
                            className="bg-purple-950 hover:bg-purple-900 text-purple-300 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                          >
                            ✓ Paid
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteCustomer(c.id)}
                        title="Delete customer"
                        className="bg-gray-800 hover:bg-red-950 hover:text-red-400 text-gray-500 px-3 py-2 rounded-lg text-xs transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}