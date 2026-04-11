import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Eye, EyeOff, Lock, Globe, ArrowRight, CheckCircle, GitFork, ExternalLink, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const STATS = [
  { value: '<3s', label: 'Response Time' },
  { value: '100%', label: 'Threat Coverage' },
  { value: '90%+', label: 'Auto-Triage Rate' },
  { value: '$4.9M', label: 'Avg Breach Cost Saved' },
]

const FEATURES = [
  {
    icon: <Zap size={24} color="#3965FF" />,
    title: 'Event-Driven Response',
    desc: 'Activates instantly on threat detection. Zero idle cost, full-power when needed.',
    color: '#3965FF',
  },
  {
    icon: <Eye size={24} color="#7551FF" />,
    title: 'AI Commander Agent',
    desc: 'Classifies threats instantly with strict JSON schema — zero hallucinations guaranteed.',
    color: '#7551FF',
  },
  {
    icon: <Shield size={24} color="#EE5D50" />,
    title: 'Instant Remediation',
    desc: 'Blocks IPs, restarts services, locks accounts — all executed in under 3 seconds.',
    color: '#EE5D50',
  },
  {
    icon: <Globe size={24} color="#05CD99" />,
    title: 'Full Audit Trail',
    desc: 'Every action generates a Jira ticket + Slack alert. Human override always available.',
    color: '#05CD99',
  },
]

const DOMAINS = [
  {
    title: 'Identity & Auth', subtitle: 'domain: auth', icon: '🔐', color: '#EE5D50',
    threats: ['Brute force', 'Credential stuffing', 'Session hijacking'],
    actions: ['block_ip', 'alert_soc', 'manual_review'],
  },
  {
    title: 'HTTP / Network', subtitle: 'domain: http', icon: '🌐', color: '#3965FF',
    threats: ['SQL Injection', 'DDoS', 'Port scanning'],
    actions: ['block_ip', 'rate_limit', 'alert_soc'],
  },
  {
    title: 'Infrastructure', subtitle: 'domain: infra', icon: '🖥️', color: '#7551FF',
    threats: ['Service crash', 'Resource exhaustion', 'Config drift'],
    actions: ['alert_soc', 'manual_review'],
  },
]

const COMPARISON = [
  { metric: 'Response Time', traditional: '4–8 hours', defendx: '< 3 seconds', better: true },
  { metric: 'Threat Coverage', traditional: '~46%', defendx: '100%', better: true },
  { metric: 'Cost', traditional: 'High (idle)',  defendx: 'Zero idle cost', better: true },
  { metric: 'Alert Overload', traditional: '500+ alerts', defendx: 'True positives only', better: true },
  { metric: 'MTTR', traditional: '4–8 hours', defendx: '< 3 seconds', better: true },
]

