import { useState } from 'react'
import { mockJobs, mockReports } from '../data/mockData'
import { DOMAIN_LABELS, DOMAIN_COLORS, JOB_STATUS_COLORS, JOB_STATUS_LABELS, SEV_COLORS } from '../types/schema'
import type { Job, Domain } from '../types/schema'
import { Search, Download, ChevronLeft, ChevronRight, X, FileText, Calendar, Filter, Clock, Shield, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 5

  // Filter jobs
  const filtered = mockJobs.filter(j => {
    const matchSearch = search === '' ||
      j.jobId.toLowerCase().includes(search.toLowerCase())
    const matchDomain = domainFilter === 'all' ||
      j.domainStats.some(ds => ds.domain === domainFilter && ds.findingsCount > 0)
    const matchStatus = statusFilter === 'all' || j.status === statusFilter
    return matchSearch && matchDomain && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleDownloadReport = (jobId: string) => {
    const report = mockReports.find(r => r.jobId === jobId)
    if (!report) {
      alert('No report available for this job.')
      return
    }
    const textContent = "data:text/markdown;charset=utf-8,"
      + encodeURIComponent(report.humanReport)
    const link = document.createElement("a")
    link.href = textContent
    link.download = `defendx_report_${jobId}.md`
    link.click()
  }

  const handleDownloadAll = () => {
    const textContent = "data:text/markdown;charset=utf-8,"
      + encodeURIComponent(mockReports.map(r => r.humanReport).join("\n\n---\n\n"))
    const link = document.createElement("a")
    link.href = textContent
    link.download = "defendx_all_reports.md"
    link.click()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header with actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Reports & Compliance</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>View all pipeline job results, findings, and generate compliance reports.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownloadAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
              background: '#F0F4F8', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer',
            }}>
            <Download size={14} /> Export All
          </button>
          <button
            onClick={handleDownloadAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
              background: 'var(--navy)', border: 'none', color: '#fff', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(27, 37, 89, 0.2)',
            }}>
            <FileText size={14} /> Generate Report
          </button>
        </div>
      </div>

      {/* Compliance Banner */}
      <div style={{
        background: 'rgba(5, 205, 153, 0.06)',
        border: '1px solid rgba(5, 205, 153, 0.2)',
        borderLeft: '4px solid #05CD99',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(5,205,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={14} color="#05CD99" />
          </div>
          <div>
            <div style={{ color: '#05CD99', fontWeight: 700, fontSize: '13px' }}>SOC-2 COMPLIANCE: ACTIVE</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>All mandatory reporting requirements met. Last auto-filed on schedule.</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 600 }}>LAST REPORT FILED</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <Filter size={14} color="var(--text-muted)" />

        {/* Search */}
        <div style={{ position: 'relative', width: '200px' }}>
          <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by Job ID..."
            style={{
              width: '100%', background: '#F7F9FC', border: '1px solid var(--border)', borderRadius: '10px',
              padding: '8px 12px 8px 32px', color: 'var(--text-primary)', fontSize: '12px', outline: 'none',
            }}
          />
        </div>

        {/* Domain filter */}
        <select
          value={domainFilter}
          onChange={e => { setDomainFilter(e.target.value as Domain | 'all'); setPage(1) }}
          style={{
            background: '#F7F9FC', border: '1px solid var(--border)', borderRadius: '10px',
            padding: '8px 12px', color: 'var(--text-primary)', fontSize: '12px', outline: 'none',
          }}
        >
          <option value="all">All Domains</option>
          <option value="http">HTTP / Network</option>
          <option value="auth">Identity & Auth</option>
          <option value="infra">Infrastructure</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          style={{
            background: '#F7F9FC', border: '1px solid var(--border)', borderRadius: '10px',
            padding: '8px 12px', color: 'var(--text-primary)', fontSize: '12px', outline: 'none',
          }}
        >
          <option value="all">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="ANALYZING">Analyzing</option>
          <option value="PENDING">Pending</option>
          <option value="ERROR">Error</option>
        </select>

        {/* Download filtered */}
        <button
          onClick={handleDownloadAll}
          style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
            background: 'rgba(57,101,255,0.08)', border: '1px solid rgba(57,101,255,0.15)', color: '#3965FF', cursor: 'pointer',
          }}
        >
          <Download size={13} /> Download Report
        </button>
      </div>

      {/* Main Content: Table + Detail Card */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 420px' : '1fr', gap: '20px' }}>

        {/* Job Table */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['JOB ID', 'STATUS', 'LOGS', 'FINDINGS', 'ACTIONS', 'COMPLETED', 'REPORT'].map(h => (
                  <th key={h} style={{
                    padding: '14px 16px', textAlign: 'left',
                    fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1.2px', fontWeight: 600,
                    background: '#F7F9FC',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((job) => {
                const statusColor = JOB_STATUS_COLORS[job.status]
                const isSelected = selectedJob?.id === job.id
                return (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJob(isSelected ? null : job)}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(57,101,255,0.04)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-accent)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                        {job.jobId}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '4px 10px', borderRadius: '8px',
                        background: `${statusColor}12`, fontSize: '11px', fontWeight: 600, color: statusColor,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {job.totalLogs.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {job.findingsCount}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary)' }}>
                      {job.actionsCount}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {job.completedAt ? new Date(job.completedAt).toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {job.report ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownloadReport(job.jobId) }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                            background: 'rgba(57,101,255,0.08)', border: '1px solid rgba(57,101,255,0.15)', color: '#3965FF', cursor: 'pointer',
                          }}
                        >
                          <Download size={11} /> PDF
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing {paginated.length} of {filtered.length} jobs
            </span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ width: 30, height: 30, borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', color: 'var(--text-muted)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              ><ChevronLeft size={14} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{
                  width: 30, height: 30, borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                  border: page === p ? 'none' : '1px solid var(--border)',
                  background: page === p ? '#3965FF' : '#fff',
                  color: page === p ? '#fff' : 'var(--text-muted)', cursor: 'pointer',
                }}>{p}</button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ width: 30, height: 30, borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', color: 'var(--text-muted)', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              ><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>

        {/* Detail Card — opens on click */}
        {selectedJob && (
          <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: 'fit-content', position: 'sticky', top: '84px' }}>
            {/* Header */}
            <div style={{
              padding: '18px 20px', borderBottom: '1px solid var(--border)',
              background: 'linear-gradient(135deg, #1B2559, #2B3674)',
              borderRadius: '16px 16px 0 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{selectedJob.jobId}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Pipeline Job Details</div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={{
                  width: 30, height: 30, borderRadius: '8px',
                  background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={14} color="#fff" />
              </button>
            </div>

            {/* Stats row */}
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', borderBottom: '1px solid var(--border)' }}>
              {[
                { label: 'Logs', value: selectedJob.totalLogs.toLocaleString(), icon: <BarChart3 size={12} color="#3965FF" /> },
                { label: 'Findings', value: String(selectedJob.findingsCount), icon: <AlertTriangle size={12} color="#EE5D50" /> },
                { label: 'Actions', value: String(selectedJob.actionsCount), icon: <Shield size={12} color="#05CD99" /> },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '10px', background: '#F7F9FC', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>{s.icon}<span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.label}</span></div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Job Info */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status</span>
                <span style={{
                  padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                  background: `${JOB_STATUS_COLORS[selectedJob.status]}12`,
                  color: JOB_STATUS_COLORS[selectedJob.status],
                }}>{JOB_STATUS_LABELS[selectedJob.status]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Window</span>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {new Date(selectedJob.windowFrom).toLocaleTimeString()} — {new Date(selectedJob.windowTo).toLocaleTimeString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Created</span>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {new Date(selectedJob.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Domain Stats */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '10px' }}>DOMAIN BREAKDOWN</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedJob.domainStats.map(ds => {
                  const color = DOMAIN_COLORS[ds.domain]
                  const maxLogs = Math.max(...selectedJob.domainStats.map(s => s.logsProcessed))
                  const pct = maxLogs > 0 ? (ds.logsProcessed / maxLogs) * 100 : 0
                  return (
                    <div key={ds.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{DOMAIN_LABELS[ds.domain]}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {ds.logsProcessed.toLocaleString()} logs
                        </span>
                      </div>
                      <div style={{ height: '5px', borderRadius: '3px', background: '#F0F4F8', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: '3px', background: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Findings list */}
            {selectedJob.findings.length > 0 && (
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '10px' }}>FINDINGS ({selectedJob.findings.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedJob.findings.map(f => {
                    const sev = SEV_COLORS[f.severity]
                    return (
                      <div key={f.id} style={{
                        padding: '10px 12px', borderRadius: '10px',
                        background: '#F7F9FC', border: '1px solid var(--border)',
                        borderLeft: `3px solid ${sev.color}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {f.findingId} — {f.classification.replace(/_/g, ' ')}
                          </span>
                          <span style={{
                            fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                            background: sev.bg, color: sev.color, textTransform: 'uppercase',
                          }}>{f.severity}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f.summary}</p>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                          {f.offender.type}: {f.offender.value} · conf: {(f.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Actions in this job */}
            {selectedJob.actions.length > 0 && (
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '10px' }}>ACTIONS TAKEN ({selectedJob.actions.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedJob.actions.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', background: '#F7F9FC' }}>
                      <CheckCircle size={12} color="#05CD99" />
                      <span style={{ fontSize: '11px', color: 'var(--text-primary)', flex: 1 }}>{a.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download button */}
            <div style={{ padding: '16px 20px' }}>
              <button
                onClick={() => handleDownloadReport(selectedJob.jobId)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px',
                  background: 'var(--navy)', border: 'none', color: '#fff',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(27, 37, 89, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <Download size={14} /> Download Full Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Daily Briefing */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>✨</span> AI Daily Security Brief
          </h3>
          <div style={{
            fontSize: '10px', fontWeight: 600, padding: '4px 10px',
            background: 'rgba(117,81,255,0.08)', border: '1px solid rgba(117,81,255,0.15)',
            borderRadius: '8px', color: '#7551FF',
          }}>LATEST GENERATED</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Daily Security Summary (English)</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Network activity has remained normal over the last 24 hours. However, a slight increase in suspicious
              scanning attempts on Port 443 was observed. All critical systems remain secure and operational. No major
              security breaches reported.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <span style={{ fontSize: '10px', background: 'rgba(5,205,153,0.08)', color: '#05CD99', padding: '4px 10px', borderRadius: '6px', fontWeight: 600, border: '1px solid rgba(5,205,153,0.15)' }}>Secure</span>
              <span style={{ fontSize: '10px', background: 'rgba(57,101,255,0.08)', color: '#3965FF', padding: '4px 10px', borderRadius: '6px', fontWeight: 600, border: '1px solid rgba(57,101,255,0.15)' }}>Stable</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>AI Briefing Shortcuts</h4>
            <button style={{
              width: '100%', padding: '11px 14px', background: '#F7F9FC', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-primary)', fontSize: '12px', textAlign: 'left', marginBottom: '8px',
              display: 'flex', justifyContent: 'space-between', cursor: 'pointer',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} color="var(--text-muted)" /> Generate Audio Briefing</span>
              <span style={{ fontSize: '10px', background: '#E1E6EF', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>MP3</span>
            </button>
            <button style={{
              width: '100%', padding: '11px 14px', background: '#F7F9FC', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-primary)', fontSize: '12px', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', cursor: 'pointer',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={13} color="var(--text-muted)" /> Email Summary to Executive Board</span>
              <span style={{ fontSize: '10px', background: '#E1E6EF', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-secondary)', fontWeight: 600 }}>Draft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
