import { useEffect, useState } from 'react'
import { Target, Eye, AlertCircle } from 'lucide-react'

interface AnalysisStep {
  stage: 'DETECTED' | 'ANALYZING' | 'CONCLUSION'
  message: string
  detail?: string
}

// Scenarios now aligned to actual Finding classifications & domains from schema
const SCENARIOS: { domain: string; classification: string; findingId: string; steps: AnalysisStep[] }[] = [
  {
    domain: 'auth', classification: 'brute_force', findingId: 'INC-003',
    steps: [
      { stage: 'DETECTED', message: 'Pattern match: 127 auth failures from single source in 15 min window.', detail: 'Domain: auth · Service: iam-auth · Env: production' },
      { stage: 'ANALYZING', message: 'Geo-IP enrichment: Source 103.4xx.xx.x localized to Sofia, Bulgaria. No prior history. Confidence: 0.95.', detail: 'Offender: ip → 103.4xx.xx.x · event_count: 127' },
      { stage: 'CONCLUSION', message: "Confirmed brute_force on Identity Services API. Escalating → Remediation Agent: block_ip.", detail: 'Finding INC-003 severity=high · ActionType: block_ip' },
    ],
  },
  {
    domain: 'http', classification: 'sql_injection', findingId: 'INC-001',
    steps: [
      { stage: 'DETECTED', message: 'WAF signature SQL-0042 matched: UNION SELECT payload in POST /api/v2/query.', detail: 'Domain: http · Service: api-gateway · Env: production' },
      { stage: 'ANALYZING', message: 'Payload analysis: UNION SELECT targeting user table. 34 events, 0 success, 2 unique targets. Confidence: 0.97.', detail: 'Offender: ip → 185.220.101.45 · failure_count: 34' },
      { stage: 'CONCLUSION', message: "SQL injection confirmed. WAF rule deployed + IP quarantined at edge. ActionType: block_ip.", detail: 'Finding INC-001 severity=critical · Action completed in 214ms' },
    ],
  },
  {
    domain: 'http', classification: 'ddos', findingId: 'INC-002',
    steps: [
      { stage: 'DETECTED', message: 'Anomalous UDP flood: 450k pps targeting payment gateway service.', detail: 'Domain: http · Service: payment-gateway · Env: production' },
      { stage: 'ANALYZING', message: 'Traffic source analysis: 847 unique IPs, botnet C2 signature confirmed. event_count: 450,000.', detail: 'Offender: ip → 103.45.xx.xx · Confidence: 0.92' },
      { stage: 'CONCLUSION', message: 'DDoS confirmed. Rate limiting applied to 847 source IPs. ActionType: rate_limit.', detail: 'Finding INC-002 severity=high · Mitigation time: 1.8s' },
    ],
  },
  {
    domain: 'auth', classification: 'session_hijacking', findingId: 'INC-006',
    steps: [
      { stage: 'DETECTED', message: 'Impossible travel: j.doe@corp.co logged in from Delhi (10:14) and London (10:18).', detail: 'Domain: auth · Service: session-mgr · Env: production' },
      { stage: 'ANALYZING', message: 'Session token replay confirmed across 2 regions. 6,700 km in 4 minutes. Confidence: 0.88.', detail: 'Offender: user → j.doe@corp.co · success_count: 2' },
      { stage: 'CONCLUSION', message: 'Session hijacking confirmed. All sessions revoked, MFA forced. ActionType: block_ip + alert_soc.', detail: 'Finding INC-006 severity=high · Forensic log preserved' },
    ],
  },
  {
    domain: 'infra', classification: 'resource_exhaustion', findingId: 'INC-005',
    steps: [
      { stage: 'DETECTED', message: 'OOMKilled: payment-processor-pod-xz91 crashed 5 times in 30 min window.', detail: 'Domain: infra · Service: k8s-cluster-07 · Env: production' },
      { stage: 'ANALYZING', message: 'Memory consumption: 7.8Gi / 8Gi limit. No horizontal scaling available. Confidence: 0.98.', detail: 'Offender: service → payment-processor-pod-xz91' },
      { stage: 'CONCLUSION', message: 'Resource exhaustion confirmed. Escalating for manual review. ActionType: manual_review.', detail: 'Finding INC-005 severity=critical · Requires human approval' },
    ],
  },
]

