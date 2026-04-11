import { Activity } from 'lucide-react'

interface PortalRow {
  name: string
  status: 'normal' | 'risk' | 'attack'
  traffic: string
  latency: string
  activity: string
}

interface PortalStatusTableProps {
  rows: PortalRow[]
}

const STATUS_MAP = {
  normal: { color: '#05CD99', label: 'Normal', bg: 'rgba(5,205,153,0.08)', border: 'rgba(5,205,153,0.2)' },
  risk:   { color: '#FFB547', label: 'Risk',   bg: 'rgba(255,181,71,0.08)',  border: 'rgba(255,181,71,0.2)' },
  attack: { color: '#EE5D50', label: 'Attack', bg: 'rgba(238,93,80,0.08)', border: 'rgba(238,93,80,0.2)' },
}

export default function PortalStatusTable({ rows }: PortalStatusTableProps) {
  const displayRows = rows.length > 0
    ? rows
    : [{ name: 'No Data', status: 'normal' as const, traffic: '0 logs', latency: 'N/A', activity: 'No recent jobs' }]

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Activity size={16} color="#3965FF" />
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Protected Portals Status</h3>
        <div style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>REAL-TIME TELEMETRY</div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Service', 'Status', 'Traffic', 'Latency', 'Activity'].map(h => (
              <th key={h} style={{
                padding: '10px 14px',
                textAlign: 'left',
                fontSize: '10px',
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                fontWeight: 600,
                borderBottom: '1px solid var(--border)',
              }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((portal, i) => {
            const cfg = STATUS_MAP[portal.status]
            return (
              <tr key={i} style={{ borderBottom: i < displayRows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {portal.name}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', borderRadius: '8px',
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                    fontSize: '11px', fontWeight: 600, color: cfg.color,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, display: 'block' }} className="pulse-dot" />
                    {cfg.label}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {portal.traffic}
                </td>
                <td style={{
                  padding: '12px 14px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                  color: portal.status === 'attack' ? '#EE5D50' : portal.status === 'risk' ? '#FFB547' : '#05CD99',
                  fontWeight: 600,
                }}>
                  {portal.latency}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {portal.activity}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
