import Link from 'next/link'
import QuoteForm from '@/components/home/quote-form'

const WA_LINK = 'https://wa.me/919361863876'

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

const PRICING_FEATURES = [
  'Complete 3-stage thesis delivery',
  'Unlimited corrections — no extra charges',
  'Personal client tracking portal',
  'Guide-ready formatting & referencing',
  'WhatsApp support throughout',
  'Dedicated writer + stats team',
  'Paid in 2 simple instalments',
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

const PORTAL_FEATURES = [
  { icon: '📁', text: 'Download approved chapters the moment they\'re ready' },
  { icon: '📊', text: 'See your thesis progress stage by stage, in real time' },
  { icon: '✏️', text: 'Raise correction requests with one click — no WhatsApp needed' },
  { icon: '💬', text: 'Message your thesis team directly through the portal' },
  { icon: '💳', text: 'Submit and track payments securely' },
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

      {/* ── Floating WhatsApp button ─────────────────────────────── */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="text-sm font-semibold hidden sm:block">Chat on WhatsApp</span>
      </a>

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
            <Link href="/login" className="text-sm text-teal-700 font-medium hover:text-teal-900 hidden sm:block transition-colors">Client login</Link>
            <a href="#quote" className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
              Get a free quote
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-600 text-white overflow-hidden">
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
            <a href="#quote" className="px-8 py-4 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-lg text-base">
              Get a free quote →
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-base flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp us
            </a>
          </div>

          {/* Pain point callout */}
          <div className="mt-14 max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5">
            <p className="text-sm text-teal-200 mb-1 font-medium">Sound familiar?</p>
            <p className="text-white font-semibold text-base">
              "I paid ₹40,000 to someone and they kept delaying. I had no idea where my thesis was."
            </p>
            <p className="text-teal-300 text-sm mt-2">
              With Beyond Thesis, you log in and see exactly what&apos;s done — every file, every stage, every approval.
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

      {/* ── Client portal trust section ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-gradient-to-br from-teal-900 to-teal-700 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left — copy */}
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-white/15 text-teal-200 text-xs font-semibold rounded-full uppercase tracking-wide mb-4">Client portal</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                You always know<br className="hidden sm:block" /> where your thesis is.
              </h2>
              <p className="text-teal-200 text-base mb-8 leading-relaxed">
                Every client gets a private login. No more calling. No more waiting for updates.
                Log in from your phone and see exactly what&apos;s done — 24/7.
              </p>
              <ul className="space-y-3 mb-8">
                {PORTAL_FEATURES.map((f) => (
                  <li key={f.text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{f.icon}</span>
                    <span className="text-teal-100 text-sm leading-relaxed">{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-lg self-start"
              >
                🔐 Client portal login
              </Link>
            </div>

            {/* Right — visual mockup */}
            <div className="p-8 sm:p-12 flex items-center justify-center">
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Mock header */}
                <div className="bg-teal-800 px-4 py-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-teal-500 flex items-center justify-center text-white text-xs font-bold">BT</div>
                  <span className="text-white text-xs font-semibold">Beyond Thesis — Client Portal</span>
                </div>
                {/* Mock project */}
                <div className="p-4 border-b border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Your project</p>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">Effect of HbA1c on surgical outcomes in diabetic patients</p>
                  <p className="text-xs text-gray-400 mt-0.5">General Surgery · Stage 2</p>
                </div>
                {/* Mock stage progress */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    {[1,2,3].map((s) => (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s < 2 ? 'bg-teal-600 text-white' : s === 2 ? 'bg-teal-100 text-teal-700 border-2 border-teal-500' : 'bg-gray-100 text-gray-400'}`}>
                          {s < 2 ? '✓' : s}
                        </div>
                        {s < 3 && <div className={`flex-1 h-0.5 mx-1 ${s < 2 ? 'bg-teal-500' : 'bg-gray-200'}`} />}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-teal-600 font-medium">Stage 2 in progress — 47% complete</p>
                </div>
                {/* Mock files */}
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Ready to download</p>
                  {['Master Dataset', 'Tables', 'Results Chapter'].map((f) => (
                    <div key={f} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-700 flex items-center gap-1.5">📄 {f}</span>
                      <span className="text-xs px-2 py-0.5 bg-teal-600 text-white rounded font-medium">Download</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Our process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">Three stages. One complete thesis.</h2>
            <p className="text-gray-500 max-w-lg mx-auto text-base">
              We deliver in a logical sequence — so your guide can review and approve each part before we move forward.
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
        </div>
      </section>

      {/* ── Why Beyond Thesis ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
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
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">Simple, transparent pricing.</h2>
            <p className="text-gray-500">One package. Everything included. Final price based on your specialty and sample size.</p>
          </div>

          <div className="bg-gradient-to-br from-teal-800 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-xs font-bold uppercase tracking-widest text-teal-300 mb-3">Complete thesis package</div>
              <div className="text-5xl sm:text-6xl font-extrabold text-white mb-2">
                ₹12,500 <span className="text-2xl text-teal-300 font-semibold">– ₹16,000</span>
              </div>
              <div className="text-teal-300 text-sm mt-2">One-time · Paid in 2 simple instalments · Final price on quote</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {PRICING_FEATURES.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <span className="text-teal-300 font-bold text-lg shrink-0">✓</span>
                  <span className="text-teal-100 text-sm leading-relaxed">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#quote"
                className="px-8 py-4 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-lg text-center text-base">
                Get a free quote →
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-center text-base flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Ask on WhatsApp
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Large sample size or complex design? Mention it in the quote form — we&apos;ll work something out.
          </p>
        </div>
      </section>

      {/* ── Specialties ──────────────────────────────────────────── */}
      <section id="specialties" className="bg-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-white/15 text-teal-200 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Coverage</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Every major PG specialty. Covered.</h2>
            <p className="text-teal-300 max-w-lg mx-auto">We&apos;ve delivered theses across every branch of clinical and non-clinical postgraduate medicine.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {SPECIALTIES.map(s => (
              <span key={s} className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-full hover:bg-white/20 transition-colors">
                {s}
              </span>
            ))}
            <span className="px-4 py-2 bg-teal-600 border border-teal-500 text-white text-sm rounded-full font-medium">+ Others</span>
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#quote" className="inline-block px-10 py-4 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-xl text-lg">
              Get my free quote →
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* ── Quote form ───────────────────────────────────────────── */}
      <section id="quote" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">Free quote</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-gray-900">Let&apos;s get your thesis done.</h2>
            <p className="text-gray-500">
              Fill in your details and we&apos;ll reach out within 24 hours with pricing and timelines tailored to your specialty.
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
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                +91 93618 63876
              </a>
              <Link href="/login" className="hover:text-white transition-colors">🔐 Client portal login</Link>
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
