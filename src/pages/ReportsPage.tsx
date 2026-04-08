import { useState } from 'react'
import { mockFindings, mockJobs, mockActions, mockGlobalStat, aggregatedDomainStats } from '../data/mockData'
import { SEV_COLORS, DOMAIN_LABELS, DOMAIN_COLORS, ACTION_TYPE_LABELS, ACTION_STATUS_COLORS } from '../types/schema'
import type { Finding, Domain, Severity } from '../types/schema'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<Severity | 'all'>('all')
  const [domain, setDomain] = useState<Domain | 'all'>('all')
  const [page, setPage] = useState(1)
  const PER_PAGE = 5

  const filtered = mockFindings.filter(f => {
    const matchSearch = search === '' ||
      f.findingId.toLowerCase().includes(search.toLowerCase()) ||
      f.classification.toLowerCase().includes(search.toLowerCase()) ||
      f.offender.value.toLowerCase().includes(search.toLowerCase()) ||
      f.summary.toLowerCase().includes(search.toLowerCase())
    const matchSev = severity === 'all' || f.severity === severity
    const matchDom = domain === 'all' || f.domain === domain
    return matchSearch && matchSev && matchDom
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const completedJobs = mockJobs.filter(j => j.status === 'COMPLETED').length
  const automationRate = mockGlobalStat.totalActions > 0
    ? Math.round((mockActions.filter(a => a.status === 'DONE').length / mockActions.length) * 100)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Metrics — aligned to schema */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        {[
          {
            label: 'TOTAL FINDINGS',
            value: mockGlobalStat.totalFindings.toLocaleString(),
            sub: `Across ${mockGlobalStat.totalJobs} jobs · ${mockGlobalStat.totalLogs.toLocaleString()} logs processed`,
            subColor: '#00FF88', icon: '📊',
          },
          {
            label: 'AUTOMATED RESOLUTION',
            value: `${automationRate}%`,
            sub: `${mockActions.filter(a => a.status === 'DONE').length} / ${mockActions.length} actions completed`,
            subColor: '#00D4FF', icon: '⚡',
          },
          {
            label: 'COMPLETED JOBS',
            value: `${completedJobs} / ${mockJobs.length}`,
            sub: `All pipelines executing in < 3 seconds`,
            subColor: '#8B5CF6', icon: '🛡️',
          },
        ].map(({ label, value, sub, subColor, icon }) => (
          <div key={label} className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, fontSize: '24px', opacity: 0.15 }}>{icon}</div>
            <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1.5px', marginBottom: '10px' }}>{label}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#E8EAF0', marginBottom: '8px', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: '11px', color: subColor }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={14} color="#4A5568" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by Finding ID, classification, offender..."
              style={{
                width: '100%', background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '8px',
                padding: '9px 12px 9px 36px', color: '#E8EAF0', fontSize: '13px', outline: 'none',
              }}
            />
          </div>

          {/* Domain filter */}
          {(['all', 'http', 'auth', 'infra'] as (Domain | 'all')[]).map(d => (
            <button
              key={d}
              onClick={() => { setDomain(d); setPage(1) }}
              style={{
                padding: '7px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.5px',
                background: domain === d ? (d === 'all' ? '#00D4FF22' : `${DOMAIN_COLORS[d as Domain]}18`) : '#0D1220',
                border: `1px solid ${domain === d ? (d === 'all' ? '#00D4FF44' : DOMAIN_COLORS[d as Domain] + '44') : '#1E2D4A'}`,
                color: domain === d ? (d === 'all' ? '#00D4FF' : DOMAIN_COLORS[d as Domain]) : '#6B7280',
              }}
            >
              {d === 'all' ? 'ALL' : d.toUpperCase()}
            </button>
          ))}

          {/* Severity filter */}
          {(['all', 'critical', 'high', 'medium', 'low'] as (Severity | 'all')[]).map(s => (
            <button
              key={s}
              onClick={() => { setSeverity(s); setPage(1) }}
              style={{
                padding: '7px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.5px',
                background: severity === s ? (s === 'all' ? '#FFB80022' : SEV_COLORS[s as Severity].bg) : '#0D1220',
                border: `1px solid ${severity === s ? (s === 'all' ? '#FFB80044' : SEV_COLORS[s as Severity].color + '44') : '#1E2D4A'}`,
                color: severity === s ? (s === 'all' ? '#FFB800' : SEV_COLORS[s as Severity].color) : '#6B7280',
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}

          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
            background: '#00D4FF22', border: '1px solid #00D4FF44', color: '#00D4FF', cursor: 'pointer',
          }}>
            <Download size={13} /> EXPORT
          </button>
        </div>
      </div>

      {/* Findings Table — matches Prisma Finding model */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0D1220' }}>
              {['FINDING ID', 'DOMAIN', 'CLASSIFICATION', 'SEVERITY', 'CONFIDENCE', 'OFFENDER', 'ACTIONS'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '10px', color: '#4A5568', letterSpacing: '1.5px', fontWeight: 600,
                  borderBottom: '1px solid #1E2D4A',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((f: Finding) => {
              const sev = SEV_COLORS[f.severity]
              const domColor = DOMAIN_COLORS[f.domain]
              return (
                <tr key={f.id} style={{ borderBottom: '1px solid #111827', cursor: 'pointer' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', color: '#00D4FF', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                      {f.findingId}
                    </span>
                    <div style={{ fontSize: '10px', color: '#4A5568', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                      Job: {f.jobId}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 8px', borderRadius: '4px',
                      background: `${domColor}18`, border: `1px solid ${domColor}30`,
                      fontSize: '11px', fontWeight: 600, color: domColor,
                    }}>
                      {f.domain}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '13px', color: '#E8EAF0', textTransform: 'capitalize' }}>
                      {f.classification.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '2px' }}>
                      {f.context.service} / {f.context.environment}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '4px',
                      background: sev.bg, color: sev.color,
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}>
                      {f.severity}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <div style={{
                        width: 36, height: 6, borderRadius: 3, background: '#1E2D4A', overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${f.confidence * 100}%`, height: '100%', borderRadius: 3,
                          background: f.confidence >= 0.9 ? '#00FF88' : f.confidence >= 0.8 ? '#FFB800' : '#FF2D55',
                        }} />
                      </div>
                      <span style={{
                        fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                        color: f.confidence >= 0.9 ? '#00FF88' : f.confidence >= 0.8 ? '#FFB800' : '#FF2D55',
                      }}>
                        {(f.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', color: '#9BA3B8', fontFamily: 'JetBrains Mono, monospace', background: '#1E2D4A', padding: '2px 6px', borderRadius: '3px' }}>
                      {f.offender.type}
                    </span>
                    <div style={{ fontSize: '11px', color: '#E8EAF0', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>
                      {f.offender.value}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {f.actions.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {f.actions.map(a => (
                          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: ACTION_STATUS_COLORS[a.status],
                              display: 'block',
                            }} />
                            <span style={{ fontSize: '10px', color: '#9BA3B8' }}>
                              {ACTION_TYPE_LABELS[a.actionType]}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#4A5568' }}>—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #1E2D4A',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>
            Showing {paginated.length} of {filtered.length} findings
          </span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 30, height: 30, borderRadius: '6px', border: '1px solid #1E2D4A',
                background: '#0D1220', color: '#6B7280', cursor: page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: 30, height: 30, borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                border: `1px solid ${page === p ? '#00D4FF44' : '#1E2D4A'}`,
                background: page === p ? '#00D4FF18' : '#0D1220',
                color: page === p ? '#00D4FF' : '#6B7280',
                cursor: 'pointer',
              }}>{p}</button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 30, height: 30, borderRadius: '6px', border: '1px solid #1E2D4A',
                background: '#0D1220', color: '#6B7280', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Domain stats + Job pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Domain Coverage */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#E8EAF0', marginBottom: '16px', letterSpacing: '0.5px' }}>
            DOMAIN COVERAGE (AGGREGATED)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(['http', 'auth', 'infra'] as Domain[]).map(d => {
              const stat = aggregatedDomainStats[d]
              const color = DOMAIN_COLORS[d]
              const maxLogs = Math.max(...Object.values(aggregatedDomainStats).map(s => s.logsProcessed))
              const pct = (stat.logsProcessed / maxLogs) * 100
              return (
                <div key={d}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#9BA3B8', letterSpacing: '0.5px' }}>{DOMAIN_LABELS[d]}</span>
                    <span style={{ fontSize: '11px', color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      {stat.logsProcessed.toLocaleString()} logs · {stat.findingsCount} findings
                    </span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: '#1E2D4A', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: '3px',
                      background: `linear-gradient(90deg, ${color}, ${color}88)`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Job Pipeline */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#E8EAF0', marginBottom: '16px', letterSpacing: '0.5px' }}>
            JOB PIPELINE STATUS
          </h3>
          <div style={{
            background: '#0D1220', border: '1px solid #00D4FF22', borderRadius: '10px', padding: '14px',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '8px',
              background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontSize: '18px',
            }}>✅</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0', marginBottom: '4px' }}>All Jobs Completed</div>
              <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.5 }}>
                Pipeline: Log Ingestion → Commander Agent Analysis → JSON Handshake Validation → Remediation → Report Generation.
                Average execution time: ~3 seconds per job.
              </div>
            </div>
          </div>
          <button style={{
            width: '100%',
            marginTop: '16px',
            padding: '10px',
            background: '#0D1220',
            border: '1px solid #1E2D4A',
            borderRadius: '8px',
            color: '#9BA3B8',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '1px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <Download size={13} />
            DOWNLOAD REPORTS (LAST 24H)
          </button>
        </div>
      </div>
    </div>
  )
}
