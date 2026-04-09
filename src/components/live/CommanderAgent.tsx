import { useEffect, useState } from 'react'
import { Target, AlertCircle } from 'lucide-react'

// Scenarios now aligned to actual Finding classifications & domains from schema
const SCENARIOS = [
  {
    domain: 'auth', classification: 'brute_force', findingId: 'INC-003',
    message: "Confirmed brute_force on Identity Services API. Escalating → Remediation Agent: block_ip.",
    color: '#EE5D50'
  },
  {
    domain: 'http', classification: 'sql_injection', findingId: 'INC-001',
    message: "SQL injection confirmed. WAF rule deployed + IP quarantined at edge. ActionType: block_ip.",
    color: '#3965FF'
  },
  {
    domain: 'http', classification: 'ddos', findingId: 'INC-002',
    message: 'DDoS confirmed. Rate limiting applied to 847 source IPs. ActionType: rate_limit.',
    color: '#7551FF'
  },
  {
    domain: 'auth', classification: 'session_hijacking', findingId: 'INC-006',
    message: 'Session hijacking confirmed. All sessions revoked, MFA forced. ActionType: block_ip + alert_soc.',
    color: '#EE5D50'
  },
  {
    domain: 'infra', classification: 'resource_exhaustion', findingId: 'INC-005',
    message: 'Resource exhaustion confirmed. Escalating for manual review. ActionType: manual_review.',
    color: '#E09B30'
  },
]

export default function CommanderAgent() {
  const [radarAngle, setRadarAngle] = useState(0)
  const [feed, setFeed] = useState<typeof SCENARIOS>([SCENARIOS[0]])
  const [nextIdx, setNextIdx] = useState(1)

  useEffect(() => {
    const radarInterval = setInterval(() => {
      setRadarAngle(a => (a + 2) % 360)
    }, 30)
    return () => clearInterval(radarInterval)
  }, [])

  useEffect(() => {
    const feedInterval = setInterval(() => {
      setFeed(prev => [SCENARIOS[nextIdx], ...prev])
      setNextIdx(prev => (prev + 1) % SCENARIOS.length)
    }, 3500)
    return () => clearInterval(feedInterval)
  }, [nextIdx])

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#080B14',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px 16px',
      gap: '16px',
      overflow: 'hidden',
    }}>
      {/* Radar Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        {/* Radar orb */}
        <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
          {[60, 45, 30].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size, height: size,
              borderRadius: '50%',
              border: `1px solid rgba(238, 93, 80, ${0.15 - i * 0.04})`,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }} />
          ))}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <defs>
              <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(238,93,80,0.4)" />
                <stop offset="100%" stopColor="rgba(238,93,80,0)" />
              </radialGradient>
            </defs>
            <path
              d={`M 30 30 L ${30 + 26 * Math.cos((radarAngle - 90) * Math.PI / 180)} ${30 + 26 * Math.sin((radarAngle - 90) * Math.PI / 180)} A 26 26 0 0 0 ${30 + 26 * Math.cos((radarAngle - 150) * Math.PI / 180)} ${30 + 26 * Math.sin((radarAngle - 150) * Math.PI / 180)} Z`}
              fill="url(#sweep)"
            />
            <line
              x1="30" y1="30"
              x2={30 + 26 * Math.cos((radarAngle - 90) * Math.PI / 180)}
              y2={30 + 26 * Math.sin((radarAngle - 90) * Math.PI / 180)}
              stroke="rgba(238,93,80,0.6)"
              strokeWidth="1.5"
            />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12, height: 12, borderRadius: '50%',
            background: 'radial-gradient(circle, #EE5D50, #880022)',
            border: '1px solid #EE5D5088',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Target size={6} color="var(--bg-surface)" />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '1px' }}>COMMANDER AGENT</div>
          <div style={{ fontSize: '10px', color: '#3965FF', letterSpacing: '1.5px', marginTop: '2px' }}>AUTONOMOUS TRIAGE LIVE STREAM</div>
        </div>
      </div>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

      {/* Feed of Cards */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
        {feed.map((item, idx) => (
          <div
            key={idx}
            className="fade-in-up"
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${item.color}33`,
              borderRadius: '12px',
              padding: '14px',
              boxShadow: `0 4px 12px ${item.color}11`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={14} color={item.color} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: item.color }}>{item.findingId}</span>
              <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--text-muted)' }}>JUST NOW</span>
            </div>
            
            <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.4 }}>
              {item.message}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{
                padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                background: `${item.color}18`, color: item.color, letterSpacing: '0.5px',
              }}>
                {item.domain.toUpperCase()}
              </span>
              <span style={{
                padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
                background: 'var(--border)', color: 'var(--text-muted)',
              }}>
                {item.classification.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
