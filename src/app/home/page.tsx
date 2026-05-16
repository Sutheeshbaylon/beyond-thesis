import Link from 'next/link'
import QuoteForm from '@/components/home/quote-form'

const STAGES = [
  {
    number: '01',
    title: 'Results & Analysis',
    desc: 'Statistical analysis, tables, figures, and interpretation — delivered first so your guide sees early progress.',
  },
  {
    number: '02',
    title: 'Introduction, Review & Methodology',
    desc: 'Literature review, aims & objectives, and methodology written to align with your Results chapter.',
  },
  {
    number: '03',
    title: 'Discussion, Conclusion & Final',
    desc: 'Full discussion, conclusion, references, and final compiled thesis ready for submission.',
  },
]

const TIERS = [
  {
    name: 'Standard',
    price: '₹16,000',
    tag: null,
    features: ['All 3 stages delivered', 'Upto 2 correction rounds', 'Turnaround in ~3 weeks', 'Email support'],
  },
  {
    name: 'Special',
    price: '₹15,000',
    tag: 'Popular',
    features: ['All 3 stages delivered', 'Upto 3 correction rounds', 'Priority turnaround', 'WhatsApp support'],
  },
  {
    name: 'Super',
    price: '₹12,500',
    tag: 'Best value',
    features: ['All 3 stages delivered', 'Unlimited corrections', 'Fastest turnaround', 'Dedicated support'],
  },
]