const STAGE_CONFIG = {
  DETECTED: { icon: Target, color: '#FF2D55', bg: 'rgba(255,45,85,0.08)', border: 'rgba(255,45,85,0.25)', label: 'DETECTED' },
  ANALYZING: { icon: Eye, color: '#00D4FF', bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.25)', label: 'ANALYZING' },
  CONCLUSION: { icon: AlertCircle, color: '#00FF88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', label: 'CONCLUSION' },
}

export default function CommanderAgent() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [radarAngle, setRadarAngle] = useState(0)

  useEffect(() => {
    const radarInterval = setInterval(() => {
      setRadarAngle(a => (a + 2) % 360)
    }, 30)
    return () => clearInterval(radarInterval)
  }, [])

  useEffect(() => {
    setVisibleSteps(0)
    const scenario = SCENARIOS[scenarioIdx]
    const timers: ReturnType<typeof setTimeout>[] = []

    scenario.steps.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleSteps(i + 1)
      }, i * 2500)
      timers.push(t)
    })

    const cycleTimer = setTimeout(() => {
      setScenarioIdx(prev => (prev + 1) % SCENARIOS.length)
    }, scenario.steps.length * 2500 + 3000)
    timers.push(cycleTimer)

    return () => timers.forEach(clearTimeout)
  }, [scenarioIdx])

  const scenario = SCENARIOS[scenarioIdx]

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#080B14',
      border: '1px solid #1E2D4A',
      borderRadius: '12px',
      padding: '20px 16px',
      gap: '16px',
      overflow: 'hidden',
    }}>
      {/* Radar orb */}
      <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
        {[140, 105, 70].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(255, 45, 85, ${0.15 - i * 0.04})`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }} />
        ))}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,45,85,0.4)" />
              <stop offset="100%" stopColor="rgba(255,45,85,0)" />
            </radialGradient>
          </defs>
          <path
            d={`M 70 70 L ${70 + 60 * Math.cos((radarAngle - 90) * Math.PI / 180)} ${70 + 60 * Math.sin((radarAngle - 90) * Math.PI / 180)} A 60 60 0 0 0 ${70 + 60 * Math.cos((radarAngle - 150) * Math.PI / 180)} ${70 + 60 * Math.sin((radarAngle - 150) * Math.PI / 180)} Z`}
            fill="url(#sweep)"
          />
          <line
            x1="70" y1="70"
            x2={70 + 60 * Math.cos((radarAngle - 90) * Math.PI / 180)}
            y2={70 + 60 * Math.sin((radarAngle - 90) * Math.PI / 180)}
            stroke="rgba(255,45,85,0.6)"
            strokeWidth="1.5"
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 28, height: 28, borderRadius: '50%',
          background: 'radial-gradient(circle, #FF2D55, #880022)',
          border: '2px solid #FF2D5588',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Target size={12} color="#fff" />
        </div>
      </div>

      {/* Label + current finding context */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0', letterSpacing: '1px' }}>COMMANDER AGENT</div>
        <div style={{ fontSize: '10px', color: '#00D4FF', letterSpacing: '1.5px', marginTop: '2px' }}>AUTONOMOUSLY TRIAGING THREATS</div>
        <div style={{ marginTop: '6px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <span style={{
            padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
            background: '#00D4FF18', color: '#00D4FF', letterSpacing: '0.5px',
          }}>
            {scenario.domain.toUpperCase()}
          </span>
          <span style={{
            padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
            background: '#1E2D4A', color: '#9BA3B8',
          }}>
            {scenario.classification.replace(/_/g, ' ')}
          </span>
          <span style={{
            padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
            background: '#FF2D5518', color: '#FF2D55', fontFamily: 'JetBrains Mono, monospace',
          }}>
            {scenario.findingId}
          </span>
        </div>
      </div>

      {/* Analysis steps */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
        {scenario.steps.slice(0, visibleSteps).map((step, i) => {
          const cfg = STAGE_CONFIG[step.stage]
          const Icon = cfg.icon
          return (
            <div
              key={`${scenarioIdx}-${i}`}
              className="fade-in-up"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: '10px',
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Icon size={12} color={cfg.color} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: cfg.color, letterSpacing: '1px' }}>{cfg.label}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#E8EAF0', fontWeight: i === 2 ? 600 : 400 }}>
                {step.message}
              </div>
              {step.detail && (
                <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '3px', fontFamily: 'JetBrains Mono, monospace' }}>
                  {step.detail}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
