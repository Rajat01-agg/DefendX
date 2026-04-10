import AttackVolumeChart from '../components/charts/AttackVolumeChart'
import FindingsFeed from '../components/dashboard/IncidentFeed'
import AutomatedActions from '../components/dashboard/AutomatedActions'
import PortalStatusTable from '../components/dashboard/PortalStatusTable'
import { apiClient } from '../api/client'
import { DOMAIN_LABELS, DOMAIN_COLORS, JOB_STATUS_COLORS, JOB_STATUS_LABELS, type GlobalStat, type DomainStat, type Job } from '../types/schema'
import type { Domain } from '../types/schema'
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Layers, ShieldCheck, BarChart3 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [globalStat, setGlobalStat] = useState<GlobalStat | null>(null)
  const [domainBreakdown, setDomainBreakdown] = useState<DomainStat[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiClient.getDashboard()
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
  }, [])

  if (loading || !globalStat) {
    return <div>Loading...</div>
  }

  const g = globalStat
  const critActive = recentJobs.flatMap(j => j.findings).filter(f => f.severity === 'critical').length
  const highActive = recentJobs.flatMap(j => j.findings).filter(f => f.severity === 'high').length

  // Domain pie data
  const domainPieData = (['http', 'auth', 'infra'] as Domain[]).map(d => ({
    name: DOMAIN_LABELS[d],
    value: domainBreakdown.find(db => db.domain === d)?.findingsCount || 0,
    color: DOMAIN_COLORS[d],
  }))

  // Severity breakdown for card
  const allFindings = recentJobs.flatMap(j => j.findings)
  const sevBreakdown = [
    { label: 'Critical', count: critActive, color: '#E31A1A' },
    { label: 'High', count: highActive, color: '#E09B30' },
    { label: 'Medium', count: allFindings.filter(f => f.severity === 'medium').length, color: '#7551FF' },
    { label: 'Low', count: allFindings.filter(f => f.severity === 'low').length, color: '#3965FF' },
  ]

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
            sub: `${mockJobs.filter(j => j.status !== 'COMPLETED').length} active since 09:00`,
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
        <AttackVolumeChart />
        <FindingsFeed findings={allFindings} />
      </div>

      {/* Portal Status + Threat Domain Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
        <PortalStatusTable />

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
        <AutomatedActions actions={recentJobs.flatMap(j => j.actions)} />

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers size={16} color="#7551FF" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Pipeline Jobs</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockJobs.map(job => {
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
