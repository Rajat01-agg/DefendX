import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Eye, Globe, ArrowRight, CheckCircle, GitFork, ExternalLink, ChevronRight } from 'lucide-react'

const STATS = [
  { value: '<3s', label: 'Response Time' },
  { value: '100%', label: 'Threat Coverage' },
  { value: '90%+', label: 'Auto-Triage Rate' },
  { value: '$4.9M', label: 'Avg Breach Cost Saved' },
]

const FEATURES = [
  {
    icon: <Zap size={24} color="#00D4FF" />,
    title: 'Event-Driven Response',
    desc: 'Activates instantly on threat detection. Zero idle cost, full-power when needed.',
    color: '#00D4FF',
  },
  {
    icon: <Eye size={24} color="#8B5CF6" />,
    title: 'AI Commander Agent',
    desc: 'Classifies threats instantly with strict JSON schema — zero hallucinations guaranteed.',
    color: '#8B5CF6',
  },
  {
    icon: <Shield size={24} color="#FF2D55" />,
    title: 'Instant Remediation',
    desc: 'Blocks IPs, restarts services, locks accounts — all executed in under 3 seconds.',
    color: '#FF2D55',
  },
  {
    icon: <Globe size={24} color="#00FF88" />,
    title: 'Full Audit Trail',
    desc: 'Every action generates a Jira ticket + Slack alert. Human override always available.',
    color: '#00FF88',
  },
]

