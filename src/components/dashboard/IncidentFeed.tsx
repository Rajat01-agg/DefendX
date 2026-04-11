import type { Finding } from '../../types/schema'
import { SEV_COLORS, DOMAIN_COLORS } from '../../types/schema'
import { Clock } from 'lucide-react'

interface FindingsFeedProps {
  findings: Finding[]
}

export default function FindingsFeed({ findings }: FindingsFeedProps) {
  const feed = findings.slice(0, 5)

  return (
    <div className="card" style={{ padding: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Live Incident Feed</h3>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px', borderRadius: '8px',
          background: 'rgba(238,93,80,0.08)', border: '1px solid rgba(238,93,80,0.15)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EE5D50', display: 'block' }} className="pulse-dot" />
          <span style={{ fontSize: '10px', color: '#EE5D50', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {feed.map((finding, i) => {
          const rawSev = (finding.severity || 'low').toLowerCase() as keyof typeof SEV_COLORS;
          const sevColor = SEV_COLORS[rawSev] || SEV_COLORS.low;
          const rawDomain = (finding.domain || 'http').toLowerCase() as keyof typeof DOMAIN_COLORS;
          const domainColor = DOMAIN_COLORS[rawDomain] || DOMAIN_COLORS.http;
          return (
            <div key={finding.id} style={{
              padding: '12px',
              background: i === 0 ? `${sevColor.color}06` : '#F7F9FC',
              border: `1px solid ${i === 0 ? sevColor.color + '20' : 'var(--border)'}`,
              borderRadius: '12px',
              borderLeft: `3px solid ${sevColor.color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{(finding.classification || 'unknown').replace(/_/g, ' ')}</span>
                  <span style={{
                    padding: '1px 6px', borderRadius: '4px',
                    background: `${domainColor}12`, fontSize: '9px', color: domainColor, fontWeight: 600,
                  }}>{(finding.domain || 'http').toUpperCase()}</span>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 700, color: sevColor.color,
                  background: sevColor.bg,
                  padding: '2px 8px', borderRadius: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {finding.severity || 'LOW'}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: 1.4 }}>
                {finding.summary || 'Summary unavailable'}
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-accent)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  {finding.findingId || 'INC-UNKNOWN'}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {finding.offender?.type || 'unknown'}: {finding.offender?.value || 'unknown'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={10} color="var(--text-muted)" />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
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
