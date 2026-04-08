import { mockActions } from '../../data/mockData'
import { ACTION_TYPE_LABELS, ACTION_STATUS_COLORS, DOMAIN_COLORS } from '../../types/schema'
import { CheckCircle, AlertTriangle, Clock, Loader } from 'lucide-react'

const STATUS_ICONS = {
  PENDING: Clock,
  IN_PROGRESS: Loader,
  DONE: CheckCircle,
  FAILED: AlertTriangle,
}

const ACTION_EMOJI: Record<string, string> = {
  block_ip: '🛡️',
  rate_limit: '⚡',
  alert_soc: '📢',
  manual_review: '👁️',
}

export default function AutomatedActions() {
  return (
    <div className="card" style={{ padding: '20px', height: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0' }}>Recent Actions</h3>
        <p style={{ fontSize: '11px', color: '#4A5568', marginTop: '2px' }}>Autonomous remediation log</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {mockActions.slice(0, 5).map(action => {
          const statusColor = ACTION_STATUS_COLORS[action.status]
          const StatusIcon = STATUS_ICONS[action.status]
          const domainColor = DOMAIN_COLORS[action.domain]
          return (
            <div key={action.id} style={{
              background: '#0D1220',
              border: '1px solid #1E2D4A',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: `${statusColor}15`,
                border: `1px solid ${statusColor}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '14px',
              }}>
                {ACTION_EMOJI[action.actionType] ?? '⚡'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>
                    {ACTION_TYPE_LABELS[action.actionType]}
                  </span>
                  <span style={{
                    padding: '1px 5px', borderRadius: '3px',
                    background: `${domainColor}18`, fontSize: '9px', color: domainColor, fontWeight: 600,
                  }}>{action.domain}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {action.description}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#4A5568', fontFamily: 'JetBrains Mono, monospace' }}>
                    {new Date(action.createdAt).toLocaleTimeString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <StatusIcon size={9} color={statusColor} />
                    <span style={{ fontSize: '10px', color: statusColor, fontWeight: 600, letterSpacing: '0.5px' }}>{action.status}</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button style={{
        width: '100%',
        marginTop: '12px',
        padding: '8px',
        background: 'transparent',
        border: '1px solid #1E2D4A',
        borderRadius: '6px',
        color: '#6B7280',
        fontSize: '11px',
        letterSpacing: '0.5px',
        cursor: 'pointer',
      }}>
        VIEW COMPLETE AUDIT TRAIL
      </button>
    </div>
  )
}
