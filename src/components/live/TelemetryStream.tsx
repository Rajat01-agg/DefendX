import { useEffect, useRef } from 'react'
import type { LogEvent } from '../../data/mockData'

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EE5D50',
  high: '#FFB547',
  medium: '#F59E0B',
  low: '#3965FF',
  info: 'var(--text-secondary)',
}

const SOURCE_COLORS: Record<string, string> = {
  GRAFANA_LOKI: '#FF9900',
  WEBHOOK: '#EC4899',
  EDR_AGENT: '#3965FF',
  VPC_FLOW: '#7551FF',
  AUTH_SVC: '#EE5D50',
  FIREWALL: '#F59E0B',
  SIEM: '#05CD99',
}

interface TelemetryStreamProps {
  logs: LogEvent[]
  connected: boolean
  sources: number
}

export default function TelemetryStream({ logs, connected, sources }: TelemetryStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  return (
    <div
      style={{
        background: '#050810',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Terminal Header */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#080B14',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', display: 'block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840', display: 'block' }} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1.5px', fontFamily: 'JetBrains Mono, monospace' }}>
            TELEMETRY INGESTION
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: connected ? '#05CD99' : '#EE5D50',
            display: 'block',
          }} className={connected ? 'pulse-dot' : ''} />
          <span style={{ fontSize: '10px', color: connected ? '#05CD99' : '#EE5D50', fontFamily: 'JetBrains Mono, monospace' }}>
            {connected ? '1.26GB/s' : 'CONNECTING...'}
          </span>
        </div>
      </div>

      {/* Log stream */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        lineHeight: '1.7',
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
      }}>
        {logs.map((log) => (
          <div
            key={log.id}
            className="fade-in-up"
            style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}
          >
            <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>{log.timestamp}</span>
            <span style={{
              color: SOURCE_COLORS[log.source] ?? 'var(--text-muted)',
              flexShrink: 0,
              minWidth: '130px',
            }}>
              {log.source}:
            </span>
            {log.severity === 'critical' || log.severity === 'high' ? (
              <span style={{ color: SEVERITY_COLORS[log.severity], fontWeight: 600 }}>
                {log.severity.toUpperCase()}
              </span>
            ) : null}
            <span style={{ color: log.severity === 'critical' ? '#FF8099' : 'var(--text-muted)', flex: 1, wordBreak: 'break-all' }}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
        {/* Cursor */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{'>'}</span>
          <span style={{ display: 'inline-block', width: 8, height: 14, background: '#3965FF', opacity: 0.8 }} className="blink" />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#080B14',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
          SOURCES: <span style={{ color: 'var(--text-muted)' }}>{sources} ACTIVE</span>
        </span>
        <span style={{
          fontSize: '10px',
          fontFamily: 'JetBrains Mono, monospace',
          color: '#3965FF',
          fontWeight: 600,
          letterSpacing: '1px',
        }}>
          SYNCED
        </span>
      </div>
    </div>
  )
}
