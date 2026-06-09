'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const steps = [
  {
    id: 'business_type',
    title: 'What type of business do you run?',
    subtitle: 'Choose the option that best describes your business',
    type: 'single',
    options: [
      { value: 'grocery', label: 'Grocery / Kirana', icon: '🛒' },
      { value: 'restaurant', label: 'Restaurant / Food', icon: '🍽️' },
      { value: 'salon', label: 'Salon / Beauty', icon: '💇' },
      { value: 'gym', label: 'Gym / Fitness', icon: '💪' },
      { value: 'pharmacy', label: 'Pharmacy / Medical', icon: '💊' },
      { value: 'clothing', label: 'Clothing / Fashion', icon: '👗' },
      { value: 'electronics', label: 'Electronics', icon: '📱' },
      { value: 'freelancer', label: 'Freelancer / Consultant', icon: '💻' },
      { value: 'retail', label: 'Retail / General Store', icon: '🏪' },
      { value: 'other', label: 'Other Business', icon: '🏢' },
    ]
  },
  {
    id: 'business_size',
    title: 'How big is your team?',
    subtitle: 'Including yourself',
    type: 'single',
    options: [
      { value: 'solo', label: 'Just me', icon: '🙋', desc: 'Solo entrepreneur' },
      { value: 'small', label: '2–5 people', icon: '👥', desc: 'Small team' },
      { value: 'medium', label: '6–20 people', icon: '🏢', desc: 'Growing business' },
      { value: 'large', label: '20+ people', icon: '🏭', desc: 'Established business' },
    ]
  },
  {
    id: 'challenges',
    title: 'What are your biggest challenges?',
    subtitle: 'Select up to 2 — BizMind will focus on solving these first',
    type: 'multi',
    max: 2,
    options: [
      { value: 'sales_tracking', label: 'Tracking daily sales', icon: '📊' },
      { value: 'customer_management', label: 'Managing customers', icon: '👥' },
      { value: 'stock_management', label: 'Stock and inventory', icon: '📦' },
      { value: 'cash_flow', label: 'Cash flow and profits', icon: '💰' },
      { value: 'invoicing', label: 'Invoicing and billing', icon: '🧾' },
      { value: 'tax', label: 'Tax and accounting', icon: '📋' },
    ]
  },
  {
    id: 'billing_method',
    title: 'How do you currently create bills?',
    subtitle: 'This helps BizMind set up the right data entry method for you',
    type: 'single',
    options: [
      { value: 'handwritten', label: 'I write bills by hand', icon: '✍️', desc: 'Manual paper bills' },
      { value: 'machine', label: 'I use a billing machine', icon: '🖨️', desc: 'POS or receipt printer' },
      { value: 'software', label: 'I use software', icon: '💻', desc: 'Tally, Zoho, QuickBooks' },
      { value: 'no_bills', label: 'I do not create bills', icon: '🤷', desc: 'Cash only business' },
    ]
  },
  {
    id: 'language',
    title: 'What is your preferred language?',
    subtitle: 'BizMind will communicate with you in this language',
    type: 'single',
    options: [
      { value: 'en', label: 'English', icon: '🇺🇸' },
      { value: 'hi', label: 'Hindi', icon: '🇮🇳' },
      { value: 'te', label: 'Telugu', icon: '🇮🇳' },
      { value: 'es', label: 'Spanish', icon: '🇪🇸' },
      { value: 'ar', label: 'Arabic', icon: '🇸🇦' },
      { value: 'pt', label: 'Portuguese', icon: '🇧🇷' },
      { value: 'fr', label: 'French', icon: '🇫🇷' },
      { value: 'de', label: 'German', icon: '🇩🇪' },
    ]
  },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [businessName, setBusinessName] = useState('')
  const [dailyRevenue, setDailyRevenue] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const step = steps[currentStep]
  const progress = (currentStep / steps.length) * 100

  const selectOption = (value: string) => {
    if (!step) return
    if (step.type === 'single') {
      setAnswers(prev => ({ ...prev, [step.id]: value }))
    } else {
      const current = answers[step.id] || []
      const max = (step as any).max || 99
      if (current.includes(value)) {
        setAnswers(prev => ({ ...prev, [step.id]: current.filter((v: string) => v !== value) }))
      } else if (current.length < max) {
        setAnswers(prev => ({ ...prev, [step.id]: [...current, value] }))
      }
    }
  }

  const isSelected = (value: string) => {
    if (!step) return false
    const answer = answers[step.id]
    if (!answer) return false
    if (Array.isArray(answer)) return answer.includes(value)
    return answer === value
  }

  const canContinue = () => {
    if (currentStep === steps.length) return businessName.trim().length > 0
    const answer = answers[step.id]
    if (!answer) return false
    if (Array.isArray(answer)) return answer.length > 0
    return true
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          business_name: businessName,
          business_type: answers.business_type,
          owner_name: user.user_metadata?.full_name || '',
          language: answers.language || 'en',
          daily_revenue_estimate: parseFloat(dailyRevenue) || 0,
          billing_method: answers.billing_method,
        })
      }
    } catch (e) {
      console.error(e)
    }
    setDone(true)
    setLoading(false)
    setTimeout(() => { window.location.href = '/dashboard' }, 2500)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-3">BizMind is ready for you!</h1>
          <p className="text-gray-400 mb-6">Setting up your personalised dashboard...</p>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'0.15s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'0.3s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">B</div>
          <span className="text-white font-bold text-lg">BizMind</span>
        </div>
        <span className="text-gray-500 text-sm">
          Step {currentStep + 1} of {steps.length + 1}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-purple-600 transition-all duration-500"
          style={{width: `${progress}%`}}
        ></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">

          {/* Question steps */}
          {currentStep < steps.length && (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                {step.title}
              </h1>
              <p className="text-gray-400 text-center mb-8">{step.subtitle}</p>

              <div className={`grid gap-3 mb-8 ${
                step.options.length > 4
                  ? 'grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2'
              }`}>
                {step.options.map((opt: any) => (
                  <button
                    key={opt.value}
                    onClick={() => selectOption(opt.value)}
                    className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
                      isSelected(opt.value)
                        ? 'bg-purple-950 border-purple-500 shadow-lg shadow-purple-950/50'
                        : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{opt.icon}</div>
                    <div className={`font-medium text-sm ${
                      isSelected(opt.value) ? 'text-purple-200' : 'text-white'
                    }`}>
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div className="text-gray-500 text-xs mt-1">{opt.desc}</div>
                    )}
                    {isSelected(opt.value) && (
                      <div className="text-purple-400 text-xs mt-2 font-medium">✓ Selected</div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canContinue()}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold text-lg transition-all"
              >
                Continue →
              </button>
            </>
          )}

          {/* Final step */}
          {currentStep === steps.length && (
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🏪</div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Almost done!
                </h1>
                <p className="text-gray-400">Tell us your business name to personalise BizMind</p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Business name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Raju General Store"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Approximate daily revenue <span className="text-gray-600">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={dailyRevenue}
                    onChange={e => setDailyRevenue(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <p className="text-gray-600 text-xs mt-1">
                    Used to detect unusual transactions. You can skip this.
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinish}
                disabled={loading || !businessName.trim()}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold text-lg transition-all"
              >
                {loading ? 'Setting up your dashboard...' : '🚀 Launch My BizMind Dashboard'}
              </button>
            </>
          )}

          {/* Back button */}
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="w-full mt-4 text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors"
            >
              ← Go back
            </button>
          )}

        </div>
      </div>

    </div>
  )
}