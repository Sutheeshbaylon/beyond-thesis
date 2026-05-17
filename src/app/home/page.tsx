import Link from 'next/link'
import QuoteForm from '@/components/home/quote-form'

const STAGES = [
  {
    number: '01',
    emoji: '📊',
    title: 'Results & Analysis',
    desc: 'Statistical analysis, tables, figures, and interpretation — delivered first so your guide sees early progress.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    number: '02',
    emoji: '📖',
    title: 'Introduction, Review & Methods',
    desc: 'Literature review, aims & objectives, and methodology written to perfectly align with your Results chapter.',
    color: 'from-teal-600 to-teal-700',
  },
  {
    number: '03',
    emoji: '🎓',
    title: 'Discussion, Conclusion & Final',
    desc: 'Full discussion, conclusion, references, and final compiled thesis — ready for your guide and submission.',
    color: 'from-teal-700 to-teal-800',
  },
]

const TIERS = [
  {
    name: 'Standard',
    price: '₹16,000',
    tag: null,
    features: ['All 3 stages delivered', 'Up to 2 correction rounds', 'Turnaround in ~3 weeks', 'Email support'],
    highlight: false,
  },
  {
    name: 'Special',
    price: '₹15,000',
    tag: 'Most Popular',
    features: ['All 3 stages delivered', 'Up to 3 correction rounds', 'Priority turnaround', 'WhatsApp support'],
    highlight: true,
  },
  {
    name: 'Super',
    price: '₹12,500',
    tag: 'Best Value',
    features: ['All 3 stages delivered', 'Unlimited corrections', 'Fastest turnaround', 'Dedicated support'],
    highlight: false,
  },
]

const WHY_US = [
  {
    icon: '🖥️',
    title: 'Your own tracking portal',
    desc: 'Log in anytime to see exactly what\'s done, download approved chapters, and raise queries — no more "bro I\'ll send it tonight".',
  },
  {
    icon: '📦',
    title: 'Stage-by-stage delivery',
    desc: 'We deliver in 3 structured stages so your guide can review and approve each part before we move forward.',
  },
  {
    icon: '💰',
    title: 'Fixed, transparent pricing',
    desc: 'No hidden costs. No "extra charges later." You see the price upfront and pay in two simple instalments.',
  },
  {
    icon: '✅',
    title: 'Guide-ready from day one',
    desc: 'Every chapter formatted, referenced, and written to Indian medical university standards. Your guide won\'t ask for rewrites.',
  },
]

const SPECIALTIES = [
  'General Medicine', 'General Surgery', 'Obstetrics & Gynaecology', 'Paediatrics',
  'Orthopaedics', 'Anaesthesia', 'Radiology', 'Dermatology', 'Ophthalmology',
  'ENT', 'Psychiatry', 'Cardiology', 'Neurology', 'Nephrology', 'Gastroenterology',
  'Pulmonology', 'Endocrinology', 'Oncology', 'Pathology', 'Microbiology',
  'Community Medicine', 'Forensic Medicine',
]