const USE_CASES = [
  {
    role: 'SOC Analyst', icon: '👨‍💻',
    problem: 'Too many alerts',
    solution: '90%+ auto-triage',
    result: '10× productivity',
  },
  {
    role: 'CISO / Security Lead', icon: '🎖️',
    problem: 'High MTTR + budget',
    solution: 'Automation + compliance',
    result: '80% MTTR reduction',
  },
  {
    role: 'DevOps / SRE', icon: '⚙️',
    problem: 'Night incidents',
    solution: 'Self-healing infra',
    result: '<3 sec recovery',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  
  // Login Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useAuthStore(s => s.login)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('All fields required'); return }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1200))
    const ok = login(email, password)
    if (ok) navigate('/dashboard')
    else { setError('Invalid credentials'); setLoading(false) }
  }

  const scrollToLogin = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.getElementById('login-email-input')?.focus()
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F0FA 0%, #FFFFFF 100%)', minHeight: '100vh', color: 'var(--text-primary)', overflow: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={22} color="#3965FF" />
          <span style={{ fontSize: '20px', fontWeight: 800 }}>
            Defend<span style={{ color: '#3965FF' }}>X</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a
            href="https://github.com/rajaXcodes/gaurdianOps"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none',
            }}
          >
            <GitFork size={14} /> GitHub
          </a>
          <button
            onClick={scrollToLogin}
            style={{
              padding: '8px 20px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #3965FF, #0099BB)',
              border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', paddingTop: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

        {/* Glowing orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(57,101,255,0.08), transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(238,93,80,0.08), transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ 
          position: 'relative', zIndex: 1, 
          maxWidth: '1200px', width: '100%', padding: '0 40px',
          display: 'grid', gridTemplateColumns: '1fr 420px', gap: '60px', alignItems: 'center'
        }}>
          {/* Left: Text Content */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px',
              background: 'rgba(57,101,255,0.08)', border: '1px solid rgba(57,101,255,0.2)',
              marginBottom: '24px',
              fontSize: '12px', color: '#3965FF', fontWeight: 600, letterSpacing: '1px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3965FF' }} className="pulse-dot" />
              AUTONOMOUS SOC DEFENSE
            </div>

            <h1 style={{
              fontSize: 'clamp(40px, 6vw, 68px)',
              fontWeight: 900, lineHeight: 1.05,
              marginBottom: '20px',
              letterSpacing: '-2px',
              background: 'linear-gradient(180deg, var(--text-primary) 0%, var(--text-muted) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Stop Threats in<br />
              <span style={{
                background: 'linear-gradient(135deg, #3965FF, #7551FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Milliseconds
              </span>
            </h1>

            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.6, maxWidth: '500px' }}>
              DefendX is an autonomous security system that detects, decides, acts, and reports —
              all without human delay. Traditional SOC takes hours. DefendX takes <strong style={{ color: '#3965FF' }}>3 seconds</strong>.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={scrollToLogin}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 28px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3965FF, #0099BB)',
                  border: 'none', color: '#fff', fontSize: '15px', fontWeight: 800,
                  cursor: 'pointer', letterSpacing: '0.5px',
                  boxShadow: '0 0 40px rgba(57,101,255,0.3)',
                }}
              >
                Access Portal <ArrowRight size={16} />
              </button>
              <a
                href="https://youtu.be/QlcglM-VI2E"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 28px', borderRadius: '10px',
                  background: '#fff', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(27,37,89,0.02)'
                }}
              >
                <ExternalLink size={15} /> Watch Demo
              </a>
            </div>
          </div>

          {/* Right: Login Card */}
          <div className="glass" style={{
            borderRadius: '20px', padding: '40px', position: 'relative',
            boxShadow: '0 20px 40px rgba(27, 37, 89, 0.08)',
            background: 'rgba(255,255,255,0.85)'
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px',
              background: 'linear-gradient(90deg, transparent, #3965FF, transparent)',
            }} />

            {/* Shield icon */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                display: 'inline-flex', width: 56, height: 56, borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(57,101,255,0.1), rgba(117,81,255,0.1))',
                border: '1px solid rgba(57,101,255,0.2)',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Shield size={24} color="#3965FF" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                Secure Login
              </h2>
            </div>

            {/* Clearance notice */}
            <div style={{
              background: 'rgba(238,93,80,0.06)', border: '1px solid rgba(238,93,80,0.2)',
              borderRadius: '8px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '24px',
            }}>
              <Lock size={12} color="#EE5D50" />
              <span style={{ fontSize: '10px', color: '#EE5D50', fontWeight: 600, letterSpacing: '0.5px' }}>
                AUTHORIZED PERSONNEL ONLY
              </span>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  OPERATOR EMAIL
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@defendx.io"
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: '#fff', border: '1px solid var(--border)', borderRadius: '8px',
                    color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                    transition: 'border-color 0.2s', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
                  }}
                  onFocus={e => (e.target.style.borderColor = '#3965FF44')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  PASSPHRASE
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    style={{
                      width: '100%', padding: '12px 42px 12px 14px',
                      background: '#fff', border: '1px solid var(--border)', borderRadius: '8px',
                      color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
                    }}
                    onFocus={e => (e.target.style.borderColor = '#3965FF44')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  marginBottom: '12px', padding: '8px 12px', borderRadius: '6px',
                  background: 'rgba(238,93,80,0.1)', border: '1px solid rgba(238,93,80,0.2)',
                  fontSize: '12px', color: '#EE5D50',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', marginTop: '20px',
                  padding: '13px',
                  background: loading ? 'var(--border)' : '#1B2559',
                  border: 'none', borderRadius: '8px',
                  color: loading ? 'var(--text-secondary)' : '#fff',
                  fontSize: '13px', fontWeight: 700, letterSpacing: '1px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(27,37,89,0.2)',
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: 14, height: 14, border: '2px solid var(--text-secondary)', borderTopColor: '#3965FF',
                      borderRadius: '50%', animation: 'radar-spin 0.8s linear infinite',
                    }} />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>AUTHENTICATE <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        padding: '32px 40px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
      }}>
        {STATS.map(({ value, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '40px', fontWeight: 800,
              background: 'linear-gradient(135deg, #3965FF, #7551FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              lineHeight: 1.1, marginBottom: '6px',
            }}>
              {value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
            How <span style={{ color: '#3965FF' }}>DefendX</span> Works
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            A 5-stage autonomous pipeline from raw log to closed incident — in under 3 seconds.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {FEATURES.map(({ icon, title, desc, color }) => (
            <div key={title} className="card" style={{ padding: '28px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
              <div style={{
                width: 48, height: 48, borderRadius: '12px', marginBottom: '16px',
                background: `${color}15`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {icon}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Threat Domains */}
      <section style={{ padding: '0 40px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '10px' }}>Threat Coverage Domains</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>100% coverage across all attack surfaces</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {DOMAINS.map(({ title, icon, color, threats, actions }) => (
            <div key={title} className="card" style={{ padding: '24px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color, marginBottom: '12px' }}>{title}</h3>
              <div style={{ marginBottom: '12px' }}>
                {threats.map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <ChevronRight size={12} color={color} />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '6px' }}>ACTIONS</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {actions.map(a => (
                    <span key={a} style={{
                      padding: '2px 8px', borderRadius: '4px',
                      background: `${color}18`, border: `1px solid ${color}30`,
                      fontSize: '10px', color, fontFamily: 'JetBrains Mono, monospace',
                    }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: '0 40px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '10px' }}>
            Traditional SOC vs <span style={{ color: '#3965FF' }}>DefendX</span>
          </h2>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px', borderBottom: '1px solid var(--border)' }}>METRIC</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px', borderBottom: '1px solid var(--border)' }}>TRADITIONAL SOC</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', color: '#3965FF', letterSpacing: '1px', borderBottom: '1px solid var(--border)' }}>DEFENDX</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(({ metric, traditional, defendx }) => (
                <tr key={metric} style={{ borderBottom: '1px solid var(--bg-card)' }}>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{metric}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', color: '#EE5D50' }}>{traditional}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', color: '#05CD99', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <CheckCircle size={12} color="#05CD99" /> {defendx}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '0 40px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '10px' }}>Built For Every Team</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {USE_CASES.map(({ role, icon, problem, solution, result }) => (
            <div key={role} className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#3965FF' }}>{role}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(238,93,80,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#EE5D50', letterSpacing: '1px', marginBottom: '2px' }}>PROBLEM</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{problem}</div>
                </div>
                <div style={{ background: 'rgba(57,101,255,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#3965FF', letterSpacing: '1px', marginBottom: '2px' }}>SOLUTION</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{solution}</div>
                </div>
                <div style={{ background: 'rgba(5,205,153,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#05CD99', letterSpacing: '1px', marginBottom: '2px' }}>RESULT</div>
                  <div style={{ fontSize: '13px', color: '#05CD99', fontWeight: 600 }}>{result}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 40px', textAlign: 'center',
        background: 'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 100%)',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>
          Ready to Deploy <span style={{ color: '#3965FF' }}>Autonomous Defense?</span>
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Join the organizations that respond in seconds, not hours.
        </p>
        <button
          onClick={scrollToLogin}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 36px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #3965FF, #7551FF)',
            border: 'none', color: 'var(--bg-surface)', fontSize: '16px', fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.5px',
            boxShadow: '0 0 60px rgba(57,101,255,0.2)',
          }}
        >
          Launch DefendX <ArrowRight size={18} />
        </button>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <a href="https://github.com/rajaXcodes/gaurdianOps" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GitFork size={13} /> GitHub
          </a>
          <a href="https://youtu.be/QlcglM-VI2E" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ExternalLink size={13} /> Demo Video
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 40px 30px', 
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-base)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Column 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Shield size={24} color="#3965FF" />
              <span style={{ fontSize: '20px', fontWeight: 800 }}>
                Defend<span style={{ color: '#3965FF' }}>X</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              The first truly autonomous SOC defense system. Detecting, diagnosing, and defeating threats in milliseconds.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>PRODUCT</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Features</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Integrations</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Pricing</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Changelog</span>
            </div>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>RESOURCES</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Documentation</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>API Reference</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Blog</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Community</span>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.5px' }}>GET IN TOUCH</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#3965FF' }}>@</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>contact@defendx.io</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#3965FF' }}>☎</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>+1 (800) DEFEND-X</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#3965FF' }}>HQ</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{ 
          maxWidth: '1100px', margin: '0 auto', 
          paddingTop: '24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            © {new Date().getFullYear()} DefendX Security, Inc. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Status</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
