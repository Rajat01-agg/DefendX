import { useMockWebSocket } from '../hooks/useMockWebSocket'
import TelemetryStream from '../components/live/TelemetryStream'
import CommanderAgent from '../components/live/CommanderAgent'
import RemediationEngine from '../components/live/RemediationEngine'
import { mockGlobalStat } from '../data/mockData'

const STATUS_BAR = [
  { label: 'PIPELINE', value: 'AUTONOMOUS', color: '#00FF88' },
  { label: 'TOTAL_JOBS', value: mockGlobalStat.totalJobs.toString(), color: '#00D4FF' },
  { label: 'FINDINGS', value: mockGlobalStat.totalFindings.toString(), color: '#FFB800' },
  { label: 'ACTIONS', value: mockGlobalStat.totalActions.toString(), color: '#00FF88' },
  { label: 'AVG_LATENCY', value: '< 3s', color: '#8B5CF6' },
]

export default function LiveActivityPage() {
  const { logs, connected, sources } = useMockWebSocket()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px - 48px)', gap: '0' }}>
      {/* Main 3-column grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 280px 280px',
        gap: '16px',
        flex: 1,
        minHeight: 0,
      }}>
        {/* Left: Telemetry Stream (Log Ingestion via Grafana Loki / Webhooks) */}
        <TelemetryStream logs={logs} connected={connected} sources={sources} />

        {/* Center: Commander Agent (Classifies findings → JSON output) */}
        <CommanderAgent />

        {/* Right: Remediation Engine (Executes actions via APIs) */}
        <RemediationEngine />
      </div>

      {/* Bottom Status Bar — shows global pipeline stats */}
      <div style={{
        marginTop: '12px',
        background: '#080B14',
        border: '1px solid #1E2D4A',
        borderRadius: '8px',
        padding: '8px 16px',
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        {STATUS_BAR.map(({ label, value, color }) => (
          <div key={label} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'block' }} className="pulse-dot" />
            <span style={{ fontSize: '10px', color: '#4A5568', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.5px' }}>
              {label}:
            </span>
            <span style={{ fontSize: '10px', color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