const STATS = [
  { value: '22+', label: 'PG specialties covered' },
  { value: '3', label: 'Structured delivery stages' },
  { value: '100%', label: 'Guide-ready output' },
  { value: '< 24h', label: 'Query response time' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-700 to-teal-500 flex items-center justify-center text-white font-bold text-sm">BT</div>
            <span className="font-bold text-teal-800 text-lg tracking-tight">Beyond Thesis</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block transition-colors">Pricing</a>
            <a href="#specialties" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block transition-colors">Specialties</a>
            <a href="#quote"
              className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
              Get a free quote
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-600 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-300 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-8 text-teal-100">
            🩺 Trusted by postgraduate medical doctors across India
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-4xl mx-auto">
            Your patients need you.
            <span className="block text-teal-300 mt-1">Your thesis needs us.</span>
          </h1>

          <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Complete PG thesis assistance — delivered in 3 structured stages with a personal tracking portal.
            No more chasing. No more uncertainty. Just results.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#quote"
              className="px-8 py-4 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-lg text-base">
              Get a free quote →
            </a>
            <a href="#how-it-works"
              className="px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-base">
              See how it works
            </a>
          </div>

          {/* Pain point callout */}
          <div className="mt-14 max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5">
            <p className="text-sm text-teal-200 mb-1 font-medium">Sound familiar?</p>
            <p className="text-white font-semibold text-base">
              "I paid ₹40,000 to someone and they kept delaying. I had no idea where my thesis was."
            </p>
            <p className="text-teal-300 text-sm mt-2">
              With Beyond Thesis, you log in and see exactly what's done — every file, every stage, every approval.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className="bg-teal-50 border-y border-teal-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(item => (
              <div key={item.label}>
                <div className="text-3xl font-extrabold text-teal-700">{item.value}</div>
                <div className="text-sm text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Our process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">Three stages. One complete thesis.</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base">
            We deliver your thesis in a logical sequence — so your guide can review and approve each part before we move forward.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STAGES.map((stage, i) => (
            <div key={stage.number} className="relative group">
              {i < STAGES.length - 1 && (
                <div className="hidden sm:block absolute top-10 -right-3 z-10 text-teal-300 text-2xl font-bold">→</div>
              )}
              <div className={`h-full bg-gradient-to-br ${stage.color} text-white rounded-2xl p-7 shadow-lg`}>
                <div className="text-4xl mb-3">{stage.emoji}</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Stage {stage.number}</div>
                <h3 className="font-bold text-lg mb-3 leading-snug">{stage.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Portal callout */}
        <div className="mt-10 bg-gradient-to-r from-teal-800 to-teal-600 text-white rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6 shadow-xl">
          <div className="text-4xl shrink-0">🖥️</div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2">Track every step in your personal portal</h3>
            <p className="text-teal-100 text-sm leading-relaxed">
              Your dedicated portal shows every deliverable, payment, and approval in real time. Download chapters the moment they're approved. Raise queries with one click. No more WhatsApp chasing.
            </p>
          </div>
          <a href="#quote" className="shrink-0 px-6 py-3 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors whitespace-nowrap shadow-md">
            Get started →
          </a>
        </div>
      </section>

      {/* ── Why Beyond Thesis ────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Why us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">Not just another thesis service.</h2>
            <p className="text-gray-500 max-w-lg mx-auto">We built the transparency and structure that every other service is missing.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {WHY_US.map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">Simple, transparent pricing.</h2>
          <p className="text-gray-500">All tiers include the complete 3-stage thesis. Choose the level of support you need.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {TIERS.map(tier => (
            <div key={tier.name}
              className={`relative rounded-2xl border-2 p-7 flex flex-col transition-all ${
                tier.highlight
                  ? 'border-teal-500 bg-gradient-to-b from-teal-700 to-teal-800 text-white shadow-2xl scale-105'
                  : 'border-gray-200 bg-white text-gray-900 shadow-sm'
              }`}>
              {tier.tag && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap shadow-md ${
                    tier.highlight ? 'bg-teal-400 text-teal-900' : 'bg-gray-800 text-white'
                  }`}>
                    {tier.tag}
                  </span>
                </div>
              )}
              <div className="mb-6">
                <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${tier.highlight ? 'text-teal-300' : 'text-gray-400'}`}>
                  {tier.name}
                </div>
                <div className={`text-4xl font-extrabold ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price}
                </div>
                <div className={`text-xs mt-1 ${tier.highlight ? 'text-teal-300' : 'text-gray-400'}`}>one-time · paid in 2 instalments</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map(f => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${tier.highlight ? 'text-teal-100' : 'text-gray-600'}`}>
                    <span className={`shrink-0 mt-0.5 font-bold text-base ${tier.highlight ? 'text-teal-300' : 'text-teal-600'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#quote"
                className={`block text-center py-3 rounded-xl text-sm font-bold transition-colors ${
                  tier.highlight
                    ? 'bg-white text-teal-800 hover:bg-teal-50 shadow-lg'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}>
                Get a quote
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          Need a custom package or have a large sample size? Mention it in the quote form — we'll work something out.
        </p>
      </section>

      {/* ── Specialties ──────────────────────────────────────────── */}
      <section id="specialties" className="bg-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-white/15 text-teal-200 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Coverage</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Every major PG specialty. Covered.</h2>
            <p className="text-teal-300 max-w-lg mx-auto">We've delivered theses across every branch of clinical and non-clinical postgraduate medicine.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {SPECIALTIES.map(s => (
              <span key={s} className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-full hover:bg-white/20 transition-colors">
                {s}
              </span>
            ))}
            <span className="px-4 py-2 bg-teal-600 border border-teal-500 text-white text-sm rounded-full font-medium">
              + Others
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Stop worrying about your thesis.<br className="hidden sm:block" /> Start focusing on your patients.
          </h2>
          <p className="text-teal-100 mb-8 text-lg">Get a free quote in under 2 minutes. No commitment required.</p>
          <a href="#quote"
            className="inline-block px-10 py-4 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-xl text-lg">
            Get my free quote →
          </a>
        </div>
      </section>

      {/* ── Quote form ───────────────────────────────────────────── */}
      <section id="quote" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Free quote</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-gray-900">Let's get your thesis done.</h2>
            <p className="text-gray-500">
              Fill in your details and we'll reach out within 24 hours with pricing and timelines tailored to your specialty.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-7 sm:p-10">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm">BT</div>
                <span className="font-bold text-white text-lg">Beyond Thesis</span>
              </div>
              <div className="text-sm text-teal-300 max-w-xs">
                Stage-by-stage PG thesis assistance for medical postgraduates across India.
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm text-teal-300">
              <a href="mailto:drshorafbaylon@gmail.com" className="hover:text-white transition-colors">📧 drshorafbaylon@gmail.com</a>
              <Link href="/" className="hover:text-white transition-colors">🔐 Client portal login</Link>
              <a href="#quote" className="hover:text-white transition-colors">💬 Get a free quote</a>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-xs text-teal-500 text-center">
            © {new Date().getFullYear()} Beyond Thesis. All rights reserved. · Thesis assistance for PG medical students in India.
          </div>
        </div>
      </footer>

    </div>
  )
}
