import AttackVolumeChart from '../components/charts/AttackVolumeChart'
import FindingsFeed from '../components/dashboard/IncidentFeed'
import AutomatedActions from '../components/dashboard/AutomatedActions'
import PortalStatusTable from '../components/dashboard/PortalStatusTable'
import { apiClient } from '../api/client'
import { DOMAIN_LABELS, DOMAIN_COLORS, JOB_STATUS_COLORS, JOB_STATUS_LABELS, type GlobalStat, type DomainStat, type Job } from '../types/schema'
import type { Domain } from '../types/schema'
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Layers, ShieldCheck, BarChart3 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useEffect, useMemo, useState } from 'react'

export default function DashboardPage() {
  const [globalStat, setGlobalStat] = useState<GlobalStat | null>(null)
  const [domainBreakdown, setDomainBreakdown] = useState<DomainStat[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchDashboard = async () => {
      try {
        const data = await apiClient.getDashboard()
        if (cancelled) return
        setGlobalStat(data.globalStat)
        setDomainBreakdown(data.domainBreakdown)
        setRecentJobs(data.recentJobs)
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
        // Fallback to mock data if API fails
        // For now, keep as is
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()

    const interval = setInterval(fetchDashboard, 10000)
    const handleFocus = () => {
      void fetchDashboard()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      cancelled = true
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const derivedGlobalStat: GlobalStat = {
    id: 'derived',
    totalJobs: recentJobs.length,
    totalLogs: recentJobs.reduce((sum, job) => sum + (job.totalLogs || 0), 0),
    totalFindings: recentJobs.reduce((sum, job) => sum + (job.findingsCount || 0), 0),
    totalActions: recentJobs.reduce((sum, job) => sum + (job.actionsCount || 0), 0),
    lastUpdated: new Date().toISOString(),
  }

  const g = globalStat ?? derivedGlobalStat

  const normalizedDomainBreakdown = useMemo(() => {
    const acc: Record<Domain, { domain: Domain; logsProcessed: number; findingsCount: number; actionsCount: number }> = {
      http: { domain: 'http', logsProcessed: 0, findingsCount: 0, actionsCount: 0 },
      auth: { domain: 'auth', logsProcessed: 0, findingsCount: 0, actionsCount: 0 },
      infra: { domain: 'infra', logsProcessed: 0, findingsCount: 0, actionsCount: 0 },
    }

    for (const entry of (domainBreakdown as unknown as any[])) {
      const domain = entry.domain as Domain
      if (!domain || !acc[domain]) continue

      if (entry._sum) {
        acc[domain].logsProcessed = entry._sum.logsProcessed ?? 0
        acc[domain].findingsCount = entry._sum.findingsCount ?? 0
        acc[domain].actionsCount = entry._sum.actionsCount ?? 0
      } else {
        acc[domain].logsProcessed = entry.logsProcessed ?? 0
        acc[domain].findingsCount = entry.findingsCount ?? 0
        acc[domain].actionsCount = entry.actionsCount ?? 0
      }
    }

    return [acc.http, acc.auth, acc.infra]
  }, [domainBreakdown])

  const critActive = recentJobs.flatMap(j => j.findings || []).filter(f => f.severity === 'critical').length
  const highActive = recentJobs.flatMap(j => j.findings || []).filter(f => f.severity === 'high').length

  const allFindings = recentJobs.flatMap(j => j.findings || [])

  const chartSeries = useMemo(() => {
    return [...recentJobs]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((job) => ({
        time: new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        logsIngested: job.totalLogs || 0,
        findingsDetected: job.findingsCount || 0,
      }))
  }, [recentJobs])

  const threatVectors = useMemo(() => {
    const counts = new Map<string, number>()

    for (const finding of allFindings) {
      const name = finding.classification.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      counts.set(name, (counts.get(name) || 0) + 1)
    }

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [allFindings])

  const portalRows = useMemo(() => {
    return (['http', 'auth', 'infra'] as Domain[]).map((domain) => {
      const stats = normalizedDomainBreakdown.find((item) => item.domain === domain)
      const findingsInDomain = allFindings.filter((finding) => finding.domain === domain)
      const criticalCount = findingsInDomain.filter((finding) => finding.severity === 'critical').length
      const highCount = findingsInDomain.filter((finding) => finding.severity === 'high').length

      const status: 'normal' | 'risk' | 'attack' = criticalCount > 0
        ? 'attack'
        : (highCount > 0 || (stats?.findingsCount ?? 0) > 0)
          ? 'risk'
          : 'normal'

      return {
        name: DOMAIN_LABELS[domain],
        status,
        traffic: `${(stats?.logsProcessed ?? 0).toLocaleString()} logs`,
        latency: 'N/A',
        activity: `${stats?.findingsCount ?? 0} findings / ${stats?.actionsCount ?? 0} actions`,
      }
    })
  }, [allFindings, normalizedDomainBreakdown])

  // Domain pie data
  const domainPieData = (['http', 'auth', 'infra'] as Domain[]).map(d => ({
    name: DOMAIN_LABELS[d],
    value: normalizedDomainBreakdown.find(db => db.domain === d)?.findingsCount || 0,
    color: DOMAIN_COLORS[d],
  }))

  // Severity breakdown for card
  const sevBreakdown = [
    { label: 'Critical', count: critActive, color: '#E31A1A' },
    { label: 'High', count: highActive, color: '#E09B30' },
    { label: 'Medium', count: allFindings.filter(f => f.severity === 'medium').length, color: '#7551FF' },
    { label: 'Low', count: allFindings.filter(f => f.severity === 'low').length, color: '#3965FF' },
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          {
            label: 'TOTAL SIGNALS',
            value: g.totalLogs.toLocaleString(),
            sub: `+12% vs last 24h`,
            trend: true,
            accentColor: '#3965FF',
            icon: <BarChart3 size={18} color="#3965FF" />,
          },
          {
            label: 'CRITICAL ACTIVE',
            value: String(critActive).padStart(2, '0'),
            sub: critActive > 0 ? '⚠ Immediate Action Required' : 'All Clear',
            trend: false,
            accentColor: '#EE5D50',
            icon: <AlertTriangle size={18} color="#EE5D50" />,
          },
          {
            label: 'CONTAINED TODAY',
            value: g.totalActions.toLocaleString(),
            sub: `98.2% containment rate`,
            trend: true,
            accentColor: '#05CD99',
            icon: <CheckCircle size={18} color="#05CD99" />,
          },
          {
            label: 'PENDING REVIEW',
            value: String(g.totalJobs).padStart(2, '0'),
            sub: `${recentJobs.filter(j => j.status !== 'COMPLETED').length} active since 09:00`,
            trend: false,
            accentColor: '#7551FF',
            icon: <Clock size={18} color="#7551FF" />,
          },
        ].map(({ label, value, sub, trend, accentColor, icon }) => (
          <div key={label} className="card" style={{ padding: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
              <div style={{
                width: 38, height: 38, borderRadius: '12px',
                background: `${accentColor}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {icon}
              </div>
            </div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '8px' }}>
              {value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {trend && <TrendingUp size={12} color={accentColor} />}
              <span style={{ fontSize: '12px', color: accentColor === '#EE5D50' ? '#EE5D50' : 'var(--text-secondary)', fontWeight: 500 }}>{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Live Incident Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        <AttackVolumeChart data={chartSeries} vectors={threatVectors} />
        <FindingsFeed findings={allFindings} />
      </div>

      {/* Portal Status + Threat Domain Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
        <PortalStatusTable rows={portalRows} />

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShieldCheck size={16} color="#3965FF" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Threat Domain Breakdown</h3>
          </div>

          {/* Donut Chart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: 130, height: 130, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={domainPieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {domainPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>100%</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>SCOPED</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {domainPieData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '3px', background: d.color, display: 'block' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{d.value} findings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Breakdown */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '10px' }}>SEVERITY BREAKDOWN</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {sevBreakdown.map(s => (
                <div key={s.label} style={{
                  flex: 1, padding: '8px 10px', borderRadius: '10px',
                  background: `${s.color}0D`, textAlign: 'center',
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Actions + Recent Jobs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <AutomatedActions actions={recentJobs.flatMap(j => j.actions || [])} />

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers size={16} color="#7551FF" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Pipeline Jobs</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentJobs.map(job => {
              const statusColor = JOB_STATUS_COLORS[job.status]
              return (
                <div key={job.id} style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px',
                  padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-accent)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                      {job.jobId}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {job.totalLogs.toLocaleString()} logs → {job.findingsCount} findings → {job.actionsCount} actions
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                    background: `${statusColor}15`, color: statusColor,
                  }}>
                    {JOB_STATUS_LABELS[job.status]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
