import type { Action } from '../../types/schema'
import { ACTION_TYPE_LABELS, ACTION_STATUS_COLORS, DOMAIN_COLORS } from '../../types/schema'
import { CheckCircle, AlertTriangle, Clock, Loader } from 'lucide-react'

interface AutomatedActionsProps {
  actions: Action[]
}

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

export default function AutomatedActions({ actions }: AutomatedActionsProps) {
  return (
    <div className="card" style={{ padding: '20px', height: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Actions</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Autonomous remediation log</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {actions.slice(0, 5).map(action => {
          const statusColor = ACTION_STATUS_COLORS[action.status]
          const StatusIcon = STATUS_ICONS[action.status]
          const domainColor = DOMAIN_COLORS[action.domain]
          return (
            <div key={action.id} style={{
              background: '#F7F9FC',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '10px',
                background: `${statusColor}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '14px',
              }}>
                {ACTION_EMOJI[action.actionType] ?? '⚡'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ACTION_TYPE_LABELS[action.actionType]}
                  </span>
                  <span style={{
                    padding: '1px 6px', borderRadius: '4px',
                    background: `${domainColor}12`, fontSize: '9px', color: domainColor, fontWeight: 600,
                  }}>{action.domain}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {action.description}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {new Date(action.createdAt).toLocaleTimeString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <StatusIcon size={9} color={statusColor} />
                    <span style={{ fontSize: '10px', color: statusColor, fontWeight: 600 }}>{action.status}</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
