export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">B</div>
            <span className="text-xl font-bold text-white">BizMind</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#howitworks" className="text-gray-400 hover:text-white text-sm transition-colors">How it works</a>
            <a href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
          </div>
          <a href="https://tally.so/r/vGzxJd" target="_blank" rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
            Get Started Free
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-950 border border-purple-800 rounded-full px-4 py-1.5 text-purple-300 text-sm mb-8">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse inline-block"></span>
            Now available worldwide — 10 languages supported
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your AI <span className="text-purple-400">Business</span><br />Partner
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track sales, customers, stock and profits automatically.
            No complicated software. No accountant needed. Just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://tally.so/r/vGzxJd" target="_blank" rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105">
              Start Free — No Credit Card
            </a>
            <a href="#features"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-4 rounded-full text-lg font-medium transition-colors">
              See Features
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-600">Trusted by business owners in 10+ countries</p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-3xl font-bold text-white mb-1">500M+</div><div className="text-gray-500 text-sm">Small businesses globally</div></div>
          <div><div className="text-3xl font-bold text-white mb-1">10</div><div className="text-gray-500 text-sm">Languages supported</div></div>
          <div><div className="text-3xl font-bold text-purple-400 mb-1">$15</div><div className="text-gray-500 text-sm">Starting per month</div></div>
          <div><div className="text-3xl font-bold text-white mb-1">2 min</div><div className="text-gray-500 text-sm">Daily time needed</div></div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything your business needs</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">BizMind replaces your notebook, spreadsheet, and accountant — all in one AI-powered tool.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "📸", title: "Bill Photo Scanner", desc: "Snap any bill — handwritten or printed. AI reads it and records everything. Zero typing needed." },
              { icon: "📊", title: "Daily Profit Reports", desc: "Every evening, get a clear summary of earnings, expenses and net profit automatically." },
              { icon: "👥", title: "Customer Tracker", desc: "Remember every customer, what they bought, and what they owe. Never lose track of money again." },
              { icon: "📦", title: "Smart Stock Alerts", desc: "BizMind warns you before stock runs out so you never miss a sale due to empty shelves." },
              { icon: "🌍", title: "10 Languages", desc: "English, Hindi, Telugu, Spanish, Arabic, Portuguese, French, German, Indonesian and more." },
              { icon: "🤖", title: "AI Business Advisor", desc: "Spots your peak days, top customers, and tells you exactly how to grow your profits." },
            ].map((f, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-700 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="howitworks" className="py-24 px-6 bg-gray-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How BizMind works</h2>
            <p className="text-gray-400 text-lg">Up and running in under 5 minutes</p>
          </div>
          <div className="space-y-8">
            {[
              { step: "01", title: "Tell us about your business", desc: "BizMind asks friendly questions — type, size, language. 2 minutes. No boring forms." },
              { step: "02", title: "Add your daily data easily", desc: "Type, speak, or photograph your bills. BizMind understands natural language — just talk to it." },
              { step: "03", title: "Get insights automatically", desc: "Daily profit summaries, smart alerts, and AI advice. Watch your business grow with clarity." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="text-5xl font-bold text-purple-900 flex-shrink-0 w-16">{item.step}</div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex-1">
                  <h3 className="text-white font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, honest pricing</h2>
            <p className="text-gray-400 text-lg">Start free. Upgrade when ready. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {[
              { name: "Starter", price: "$15", desc: "For solo freelancers and small shops", features: ["100 customers", "Daily profit reports", "Bill photo scanner", "English language", "Email support"], popular: false },
              { name: "Pro", price: "$29", desc: "Most popular for growing businesses", features: ["Unlimited customers", "All 10 languages", "Voice data entry", "AI business advisor", "Peak day analysis", "Priority support"], popular: true },
              { name: "Business", price: "$49", desc: "For established teams and businesses", features: ["Everything in Pro", "3 team members", "Multiple locations", "Shareable PDF reports", "Business health score", "Dedicated support"], popular: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-6 border ${plan.popular ? "bg-purple-950 border-purple-600 scale-105 shadow-xl shadow-purple-950" : "bg-gray-900 border-gray-800"}`}>
                {plan.popular && <div className="text-purple-300 text-xs font-semibold uppercase tracking-widest mb-3">⭐ Most Popular</div>}
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 mb-1">/month</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-purple-400 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="https://tally.so/r/vGzxJd" target="_blank" rel="noopener noreferrer"
                  className={`block text-center py-3 rounded-full font-medium transition-colors ${plan.popular ? "bg-purple-500 hover:bg-purple-400 text-white" : "border border-gray-700 hover:border-purple-600 text-gray-300"}`}>
                  Get Started Free
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8 text-sm">All plans include a 30-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-950 to-gray-900 border border-purple-800 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to grow your business?</h2>
            <p className="text-gray-400 text-lg mb-8">Join business owners worldwide using BizMind to track, manage, and grow — effortlessly.</p>
            <a href="https://tally.so/r/vGzxJd" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105">
              Start Free Today
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">B</div>
            <span className="text-white font-semibold">BizMind</span>
            <span className="text-gray-600 text-sm ml-2">— Your AI Business Partner</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-300 transition-colors">Pricing</a>
            <a href="https://tally.so/r/vGzxJd" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Get Early Access</a>
          </div>
          <p className="text-gray-600 text-sm">© 2026 BizMind. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}