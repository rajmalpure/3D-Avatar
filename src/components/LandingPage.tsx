import { useEffect, useState } from 'react'
import '../landing.css'

type Props = { onGetStarted: () => void; onLogin: () => void }

function GridVisualization() {
  const leftPts = "10,195 160,65 310,195 160,325"
  const rightPts = "290,195 440,65 590,195 440,325"
  const hLines = [85,105,125,145,165,185,205,225,245,265,285,305]
  const diagLines = [-200,-160,-120,-80,-40,0,40,80,120,160,200,240,280,320]
  return (
    <svg viewBox="0 0 600 390" width="100%" height="100%" style={{overflow:'visible'}}>
      <defs>
        <clipPath id="cl"><polygon points={leftPts}/></clipPath>
        <clipPath id="cr"><polygon points={rightPts}/></clipPath>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
          <stop offset="25%" stopColor="#c4b5fd" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="lFill" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#0d0b2e" stopOpacity="0.95"/>
        </radialGradient>
        <radialGradient id="rFill" cx="30%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#2d1b69" stopOpacity="0.95"/>
        </radialGradient>
        <filter id="gblur"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <ellipse cx="300" cy="195" rx="70" ry="70" fill="url(#glow)" filter="url(#gblur)" opacity="0.8"/>
      <polygon points={leftPts} fill="url(#lFill)" stroke="rgba(100,120,255,0.45)" strokeWidth="0.8"/>
      <g clipPath="url(#cl)" stroke="rgba(100,130,255,0.18)" strokeWidth="0.7" fill="none">
        {hLines.map(y => <line key={y} x1="-20" y1={y} x2="320" y2={y}/>)}
        {diagLines.map(b => <line key={b} x1="-20" y1={-20*0.89+b} x2="320" y2={320*0.89+b}/>)}
        {diagLines.map(b => <line key={'n'+b} x1="-20" y1={20*0.89+b} x2="320" y2={-320*0.89+b}/>)}
      </g>
      <polygon points={leftPts} fill="none" stroke="rgba(130,140,255,0.55)" strokeWidth="1"/>
      <polygon points={rightPts} fill="url(#rFill)" stroke="rgba(160,100,255,0.5)" strokeWidth="0.8"/>
      <g clipPath="url(#cr)" stroke="rgba(160,100,255,0.2)" strokeWidth="0.7" fill="none">
        {hLines.map(y => <line key={y} x1="280" y1={y} x2="610" y2={y}/>)}
        {diagLines.map(b => <line key={b} x1="280" y1={-280*0.89+b+250} x2="610" y2={610*0.89+b-250}/>)}
        {diagLines.map(b => <line key={'n'+b} x1="280" y1={280*0.89+b-250} x2="610" y2={-610*0.89+b+550}/>)}
      </g>
      <polygon points={rightPts} fill="none" stroke="rgba(167,139,250,0.65)" strokeWidth="1"/>
      <circle cx="300" cy="195" r="14" fill="url(#glow)" opacity="1"/>
      <circle cx="300" cy="195" r="5" fill="white" opacity="0.9"/>
      <text x="155" y="190" fill="white" fontSize="17" fontWeight="700" fontStyle="italic" textAnchor="middle">Practice</text>
      <text x="435" y="148" fill="white" fontSize="13" fontWeight="700" fontStyle="italic" textAnchor="middle">Evaluate</text>
      <text x="435" y="245" fill="rgba(255,255,255,0.9)" fontSize="13" fontWeight="700" fontStyle="italic" textAnchor="middle">Improve</text>
      <text x="25" y="170" fill="rgba(255,255,255,0.45)" fontSize="8" letterSpacing="1.5" textAnchor="middle">YOUR</text>
      <text x="25" y="182" fill="rgba(255,255,255,0.45)" fontSize="8" letterSpacing="1.5" textAnchor="middle">ANSWERS</text>
      <circle cx="25" cy="162" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
      <text x="572" y="170" fill="rgba(255,255,255,0.45)" fontSize="7" letterSpacing="1" textAnchor="middle">HIGH</text>
      <text x="572" y="181" fill="rgba(255,255,255,0.45)" fontSize="7" letterSpacing="1" textAnchor="middle">QUALITY</text>
      <text x="572" y="192" fill="rgba(255,255,255,0.45)" fontSize="7" letterSpacing="1" textAnchor="middle">FEEDBACK</text>
      {[[38,110],[52,140],[18,160],[44,220],[30,260],[58,290],[20,195],[45,175]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={4+i%3*2} fill={`rgba(20,20,60,${0.7+i*0.03})`} stroke="rgba(80,100,200,0.3)" strokeWidth="0.5"/>
      ))}
      {[[535,110,'#a78bfa'],[555,140,'#60a5fa'],[545,170,'#34d399'],[560,220,'#f472b6'],[540,250,'#fbbf24'],[560,280,'#818cf8']].map(([x,y,c],i)=>(
        <g key={i} transform={`translate(${x},${y}) rotate(${i*25})`}>
          <rect x="-5" y="-5" width="10" height="10" fill={c as string} opacity="0.8" rx="1"/>
        </g>
      ))}
    </svg>
  )
}