const SPECIALTIES = [
  'General Medicine', 'General Surgery', 'Obstetrics & Gynaecology', 'Paediatrics',
  'Orthopaedics', 'Anaesthesia', 'Radiology', 'Dermatology', 'Ophthalmology',
  'ENT', 'Psychiatry', 'Cardiology', 'Neurology', 'Nephrology', 'Gastroenterology',
  'Pulmonology', 'Endocrinology', 'Oncology', 'Pathology', 'Microbiology',
  'Community Medicine', 'Forensic Medicine',
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-[#1A3A5C] text-lg tracking-tight">Beyond Thesis</span>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm text-[#666666] hover:text-[#1A1A1A] hidden sm:block">Pricing</a>
            <a href="#specialties" className="text-sm text-[#666666] hover:text-[#1A1A1A] hidden sm:block">Specialties</a>
            <a href="#quote"
              className="px-4 py-1.5 bg-[#1A3A5C] text-white text-sm font-medium rounded-md hover:bg-[#16324f] transition-colors">
              Get a quote
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F4F8] rounded-full text-xs font-medium text-[#1A3A5C] mb-6">
          Thesis assistance for postgraduate medical students
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight mb-4 max-w-3xl mx-auto">
          Never wonder where<br className="hidden sm:block" /> your thesis stands.
        </h1>
        <p className="text-lg text-[#666666] max-w-xl mx-auto mb-8">
          Stage-by-stage delivery with a dedicated portal — so you and your guide always know exactly what's done and what's next.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#quote"
            className="px-6 py-3 bg-[#1A3A5C] text-white font-medium rounded-md hover:bg-[#16324f] transition-colors">
            Get a free quote
          </a>
          <a href="#how-it-works"
            className="px-6 py-3 border border-[#E5E5E5] text-[#1A1A1A] font-medium rounded-md hover:border-[#CCCCCC] transition-colors">
            See how it works
          </a>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#E5E5E5] bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '22+', label: 'Specialties covered' },
              { value: '3', label: 'Structured stages' },
              { value: '100%', label: 'Guide-ready output' },
              { value: '24 hr', label: 'Support response' },
            ].map(item => (
              <div key={item.label}>
                <div className="text-2xl font-bold text-[#1A3A5C]">{item.value}</div>
                <div className="text-sm text-[#666666] mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Three stages. Full thesis.</h2>
          <p className="text-[#666666] max-w-lg mx-auto">
            We deliver your thesis in a logical sequence so your guide can review and approve each part before we move forward.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STAGES.map((stage, i) => (
            <div key={stage.number} className="relative border border-[#E5E5E5] rounded-xl p-6">
              {i < STAGES.length - 1 && (
                <div className="hidden sm:block absolute top-8 -right-3 z-10 text-[#CCCCCC] text-lg">→</div>
              )}
              <div className="text-3xl font-bold text-[#E5E5E5] mb-3">{stage.number}</div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">{stage.title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>

        {/* Portal callout */}
        <div className="mt-10 bg-[#F0F4F8] rounded-xl p-6 sm:p-8 border border-[#D6E4F0]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A3A5C] mb-1">Track everything in your personal portal</h3>
              <p className="text-sm text-[#666666]">
                Every deliverable, payment, and correction request lives in one place. Download approved chapters anytime and raise queries with a single click.
              </p>
            </div>
            <a href="#quote" className="shrink-0 px-5 py-2.5 bg-[#1A3A5C] text-white text-sm font-medium rounded-md hover:bg-[#16324f] transition-colors whitespace-nowrap">
              Get started
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#F8F9FA] border-y border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Simple, transparent pricing</h2>
            <p className="text-[#666666]">All tiers include the full 3-stage thesis. Pick the level of support you need.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {TIERS.map(tier => (
              <div key={tier.name}
                className={`relative rounded-xl border p-6 bg-white ${tier.tag === 'Popular' ? 'border-[#1A3A5C] shadow-md' : 'border-[#E5E5E5]'}`}>
                {tier.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-[#1A3A5C] text-white text-xs font-medium rounded-full whitespace-nowrap">
                      {tier.tag}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <div className="text-sm font-medium text-[#666666] mb-1">{tier.name}</div>
                  <div className="text-3xl font-bold text-[#1A1A1A]">{tier.price}</div>
                  <div className="text-xs text-[#666666] mt-1">one-time</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#444444]">
                      <span className="text-[#1A3A5C] font-bold shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#quote"
                  className={`block text-center py-2.5 rounded-md text-sm font-medium transition-colors ${tier.tag === 'Popular'
                    ? 'bg-[#1A3A5C] text-white hover:bg-[#16324f]'
                    : 'border border-[#1A3A5C] text-[#1A3A5C] hover:bg-[#F0F4F8]'}`}>
                  Get a quote
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#999999] mt-6">
            Need a custom package? Mention it in the quote form below.
          </p>
        </div>
      </section>

      {/* Specialties */}
      <section id="specialties" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">All major PG specialties</h2>
          <p className="text-[#666666]">We've worked across every branch of clinical and non-clinical postgraduate medicine.</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {SPECIALTIES.map(s => (
            <span key={s} className="px-3 py-1.5 bg-[#F0F4F8] border border-[#D6E4F0] text-[#1A3A5C] text-sm rounded-full">
              {s}
            </span>
          ))}
          <span className="px-3 py-1.5 bg-[#F0F4F8] border border-[#D6E4F0] text-[#666666] text-sm rounded-full">
            + Others
          </span>
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="bg-[#F8F9FA] border-y border-[#E5E5E5]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Get a free quote</h2>
            <p className="text-[#666666]">
              Fill in your details and we'll get back to you within 24 hours with pricing and timelines.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-8">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="font-bold text-[#1A3A5C] mb-1">Beyond Thesis</div>
              <div className="text-sm text-[#666666]">Thesis assistance for postgraduate medical students in India.</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-[#666666]">
              <a href="mailto:drshorafbaylon@gmail.com" className="hover:text-[#1A1A1A]">Contact</a>
              <span className="hidden sm:inline text-[#E5E5E5]">|</span>
              <Link href="/" className="hover:text-[#1A1A1A]">Client login</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[#E5E5E5] text-xs text-[#999999] text-center">
            © {new Date().getFullYear()} Beyond Thesis. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
