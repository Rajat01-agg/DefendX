import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { mockChartData } from '../../data/mockData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0D1220',
      border: '1px solid #1E2D4A',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
    }}>
      <p style={{ color: '#9BA3B8', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, marginBottom: '2px' }}>
          {p.name}: <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  )
}

export default function AttackVolumeChart() {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#E8EAF0' }}>
            Log Ingestion &amp; Findings Flow (24 Hours)
          </h3>
          <p style={{ fontSize: '12px', color: '#4A5568', marginTop: '2px' }}>
            Grafana Loki + Webhook telemetry aggregation
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 3, background: '#00D4FF', borderRadius: 2, display: 'block' }} />
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Logs Ingested</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 3, background: '#FF2D55', borderRadius: 2, display: 'block' }} />
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Findings Detected</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={mockChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF2D55" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#FF2D55" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: '#4A5568', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#4A5568', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="logsIngested"
            name="Logs Ingested"
            stroke="#00D4FF"
            strokeWidth={2}
            fill="url(#gradCyan)"
          />
          <Area
            type="monotone"
            dataKey="findingsDetected"
            name="Findings Detected"
            stroke="#FF2D55"
            strokeWidth={1.5}
            fill="url(#gradRed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