const DOMAINS = [
  {
    title: 'Identity & Auth', subtitle: 'domain: auth', icon: '🔐', color: '#FF2D55',
    threats: ['Brute force', 'Credential stuffing', 'Session hijacking'],
    actions: ['block_ip', 'alert_soc', 'manual_review'],
  },
  {
    title: 'HTTP / Network', subtitle: 'domain: http', icon: '🌐', color: '#00D4FF',
    threats: ['SQL Injection', 'DDoS', 'Port scanning'],
    actions: ['block_ip', 'rate_limit', 'alert_soc'],
  },
  {
    title: 'Infrastructure', subtitle: 'domain: infra', icon: '🖥️', color: '#8B5CF6',
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

  return (
    <div style={{ background: '#070A12', minHeight: '100vh', color: '#E8EAF0', overflow: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(7,10,18,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1E2D4A',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={22} color="#00D4FF" />
          <span style={{ fontSize: '20px', fontWeight: 800 }}>
            Defend<span style={{ color: '#00D4FF' }}>X</span>
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
              border: '1px solid #1E2D4A', background: 'transparent',
              color: '#9BA3B8', fontSize: '13px', textDecoration: 'none',
            }}
          >
            <GitFork size={14} /> GitHub
          </a>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 20px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #00D4FF, #0099BB)',
              border: 'none', color: '#070A12', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', paddingTop: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

        {/* Glowing orbs */}
        <div style={{
          position: 'absolute', top: '30%', left: '10%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,85,0.08), transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '800px', padding: '0 24px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
            marginBottom: '24px',
            fontSize: '12px', color: '#00D4FF', fontWeight: 600, letterSpacing: '1px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4FF' }} className="pulse-dot" />
            AUTONOMOUS SOC DEFENSE — ALERT TO ACTION IN SECONDS
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 900, lineHeight: 1.05,
            marginBottom: '20px',
            letterSpacing: '-2px',
            background: 'linear-gradient(180deg, #E8EAF0 0%, #9BA3B8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Stop Threats in<br />
            <span style={{
              background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Milliseconds
            </span>
          </h1>

          <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '36px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 36px' }}>
            DefendX is an autonomous security system that detects, decides, acts, and reports —
            all without human delay. Traditional SOC takes hours. DefendX takes <strong style={{ color: '#00D4FF' }}>3 seconds</strong>.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #00D4FF, #0099BB)',
                border: 'none', color: '#070A12', fontSize: '15px', fontWeight: 800,
                cursor: 'pointer', letterSpacing: '0.5px',
                boxShadow: '0 0 40px rgba(0,212,255,0.3)',
              }}
            >
              Launch Dashboard <ArrowRight size={16} />
            </button>
            <a
              href="https://youtu.be/QlcglM-VI2E"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', borderRadius: '10px',
                background: 'transparent', border: '1px solid #1E2D4A',
                color: '#E8EAF0', fontSize: '15px', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={15} /> Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        borderTop: '1px solid #1E2D4A', borderBottom: '1px solid #1E2D4A',
        background: '#0D1220',
        padding: '32px 40px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
      }}>
        {STATS.map(({ value, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '40px', fontWeight: 800,
              background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              lineHeight: 1.1, marginBottom: '6px',
            }}>
              {value}
            </div>
            <div style={{ fontSize: '12px', color: '#4A5568', letterSpacing: '1px' }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
            How <span style={{ color: '#00D4FF' }}>DefendX</span> Works
          </h2>
          <p style={{ fontSize: '15px', color: '#4A5568', maxWidth: '500px', margin: '0 auto' }}>
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
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Threat Domains */}
      <section style={{ padding: '0 40px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '10px' }}>Threat Coverage Domains</h2>
          <p style={{ fontSize: '14px', color: '#4A5568' }}>100% coverage across all attack surfaces</p>
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
                    <span style={{ fontSize: '12px', color: '#9BA3B8' }}>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #1E2D4A', paddingTop: '10px' }}>
                <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>ACTIONS</div>
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
            Traditional SOC vs <span style={{ color: '#00D4FF' }}>DefendX</span>
          </h2>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0D1220' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', color: '#4A5568', letterSpacing: '1px', borderBottom: '1px solid #1E2D4A' }}>METRIC</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', color: '#4A5568', letterSpacing: '1px', borderBottom: '1px solid #1E2D4A' }}>TRADITIONAL SOC</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', color: '#00D4FF', letterSpacing: '1px', borderBottom: '1px solid #1E2D4A' }}>DEFENDX</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(({ metric, traditional, defendx }) => (
                <tr key={metric} style={{ borderBottom: '1px solid #111827' }}>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#E8EAF0', fontWeight: 500 }}>{metric}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', color: '#FF2D55' }}>{traditional}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', color: '#00FF88', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <CheckCircle size={12} color="#00FF88" /> {defendx}
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
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#00D4FF' }}>{role}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(255,45,85,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#FF2D55', letterSpacing: '1px', marginBottom: '2px' }}>PROBLEM</div>
                  <div style={{ fontSize: '13px', color: '#9BA3B8' }}>{problem}</div>
                </div>
                <div style={{ background: 'rgba(0,212,255,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#00D4FF', letterSpacing: '1px', marginBottom: '2px' }}>SOLUTION</div>
                  <div style={{ fontSize: '13px', color: '#9BA3B8' }}>{solution}</div>
                </div>
                <div style={{ background: 'rgba(0,255,136,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#00FF88', letterSpacing: '1px', marginBottom: '2px' }}>RESULT</div>
                  <div style={{ fontSize: '13px', color: '#00FF88', fontWeight: 600 }}>{result}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 40px', textAlign: 'center',
        background: 'linear-gradient(180deg, #070A12 0%, #0D1220 100%)',
        borderTop: '1px solid #1E2D4A',
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>
          Ready to Deploy <span style={{ color: '#00D4FF' }}>Autonomous Defense?</span>
        </h2>
        <p style={{ fontSize: '15px', color: '#4A5568', marginBottom: '32px' }}>
          Join the organizations that respond in seconds, not hours.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 36px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
            border: 'none', color: '#fff', fontSize: '16px', fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.5px',
            boxShadow: '0 0 60px rgba(0,212,255,0.2)',
          }}
        >
          Launch DefendX <ArrowRight size={18} />
        </button>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <a href="https://github.com/rajaXcodes/gaurdianOps" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', color: '#4A5568', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GitFork size={13} /> GitHub
          </a>
          <a href="https://youtu.be/QlcglM-VI2E" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', color: '#4A5568', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ExternalLink size={13} /> Demo Video
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '20px 40px', borderTop: '1px solid #1E2D4A',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#070A12',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="#00D4FF" />
          <span style={{ fontSize: '14px', fontWeight: 700 }}>Defend<span style={{ color: '#00D4FF' }}>X</span></span>
        </div>
        <span style={{ fontSize: '12px', color: '#4A5568' }}>© 2026 DefendX. All access monitored.</span>
      </footer>
    </div>
  )
}
