import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import { mockChartData } from '../../data/mockData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(27,37,89,0.08)',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, marginBottom: '2px' }}>
          {p.name}: <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  )
}

const barData = [
  { name: 'Brute Force', count: 142 },
  { name: 'SQL Injection', count: 84 },
  { name: 'DDoS', count: 56 },
  { name: 'Port Scan', count: 22 },
  { name: 'XSS', count: 12 },
]

export default function AttackVolumeChart() {
  return (
    <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Incidents — Last 24 Hours
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Hourly aggregation categorized by severity level
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 3, background: '#3965FF', borderRadius: 2, display: 'block' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Logs Ingested</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 3, background: '#EE5D50', borderRadius: 2, display: 'block' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Findings Detected</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 220, marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3965FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3965FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EE5D50" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EE5D50" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: '#A3AED0', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#A3AED0', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="logsIngested"
              name="Logs Ingested"
              stroke="#3965FF"
              strokeWidth={2}
              fill="url(#gradCyan)"
            />
            <Area
              type="monotone"
              dataKey="findingsDetected"
              name="Findings Detected"
              stroke="#EE5D50"
              strokeWidth={1.5}
              fill="url(#gradRed)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Top Threat Vectors</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last 24 Hours</span>
        </div>
        <div style={{ height: '140px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={85} axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 10, fontWeight: 500 }} />
              <Tooltip cursor={{ fill: 'rgba(57,101,255,0.05)' }} content={<CustomTooltip />} />
              <Bar dataKey="count" name="Incidents" fill="#3965FF" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
