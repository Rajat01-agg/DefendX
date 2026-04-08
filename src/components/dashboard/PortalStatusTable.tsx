import { mockPortals } from '../../data/mockData'
import { Activity } from 'lucide-react'

const STATUS_MAP = {
  normal: { color: '#00FF88', label: 'Normal', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.2)' },
  risk:   { color: '#FFB800', label: 'Risk',   bg: 'rgba(255,184,0,0.08)',  border: 'rgba(255,184,0,0.2)' },
  attack: { color: '#FF2D55', label: 'Attack', bg: 'rgba(255,45,85,0.08)', border: 'rgba(255,45,85,0.2)' },
}

export default function PortalStatusTable() {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Activity size={16} color="#00D4FF" />
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0' }}>Protected Portals Status</h3>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Service', 'Status', 'Traffic', 'Latency', 'Activity'].map(h => (
              <th key={h} style={{
                padding: '8px 12px',
                textAlign: 'left',
                fontSize: '10px',
                color: '#4A5568',
                letterSpacing: '1px',
                fontWeight: 600,
                borderBottom: '1px solid #1E2D4A',
              }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockPortals.map((portal, i) => {
            const cfg = STATUS_MAP[portal.status]
            return (
              <tr key={i} style={{ borderBottom: '1px solid #111827' }}>
                <td style={{ padding: '10px 12px', fontSize: '13px', color: '#E8EAF0', fontWeight: 500 }}>
                  {portal.name}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '3px 8px', borderRadius: '4px',
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                    fontSize: '11px', fontWeight: 600, color: cfg.color,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, display: 'block' }} className="pulse-dot" />
                    {cfg.label}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#9BA3B8', fontFamily: 'JetBrains Mono, monospace' }}>
                  {portal.traffic}
                </td>
                <td style={{
                  padding: '10px 12px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                  color: portal.status === 'attack' ? '#FF2D55' : portal.status === 'risk' ? '#FFB800' : '#00FF88',
                }}>
                  {portal.latency}
                </td>
                <td style={{ padding: '10px 12px', fontSize: '11px', color: '#6B7280' }}>
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
