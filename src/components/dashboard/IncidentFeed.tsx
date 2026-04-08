import { mockFindings } from '../../data/mockData'
import { SEV_COLORS, DOMAIN_LABELS, DOMAIN_COLORS } from '../../types/schema'
import { Clock } from 'lucide-react'

export default function FindingsFeed() {
  const feed = mockFindings.slice(0, 5)

  return (
    <div className="card" style={{ padding: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0' }}>Recent Findings</h3>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '3px 8px', borderRadius: '4px',
          background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.2)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2D55', display: 'block' }} className="pulse-dot" />
          <span style={{ fontSize: '10px', color: '#FF2D55', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {feed.map((finding, i) => {
          const sevColor = SEV_COLORS[finding.severity]
          const domainColor = DOMAIN_COLORS[finding.domain]
          return (
            <div key={finding.id} style={{
              padding: '12px',
              background: '#0D1220',
              border: `1px solid ${i === 0 ? sevColor.color + '33' : '#1E2D4A'}`,
              borderRadius: '8px',
              borderLeft: `3px solid ${sevColor.color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>{finding.classification.replace(/_/g, ' ')}</span>
                  <span style={{
                    padding: '1px 6px', borderRadius: '3px',
                    background: `${domainColor}18`, border: `1px solid ${domainColor}30`,
                    fontSize: '9px', color: domainColor, fontWeight: 600, letterSpacing: '0.5px',
                  }}>{finding.domain.toUpperCase()}</span>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 700, color: sevColor.color,
                  background: sevColor.bg,
                  padding: '2px 6px', borderRadius: '4px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {finding.severity}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px', lineHeight: 1.4 }}>
                {finding.summary}
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', color: '#00D4FF', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  {finding.findingId}
                </span>
                <span style={{ fontSize: '10px', color: '#4A5568', fontFamily: 'JetBrains Mono, monospace' }}>
                  {finding.offender.type}: {finding.offender.value}
                </span>
                <span style={{
                  fontSize: '10px', color: '#9BA3B8', fontFamily: 'JetBrains Mono, monospace',
                  background: '#1E2D4A', padding: '1px 5px', borderRadius: '3px',
                }}>
                  conf: {(finding.confidence * 100).toFixed(0)}%
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} color="#4A5568" />
                  <span style={{ fontSize: '10px', color: '#4A5568', fontFamily: 'JetBrains Mono, monospace' }}>
                    {new Date(finding.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
