import { useState } from 'react'
import { mockFindings, mockJobs, mockActions, mockGlobalStat, aggregatedDomainStats, mockReports } from '../data/mockData'
import { SEV_COLORS, DOMAIN_LABELS, DOMAIN_COLORS, ACTION_TYPE_LABELS, ACTION_STATUS_COLORS } from '../types/schema'
import type { Finding, Domain, Severity } from '../types/schema'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [activeReportTab, setActiveReportTab] = useState<'markdown' | 'json'>('markdown')
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

  const handleExportFindings = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Domain,Classification,Severity,Offender,Date\n"
      + filtered.map(f => `${f.findingId},${f.domain},${f.classification},${f.severity},${f.offender.value},${new Date(f.createdAt).toISOString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "defendx_findings_export.csv";
    link.click();
  }

  const handleDownloadReports = () => {
    const textContent = "data:text/markdown;charset=utf-8," 
      + encodeURIComponent(mockReports.map(r => r.humanReport).join("\n\n---\n\n"));
    const link = document.createElement("a");
    link.href = textContent;
    link.download = "defendx_soc_reports.md";
    link.click();
  }

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const completedJobs = mockJobs.filter(j => j.status === 'COMPLETED').length
  const automationRate = mockGlobalStat.totalActions > 0
    ? Math.round((mockActions.filter(a => a.status === 'DONE').length / mockActions.length) * 100)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header / Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-10px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['SOC-2 Reports', 'Daily Briefings', 'Weekly Summary', 'Incident Reports'].map((tab, i) => (
            <button key={tab} style={{
              background: i === 0 ? '#00D4FF11' : 'transparent',
              border: `1px solid ${i === 0 ? '#00D4FF44' : 'transparent'}`,
              color: i === 0 ? '#00D4FF' : '#9BA3B8',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: i === 0 ? 600 : 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            background: '#0D1220', border: '1px solid #1E2D4A', color: '#E8EAF0',
            padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
          }}>
            Schedule Report
          </button>
          <button 
            onClick={handleDownloadReports}
            style={{
            background: '#8B5CF6', border: 'none', color: '#fff',
            padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
          }}>
            Generate Report
          </button>
        </div>
      </div>

      {/* Compliance Banner */}
      <div style={{
        background: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.15)',
        borderLeft: '4px solid #00FF88',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,255,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#00FF88', fontSize: '14px', fontWeight: 800 }}>✓</span>
          </div>
          <div>
            <div style={{ color: '#00FF88', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }}>SOC-2 COMPLIANCE: ACTIVE</div>
            <div style={{ color: '#9BA3B8', fontSize: '12px', marginTop: '4px' }}>All mandatory reporting requirements for the current quarter have been met automatically via integration.</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#6B7280', fontSize: '10px', letterSpacing: '1px', fontWeight: 600 }}>LAST REPORT FILED</div>
          <div style={{ color: '#E8EAF0', fontSize: '13px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', marginTop: '4px' }}>
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Top Metrics */}
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E2D4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0' }}>Recent Findings</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={14} color="#4A5568" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Search ID, classification..."
                    style={{
                      width: '100%', background: '#070A12', border: '1px solid #1E2D4A', borderRadius: '6px',
                      padding: '7px 12px 7px 36px', color: '#E8EAF0', fontSize: '12px', outline: 'none',
                    }}
                  />
                </div>
                <button 
                  onClick={handleExportFindings}
                  style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                  background: '#00D4FF22', border: '1px solid #00D4FF44', color: '#00D4FF', cursor: 'pointer',
                }}>
                  <Download size={13} /> EXPORT
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0D1220' }}>
                  {['FINDING ID', 'DOMAIN', 'CLASSIFICATION', 'SEVERITY', 'CONFIDENCE', 'ACTIONS'].map(h => (
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
                        <div style={{ fontSize: '12px', color: '#E8EAF0', textTransform: 'capitalize' }}>
                          {f.classification.replace(/_/g, ' ')}
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
                        <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: f.confidence >= 0.9 ? '#00FF88' : '#FFB800' }}>
                          {(f.confidence * 100).toFixed(0)}%
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {f.actions.length > 0 ? (
                          <span style={{ fontSize: '11px', color: '#9BA3B8', padding: '4px 8px', background: '#1E2D4A', borderRadius: '4px' }}>
                            {f.actions.length} Action{f.actions.length > 1 ? 's' : ''} Taken
                          </span>
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
              padding: '12px 16px', borderTop: '1px solid #1E2D4A', background: '#070A12',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>
                Showing {paginated.length} of {filtered.length} findings
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid #1E2D4A', background: '#0D1220', color: '#6B7280', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                ><ChevronLeft size={14} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 28, height: 28, borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: `1px solid ${page === p ? '#00D4FF44' : '#1E2D4A'}`, background: page === p ? '#00D4FF18' : '#0D1220', color: page === p ? '#00D4FF' : '#6B7280', cursor: 'pointer' }}>{p}</button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid #1E2D4A', background: '#0D1220', color: '#6B7280', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                ><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#8B5CF6' }}>✨</span> AI Daily Security Brief
              </h3>
              <div style={{ fontSize: '10px', fontWeight: 700, padding: '4px 8px', background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '4px', color: '#8B5CF6' }}>LATEST GENERATED</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0', marginBottom: '8px' }}>Executive Summary</h4>
                <p style={{ fontSize: '13px', color: '#9BA3B8', lineHeight: 1.6 }}>
                  Network activity indicates standard operational conditions over the last 24 hours. A slight anomaly consisting of sequential scanning attempts targeting perimeter edge nodes was neutralized autonomously. Core authentication gateways and payment processors remain strictly secured with zero indicators of successful breach.
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(0, 255, 136, 0.1)', color: '#00FF88', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(0, 255, 136, 0.2)' }}>Secure</span>
                  <span style={{ fontSize: '10px', background: 'rgba(0, 212, 255, 0.1)', color: '#00D4FF', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(0, 212, 255, 0.2)' }}>Stable</span>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0', marginBottom: '8px' }}>Actions</h4>
                <button style={{ width: '100%', padding: '10px', background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '6px', color: '#9BA3B8', fontSize: '12px', textAlign: 'left', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span>Generate Audio Briefing</span> <span style={{ fontSize: '10px', background: '#111827', padding: '2px 6px', borderRadius: '4px' }}>MP3</span>
                </button>
                <button style={{ width: '100%', padding: '10px', background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '6px', color: '#9BA3B8', fontSize: '12px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span>Email Summary to Executive Board</span> <span style={{ fontSize: '10px', background: '#111827', padding: '2px 6px', borderRadius: '4px' }}>Draft</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#00D4FF' }}>⚡</span> Quick Generate
            </h3>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '20px' }}>Create a new report instantly based on templates.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#4A5568', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px' }}>REPORT TYPE</label>
                <select style={{ width: '100%', background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '6px', padding: '10px 12px', color: '#E8EAF0', fontSize: '13px', outline: 'none' }}>
                  <option>SOC-2 Incident Report</option>
                  <option>PCI-DSS Audit Log</option>
                  <option>Quarterly Executive Brief</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#4A5568', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px' }}>TARGET ENTITY</label>
                <select style={{ width: '100%', background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '6px', padding: '10px 12px', color: '#E8EAF0', fontSize: '13px', outline: 'none' }}>
                  <option>Global Infrastructure</option>
                  <option>Identity Services API</option>
                  <option>Payment Gateway</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '10px', color: '#4A5568', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px' }}>DATE RANGE</label>
                  <select style={{ width: '100%', background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '6px', padding: '10px 12px', color: '#E8EAF0', fontSize: '13px', outline: 'none' }}>
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Current Quarter</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '10px', color: '#4A5568', fontWeight: 600, letterSpacing: '1px', marginBottom: '6px' }}>FORMAT</label>
                  <select style={{ width: '100%', background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '6px', padding: '10px 12px', color: '#E8EAF0', fontSize: '13px', outline: 'none' }}>
                    <option>PDF (Signed)</option>
                    <option>CSV Export</option>
                    <option>JSON Log File</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleDownloadReports}
              style={{
              width: '100%', background: '#00D4FF', border: 'none', color: '#070A12',
              padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 212, 255, 0.25)',
            }}>
              Generate Now
            </button>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#E8EAF0', marginBottom: '16px', letterSpacing: '0.5px' }}>DOMAIN COVERAGE</h3>
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
                        {stat.logsProcessed.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: '#1E2D4A', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: '3px', background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