const FEATURES_TABS = ['All', 'AI Features', 'Success Cases', 'Results']
const FEATURES = [
  { cat:'AI Features', icon:'🎙️', title:'Voice practice', tag:'Free', desc:'Speak your answers aloud. Real-time transcription and fluency scoring included.' },
  { cat:'AI Features', icon:'❓', title:'Adaptive questions', tag:'Pro', desc:'AI generates follow-up questions based on your previous answers in real time.' },
  { cat:'Results', icon:'📈', title:'Progress analytics', tag:'Free', desc:'Track your scores, question coverage, and improvement over time with charts.' },
  { cat:'AI Features', icon:'🧠', title:'Company-specific prep', tag:'Pro', desc:'AI tailors questions to your target company\'s known interview style and stack.' },
  { cat:'Success Cases', icon:'📦', title:'Pack-good interviews', tag:'Free', desc:'Access a curated pack of high-frequency FAANG questions with model answers.' },
  { cat:'Results', icon:'💡', title:'Role-tailored questions', tag:'Pro', desc:'Questions matched to your specific role — SDE, PM, Data Analyst, and more.' },
]

const TESTIMONIALS = [
  { stars: 5, text: 'PrepMate helped me crack my Google SDE-2 interview. The AI feedback was incredibly specific — way better than random LeetCode grinding.', name: 'Rahul S.', company: 'Google' },
  { stars: 5, text: 'I was bombing behavioral rounds. After 2 weeks of daily sessions here, I got offers from 3 companies in the same month. Unbelievable.', name: 'Meera K.', company: 'Meta' },
  { stars: 5, text: 'Honestly feels like having a senior interviewer coach you every day. The scoring is brutally honest which is exactly what you need.', name: 'Priya T.', company: 'Amazon' },
]

const FAQS = [
  { q: 'How is PrepMate different from ChatGPT for interview prep?', a: 'PrepMate is purpose-built — it simulates a real interviewer with follow-up logic, scores your answers on STAR/MECE frameworks, and tracks your progress across sessions. ChatGPT has no memory or evaluation layer.' },
  { q: 'Which interview types does it support?', a: 'DSA (coding problems explained verbally), System Design, Behavioral (STAR method), and role-specific questions for SDE, PM, Data Analyst, and more.' },
  { q: 'Can I personalize it for a specific company?', a: 'Yes. Enter your target company and job description and the AI will generate company-style questions, covering known focus areas and tech stacks.' },
  { q: 'Is there a free plan?', a: 'Yes. The free plan gives you 5 AI sessions/month with core question types. Upgrade to Pro for unlimited sessions, company targeting, and analytics.' },
]

