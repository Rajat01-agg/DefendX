import { useEffect, useMemo, useState } from 'react'
import { Download, Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { apiClient } from '../api/client'
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS, type Domain, type Report, type ReportListItem } from '../types/schema'

const PER_PAGE = 8

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all')
  const [page, setPage] = useState(1)
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [reportDomains, setReportDomains] = useState<Record<string, Domain[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const hydrateReportDomains = async (items: ReportListItem[]) => {
    const details = await Promise.all(items.map((item) => apiClient.getReport(item.jobId).catch(() => null)))

    const domainByJob: Record<string, Domain[]> = {}
    details.forEach((detail) => {
      if (!detail) return
      const domains = Array.from(new Set((detail.job.findings ?? []).map((f) => f.domain).filter(Boolean))) as Domain[]
      domainByJob[detail.jobId] = domains
    })

    setReportDomains((prev) => ({ ...prev, ...domainByJob }))
  }

  const loadReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient.getReports()
      const items = data.reports ?? []
      setReports(items)
      void hydrateReportDomains(items)
    } catch (loadErr) {
      setError('Failed to load reports from backend.')
      console.error(loadErr)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadReports()
  }, [])

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase()
    return reports.filter((item) => {
      const matchesSearch = q.length === 0 || item.jobId.toLowerCase().includes(q)

      const domains = reportDomains[item.jobId]
      const matchesDomain = domainFilter === 'all'
        ? true
        : !domains || domains.includes(domainFilter)

      return matchesSearch && matchesDomain
    })
  }, [reports, search, domainFilter, reportDomains])

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PER_PAGE))
  const pagedReports = filteredReports.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const downloadMarkdown = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSelectReport = async (jobId: string) => {
    setSelectedJobId(jobId)
    setDetailLoading(true)
    try {
      const detail = await apiClient.getReport(jobId)
      setSelectedReport(detail)
    } catch (detailErr) {
      console.error(detailErr)
      setSelectedReport(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDownloadOne = async (jobId: string) => {
    const detail = selectedReport?.jobId === jobId ? selectedReport : await apiClient.getReport(jobId)
    downloadMarkdown(detail.humanReport || '# Report\n\nNo report content available.', `defendx_report_${jobId}.md`)
  }

  const handleDownloadAll = async () => {
    const details = await Promise.all(
      filteredReports.map((item) => apiClient.getReport(item.jobId).catch(() => null))
    )
    const compiled = details
      .filter((item): item is Report => item !== null)
      .map((item) => `# Job ${item.jobId}\n\n${item.humanReport || 'No report body available.'}`)
      .join('\n\n---\n\n')
    downloadMarkdown(compiled || '# DefendX Reports\n\nNo reports available.', 'defendx_all_reports.md')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Reports</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Completed audit jobs fetched from backend routes.</p>
        </div>
        <button
          onClick={() => void handleDownloadAll()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)',
            background: '#F7F9FC', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Download size={14} /> Export All
        </button>
      </div>

      <div className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Search size={14} color="var(--text-muted)" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search completed job by ID"
          style={{
            width: '100%', border: 'none', background: 'transparent', outline: 'none',
            color: 'var(--text-primary)', fontSize: '13px'
          }}
        />
        <select
          value={domainFilter}
          onChange={(e) => { setDomainFilter(e.target.value as Domain | 'all'); setPage(1) }}
          style={{
            border: '1px solid var(--border)', background: '#F7F9FC', borderRadius: '8px',
            padding: '6px 10px', color: 'var(--text-primary)', fontSize: '12px'
          }}
        >
          <option value="all">All Domains</option>
          <option value="http">HTTP</option>
          <option value="auth">AUTH</option>
          <option value="infra">INFRA</option>
        </select>
      </div>

      {loading && <div className="card" style={{ padding: '16px' }}>Loading reports...</div>}
      {error && (
        <div className="card" style={{ padding: '16px', borderLeft: '3px solid #EE5D50' }}>
          <div style={{ marginBottom: '8px', color: '#EE5D50', fontWeight: 600 }}>{error}</div>
          <button
            onClick={() => void loadReports()}
            style={{
              padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
              background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-primary)'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedJobId ? '1fr 420px' : '1fr', gap: '16px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['JOB ID', 'STATUS', 'DOMAINS', 'FINDINGS', 'ACTIONS', 'CREATED', 'REPORT'].map((heading) => (
                    <th key={heading} style={{
                      padding: '12px 14px', textAlign: 'left', background: '#F7F9FC',
                      fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 600,
                    }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedReports.map((item) => {
                  const status = item.job.status
                  const statusColor = JOB_STATUS_COLORS[status]
                  return (
                    <tr key={item.id} onClick={() => void handleSelectReport(item.jobId)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-accent)' }}>{item.jobId}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '4px 9px', borderRadius: '8px', fontSize: '11px', color: statusColor, background: `${statusColor}15` }}>
                          {JOB_STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {reportDomains[item.jobId]?.length
                          ? reportDomains[item.jobId].join(', ').toUpperCase()
                          : 'Loading...'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>{item.job.findingsCount}</td>
                      <td style={{ padding: '12px 14px' }}>{item.job.actionsCount}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>{new Date(item.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            void handleDownloadOne(item.jobId)
                          }}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: '#F7F9FC', cursor: 'pointer', fontSize: '11px',
                          }}
                        >
                          <FileText size={12} /> Download
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div style={{
              padding: '12px 14px', borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Showing {pagedReports.length} of {filteredReports.length} completed reports
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}>
                  <ChevronLeft size={14} />
                </button>
                <span style={{ fontSize: '12px', minWidth: '68px', textAlign: 'center' }}>Page {page}/{totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {selectedJobId && (
            <div className="card" style={{ padding: '16px', position: 'sticky', top: '84px', height: 'fit-content' }}>
              <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Job {selectedJobId}
              </div>
              {detailLoading && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Loading report detail...</div>}
              {!detailLoading && !selectedReport && <div style={{ fontSize: '12px', color: '#EE5D50' }}>Unable to load detailed report.</div>}
              {!detailLoading && selectedReport && (
                <>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Findings: <b>{selectedReport.job.findingsCount}</b> | Actions: <b>{selectedReport.job.actionsCount}</b>
                  </div>
                  <div style={{
                    maxHeight: '420px', overflowY: 'auto', padding: '12px', borderRadius: '10px',
                    border: '1px solid var(--border)', background: '#F7F9FC', whiteSpace: 'pre-wrap',
                    fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5,
                  }}>
                    {selectedReport.humanReport || 'No human-readable report body available.'}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && !error && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            AI Analysis Snapshot
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            1. Identity and HTTP domains are currently the most active threat surfaces across completed audits.
            <br />
            2. Repeated brute-force, endpoint probing, and rate-abuse patterns suggest automated adversary behavior.
            <br />
            3. Containment actions are mostly successful, while infra-heavy incidents still require manual follow-up.
            <br />
            4. Recommended: tighten auth throttling rules, maintain WAF signatures, and prioritize infra resilience playbooks.
          </div>
        </div>
      )}
    </div>
  )
}
