import AttackVolumeChart from '../components/charts/AttackVolumeChart'
import FindingsFeed from '../components/dashboard/IncidentFeed'
import AutomatedActions from '../components/dashboard/AutomatedActions'
import PortalStatusTable from '../components/dashboard/PortalStatusTable'
import { mockGlobalStat, aggregatedDomainStats, mockJobs } from '../data/mockData'
import { DOMAIN_LABELS, DOMAIN_COLORS, JOB_STATUS_COLORS, JOB_STATUS_LABELS } from '../types/schema'
import type { Domain } from '../types/schema'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Globe, HardDrive, Zap, Layers } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  sub: string
  trend?: 'up' | 'down'
  trendLabel?: string
  accentColor: string
  icon: React.ReactNode
}

function MetricCard({ label, value, sub, trend, trendLabel, accentColor, icon }: MetricCardProps) {
  return (
    <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '1px', fontWeight: 600 }}>{label}</div>
        <div style={{
          width: 32, height: 32, borderRadius: '8px',
          background: `${accentColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: '#E8EAF0', lineHeight: 1, marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {trend && (
          <span style={{ color: trend === 'up' ? accentColor : '#FF2D55', display: 'flex', alignItems: 'center', gap: '2px' }}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span style={{ fontSize: '11px', fontWeight: 600 }}>{trendLabel}</span>
          </span>
        )}
        <span style={{ fontSize: '11px', color: '#4A5568' }}>{sub}</span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${accentColor}44, transparent)` }} />
    </div>
  )
}

const BOTTOM_STATS = [
  { label: 'NETWORK LOAD', value: '4.2 GB/s', icon: <Globe size={20} color="#00D4FF" />, color: '#00D4FF' },
  { label: 'GLOBAL NODES', value: '12 / 12', icon: <Zap size={20} color="#00FF88" />, color: '#00FF88' },
  { label: 'STORAGE REDUNDANCY', value: '99.99%', icon: <HardDrive size={20} color="#8B5CF6" />, color: '#8B5CF6' },
]

export default function DashboardPage() {
  const g = mockGlobalStat

  // Compute active critical findings
  const critActive = 2 // from mock — in production this comes from API

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top metrics — from GlobalStat */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <MetricCard
          label="TOTAL LOGS PROCESSED"
          value={g.totalLogs.toLocaleString()}
          sub={`Across ${g.totalJobs} jobs`}
          trend="up"
          trendLabel="12%"
          accentColor="#00D4FF"
          icon={<Layers size={16} color="#00D4FF" />}
        />
        <MetricCard
          label="TOTAL FINDINGS"
          value={g.totalFindings.toLocaleString()}
          sub="Detected by Commander Agent"
          accentColor="#FF2D55"
          icon={<AlertTriangle size={16} color="#FF2D55" />}
        />
        <MetricCard
          label="TOTAL ACTIONS TAKEN"
          value={g.totalActions.toLocaleString()}
          sub="Autonomously remediated"
          trend="up"
          trendLabel="↑"
          accentColor="#00FF88"
          icon={<CheckCircle size={16} color="#00FF88" />}
        />
        <MetricCard
          label="TOTAL JOBS"
          value={g.totalJobs.toLocaleString()}
          sub="Pipeline executions"
          accentColor="#8B5CF6"
          icon={<Clock size={16} color="#8B5CF6" />}
        />
      </div>

      {/* Chart + Automated Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
        <AttackVolumeChart />
        <AutomatedActions />
      </div>

      {/* Findings Feed + Domain Breakdown + Recent Jobs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FindingsFeed />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Domain Breakdown — from DomainStat */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Layers size={16} color="#00D4FF" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0' }}>Threat Domain Breakdown</h3>
            </div>
            {(['http', 'auth', 'infra'] as Domain[]).map(domain => {
              const stat = aggregatedDomainStats[domain]
              const color = DOMAIN_COLORS[domain]
              const totalLogs = mockGlobalStat.totalLogs
              const pct = ((stat.logsProcessed / totalLogs) * 100).toFixed(1)
              return (
                <div key={domain} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '2px', background: color, display: 'block',
                      }} />
                      <span style={{ fontSize: '12px', color: '#E8EAF0', fontWeight: 500 }}>{DOMAIN_LABELS[domain]}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#6B7280', fontFamily: 'JetBrains Mono, monospace' }}>
                        {stat.findingsCount} findings
                      </span>
                      <span style={{ fontSize: '10px', color: '#6B7280', fontFamily: 'JetBrains Mono, monospace' }}>
                        {stat.actionsCount} actions
                      </span>
                      <span style={{ fontSize: '11px', color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                        {pct}%
                      </span>
                    </div>
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

          {/* Recent Jobs */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0', marginBottom: '12px' }}>Recent Jobs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mockJobs.map(job => {
                const statusColor = JOB_STATUS_COLORS[job.status]
                return (
                  <div key={job.id} style={{
                    background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '8px',
                    padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#00D4FF', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                        {job.jobId}
                      </span>
                      <span style={{ fontSize: '11px', color: '#4A5568', marginLeft: '10px' }}>
                        {job.totalLogs.toLocaleString()} logs → {job.findingsCount} findings → {job.actionsCount} actions
                      </span>
                    </div>
                    <span style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                      background: `${statusColor}18`, color: statusColor, letterSpacing: '0.5px',
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

      {/* Portal Status */}
      <PortalStatusTable />

      {/* Bottom stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {BOTTOM_STATS.map(({ label, value, icon, color }) => (
          <div key={label} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '8px' }}>{label}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#E8EAF0' }}>{value}</div>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: '12px',
              background: `${color}18`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