export function LandingPage({ onGetStarted, onLogin }: Props) {
  const [bannerVisible, setBannerVisible] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    document.body.classList.add('lp-active')
    return () => {
      document.body.classList.remove('lp-active')
      window.scrollTo(0, 0)
    }
  }, [])

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const navLinks: [string, string][] = [
    ['Features', 'features'],
    ['How It Works', 'how-it-works'],
    ['Pricing', 'pricing'],
    ['FAQ', 'faq'],
  ]

  const filteredFeatures = activeTab === 'All'
    ? FEATURES
    : FEATURES.filter(f => f.cat === activeTab)

  return (
    <div className="lp-root">

      {/* ── Banner ─── */}
      {bannerVisible && (
        <div className="lp-banner">
          <span>🎯</span>
          <span>AI-Powered 3D Interview Coaching — Get Early Access to PrepMate 3D</span>
          <button className="lp-banner-link" onClick={onGetStarted}>Try It Free →</button>
          <button className="lp-banner-close" onClick={() => setBannerVisible(false)}>×</button>
        </div>
      )}

      {/* ── Single Navbar ─── */}
      <nav className="lp-nav-primary">
        <div className="lp-nav-logo">prepmate</div>
        <ul className="lp-nav-links">
          {navLinks.map(([label, id]) => (
            <li key={label}><a href={`#${id}`} onClick={e => scrollTo(e, id)}>{label}</a></li>
          ))}
        </ul>
        <div className="lp-nav-ctas">
          <button className="lp-nav-demo" onClick={onGetStarted}>Book a Demo</button>
          <button className="lp-nav-login" onClick={onLogin}>Log In</button>
        </div>
      </nav>

      {/* ── Hero ─── */}
      <section className="lp-hero">
        <div className="lp-hero-glow"/>
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <h1 className="lp-hero-h1">Interview<br/>Engine</h1>
            <p className="lp-hero-sub">Practice interviews, get AI feedback, and improve. Repeat until you land the offer.</p>
            <button className="lp-hero-cta" onClick={onGetStarted}>Book a Demo →</button>
          </div>
          <div className="lp-hero-visual"><GridVisualization /></div>
        </div>
      </section>

      {/* ── Stats Bar ─── */}
      <section className="lp-stats">
        {[
          { val: '50K+', label: 'Interviews conducted' },
          { val: '4.9★', label: 'Average rating' },
          { val: '87%', label: 'Offer success rate' },
          { val: '200+', label: 'Companies covered' },
        ].map(s => (
          <div key={s.val} className="lp-stat-item">
            <span className="lp-stat-val">{s.val}</span>
            <span className="lp-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Trusted By ─── */}
      <section className="lp-trusted">
        <p className="lp-trusted-eyebrow">TRUSTED BY</p>
        <p className="lp-trusted-sub">Engineers who got offers at these companies</p>
        <div className="lp-trusted-logos">
          {['Google','Amazon','Meta','Microsoft','Apple','Netflix','Stripe','Flipkart','Atlassian','Uber'].map(c => (
            <span key={c} className="lp-trusted-company">{c}</span>
          ))}
        </div>
      </section>

      {/* ── How It Works ─── */}
      <section className="lp-how" id="how-it-works">
        <div className="lp-how-glow"/>
        <p className="lp-section-eye">HOW IT WORKS</p>
        <h2 className="lp-section-h2">Land the offer in 3 steps</h2>
        <p className="lp-section-sub">PrepMate guides you from raw candidate to confident hire in a structured practice loop.</p>
        <div className="lp-how-steps">
          {[
            { n:'01', icon:'🎯', t:'Pick your role', d:'Choose your target company, role (SDE, PM, Analyst), and difficulty level to get a personalised question set.' },
            { n:'02', icon:'🗣️', t:'Practice live', d:'Speak your answers to the AI interviewer. It listens, understands context, and asks intelligent follow-ups.' },
            { n:'03', icon:'📊', t:'Get AI feedback', d:'Every answer is scored on clarity, depth, and structure. You get specific strengths and areas to work on.' },
            { n:'04', icon:'🔁', t:'Repeat with study', d:'Use the curated study material linked to your weak spots. Re-practice until your scores consistently improve.' },
          ].map(s => (
            <div key={s.n} className="lp-how-step">
              <div className="lp-how-step-header">
                <span className="lp-how-num">{s.n}</span>
                <span className="lp-how-icon">{s.icon}</span>
              </div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─── */}
      <section className="lp-features" id="features">
        <p className="lp-section-eye">FEATURES</p>
        <h2 className="lp-section-h2">Everything you need to prepare</h2>
        <div className="lp-feat-tabs">
          {FEATURES_TABS.map(t => (
            <button
              key={t}
              className={`lp-feat-tab${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}
            >{t}</button>
          ))}
        </div>
        <div className="lp-features-grid">
          {filteredFeatures.map(f => (
            <div key={f.title} className="lp-feat-card">
              <div className="lp-feat-card-top">
                <span className="lp-feat-icon">{f.icon}</span>
                <span className={`lp-feat-tag ${f.tag === 'Pro' ? 'pro' : ''}`}>{f.tag}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─── */}
      <section className="lp-testimonials" id="testimonials">
        <p className="lp-section-eye">CUSTOMER ALL</p>
        <h2 className="lp-section-h2">Real people, real offers</h2>
        <div className="lp-testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="lp-testimonial-card">
              <div className="lp-testimonial-stars">{'★'.repeat(t.stars)}</div>
              <p className="lp-testimonial-text">"{t.text}"</p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar">{t.name[0]}</div>
                <div>
                  <div className="lp-testimonial-name">{t.name}</div>
                  <div className="lp-testimonial-company">Offer @ {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ─── */}
      <section className="lp-pricing" id="pricing">
        <p className="lp-section-eye">PRICING</p>
        <h2 className="lp-section-h2">Start free, upgrade when ready</h2>
        <p className="lp-section-sub">We don't want cost to be a barrier to landing great offers.</p>
        <div className="lp-pricing-grid">
          {/* Free */}
          <div className="lp-price-card">
            <div className="lp-price-tier">FREE</div>
            <div className="lp-price-amount">₹0</div>
            <div className="lp-price-period">forever</div>
            <ul className="lp-price-features">
              {['5 AI sessions/month','Core question types','Basic score feedback','3 company profiles'].map(f => (
                <li key={f}><span className="lp-check">✓</span>{f}</li>
              ))}
            </ul>
            <button className="lp-price-btn outline" onClick={onGetStarted}>Get started</button>
          </div>
          {/* Pro */}
          <div className="lp-price-card featured">
            <div className="lp-price-badge">POPULAR</div>
            <div className="lp-price-tier">PRO</div>
            <div className="lp-price-amount">₹799</div>
            <div className="lp-price-period">per month</div>
            <ul className="lp-price-features">
              {['Unlimited AI sessions','All question types','Detailed score breakdown','Unlimited companies','Voice + text modes','Progress analytics','Priority support'].map(f => (
                <li key={f}><span className="lp-check">✓</span>{f}</li>
              ))}
            </ul>
            <button className="lp-price-btn primary" onClick={onGetStarted}>Start Pro — ₹799/mo</button>
          </div>
          {/* Custom */}
          <div className="lp-price-card">
            <div className="lp-price-tier">CUSTOM</div>
            <div className="lp-price-amount" style={{fontSize:'2.5rem'}}>Custom</div>
            <div className="lp-price-period">for teams</div>
            <ul className="lp-price-features">
              {['Everything in Pro','Team dashboard','Custom question banks','Bulk seat pricing','Dedicated support','White-labelling'].map(f => (
                <li key={f}><span className="lp-check">✓</span>{f}</li>
              ))}
            </ul>
            <button className="lp-price-btn outline" onClick={onGetStarted}>Contact us</button>
          </div>
        </div>
      </section>

      {/* ── FAQ ─── */}
      <section className="lp-faq" id="faq">
        <p className="lp-section-eye">FAQ</p>
        <h2 className="lp-section-h2">Common questions</h2>
        <div className="lp-faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`lp-faq-item${openFaq === i ? ' open' : ''}`}>
              <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span className="lp-faq-arrow">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <p className="lp-faq-a">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ─── */}
      <section className="lp-final-cta">
        <div className="lp-final-cta-glow"/>
        <p className="lp-section-eye">READY</p>
        <h2>Your next offer starts here</h2>
        <p>Join 50,000+ candidates who practice smarter and land faster.</p>
        <div className="lp-final-cta-btns">
          <button className="lp-hero-cta" onClick={onGetStarted}>Start for free</button>
          <button className="lp-price-btn outline" onClick={onGetStarted}>Book a demo</button>
        </div>
      </section>

      {/* ── Footer ─── */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <span>🎯</span><span className="lp-nav-logo">prepmate</span>
        </div>
        <p>© 2026 PrepMate 3D — AI-Powered Interview Coaching</p>
        <div className="lp-footer-links">
          {navLinks.map(([label, id]) => (
            <a key={label} href={`#${id}`} onClick={e => scrollTo(e, id)}>{label}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}
