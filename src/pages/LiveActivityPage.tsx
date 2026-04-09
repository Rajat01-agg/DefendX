import { useState, useCallback } from 'react'
import { useMockWebSocket } from '../hooks/useMockWebSocket'
import TelemetryStream from '../components/live/TelemetryStream'
import CommanderAgent from '../components/live/CommanderAgent'
import RemediationEngine from '../components/live/RemediationEngine'
import { mockGlobalStat } from '../data/mockData'
import { Play, Square, ChevronDown, Clock, Timer, Zap, Activity, Settings2 } from 'lucide-react'

const TIME_PRESETS = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '6 hours', value: 360 },
  { label: '12 hours', value: 720 },
  { label: '24 hours', value: 1440 },
]

const STATUS_BAR = [
  { label: 'PIPELINE', value: 'AUTONOMOUS', color: '#05CD99' },
  { label: 'TOTAL_JOBS', value: mockGlobalStat.totalJobs.toString(), color: '#3965FF' },
  { label: 'FINDINGS', value: mockGlobalStat.totalFindings.toString(), color: '#FFB547' },
  { label: 'ACTIONS', value: mockGlobalStat.totalActions.toString(), color: '#05CD99' },
  { label: 'AVG_LATENCY', value: '< 3s', color: '#7551FF' },
]

export default function LiveActivityPage() {
  const { logs, connected, sources } = useMockWebSocket()

  // Audit control state
  const [showAuditPanel, setShowAuditPanel] = useState(false)
  const [selectedMinutes, setSelectedMinutes] = useState(15)
  const [customMinutes, setCustomMinutes] = useState('')
  const [auditRunning, setAuditRunning] = useState(false)
  const [auditElapsed, setAuditElapsed] = useState(0)
  const [auditTimerId, setAuditTimerId] = useState<ReturnType<typeof setInterval> | null>(null)

  const handleStartAudit = useCallback(() => {
    const minutes = customMinutes ? parseInt(customMinutes, 10) : selectedMinutes
    if (!minutes || minutes <= 0) return

    setAuditRunning(true)
    setAuditElapsed(0)
    setShowAuditPanel(false)

    // Tick every second to show elapsed time
    const id = setInterval(() => {
      setAuditElapsed(prev => {
        const next = prev + 1
        if (next >= minutes * 60) {
          clearInterval(id)
          setAuditRunning(false)
          return 0
        }
        return next
      })
    }, 1000)
    setAuditTimerId(id)
  }, [selectedMinutes, customMinutes])

  const handleStopAudit = useCallback(() => {
    if (auditTimerId) clearInterval(auditTimerId)
    setAuditRunning(false)
    setAuditElapsed(0)
    setAuditTimerId(null)
  }, [auditTimerId])

  const totalSeconds = (customMinutes ? parseInt(customMinutes, 10) : selectedMinutes) * 60
  const progressPct = totalSeconds > 0 ? (auditElapsed / totalSeconds) * 100 : 0
  const elapsedMin = Math.floor(auditElapsed / 60)
  const elapsedSec = auditElapsed % 60

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px - 48px)', gap: '0' }}>

      {/* ─── Audit Control Bar ─── */}
      <div style={{ marginBottom: '12px', flexShrink: 0 }}>
        <div className="card" style={{
          padding: '0',
          borderRadius: '14px',
          overflow: 'visible',
        }}>
          {/* Main bar */}
          <div style={{
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            {/* Icon + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '10px',
                background: auditRunning ? 'rgba(5,205,153,0.1)' : 'rgba(57,101,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {auditRunning
                  ? <Activity size={16} color="#05CD99" />
                  : <Settings2 size={16} color="#3965FF" />
                }
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {auditRunning ? 'Audit In Progress' : 'Security Audit'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {auditRunning
                    ? `Analyzing logs for ${customMinutes || selectedMinutes} min window`
                    : 'Configure and start a log analysis audit'
                  }
                </div>
              </div>
            </div>

            {/* Running status / progress */}
            {auditRunning && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, padding: '0 20px' }}>
                {/* Time elapsed */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px', background: '#F7F9FC',
                }}>
                  <Timer size={13} color="#3965FF" />
                  <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#3965FF' }}>
                    {String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    / {customMinutes || selectedMinutes}:00
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: '#F0F4F8', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progressPct}%`, height: '100%', borderRadius: '3px',
                    background: 'linear-gradient(90deg, #3965FF, #05CD99)',
                    transition: 'width 1s linear',
                  }} />
                </div>

                {/* Percentage */}
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#05CD99', fontFamily: 'JetBrains Mono, monospace', minWidth: '40px' }}>
                  {progressPct.toFixed(1)}%
                </span>
              </div>
            )}

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              {!auditRunning && (
                <>
                  {/* Duration selector button */}
                  <button
                    onClick={() => setShowAuditPanel(!showAuditPanel)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '10px',
                      background: '#F7F9FC', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Clock size={13} color="var(--text-muted)" />
                    {customMinutes
                      ? `${customMinutes} min`
                      : TIME_PRESETS.find(p => p.value === selectedMinutes)?.label || `${selectedMinutes} min`
                    }
                    <ChevronDown size={13} color="var(--text-muted)" style={{
                      transform: showAuditPanel ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }} />
                  </button>

                  {/* Start Audit button */}
                  <button
                    onClick={handleStartAudit}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 20px', borderRadius: '10px',
                      background: 'var(--navy)', border: 'none',
                      color: '#fff', fontSize: '13px', fontWeight: 700,
                      cursor: 'pointer', letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(27, 37, 89, 0.2)',
                    }}
                  >
                    <Play size={14} fill="#fff" /> Start Audit
                  </button>
                </>
              )}

              {auditRunning && (
                <button
                  onClick={handleStopAudit}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 20px', borderRadius: '10px',
                    background: '#EE5D50', border: 'none',
                    color: '#fff', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer', letterSpacing: '0.5px',
                    boxShadow: '0 4px 12px rgba(238, 93, 80, 0.2)',
                  }}
                >
                  <Square size={12} fill="#fff" /> Stop Audit
                </button>
              )}
            </div>
          </div>

          {/* ─── Dropdown Panel (time presets + custom) ─── */}
          {showAuditPanel && !auditRunning && (
            <div style={{
              borderTop: '1px solid var(--border)',
              padding: '16px 20px',
              display: 'flex', gap: '16px', alignItems: 'flex-start',
              background: '#F7F9FC',
              borderRadius: '0 0 14px 14px',
            }}>
              {/* Presets */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '10px' }}>
                  ANALYSIS WINDOW
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {TIME_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => { setSelectedMinutes(preset.value); setCustomMinutes('') }}
                      style={{
                        padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        border: selectedMinutes === preset.value && !customMinutes ? 'none' : '1px solid var(--border)',
                        background: selectedMinutes === preset.value && !customMinutes ? '#3965FF' : '#fff',
                        color: selectedMinutes === preset.value && !customMinutes ? '#fff' : 'var(--text-primary)',
                        cursor: 'pointer',
                        boxShadow: selectedMinutes === preset.value && !customMinutes ? '0 2px 8px rgba(57,101,255,0.2)' : 'none',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom time input */}
              <div style={{ width: '200px', flexShrink: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '10px' }}>
                  CUSTOM (MINUTES)
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="number"
                    min={1}
                    max={10080}
                    placeholder="e.g. 45"
                    value={customMinutes}
                    onChange={e => setCustomMinutes(e.target.value)}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: '8px',
                      background: '#fff', border: customMinutes ? '2px solid #3965FF' : '1px solid var(--border)',
                      color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600,
                      fontFamily: 'JetBrains Mono, monospace', outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleStartAudit}
                    style={{
                      padding: '8px 14px', borderRadius: '8px',
                      background: '#3965FF', border: 'none', color: '#fff',
                      fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px',
                      boxShadow: '0 2px 8px rgba(57,101,255,0.2)',
                    }}
                  >
                    <Zap size={13} /> Go
                  </button>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Enter time in minutes (1 – 10080)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main 3-column grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 280px 280px',
        gap: '16px',
        flex: 1,
        minHeight: 0,
      }}>
        {/* Left: Telemetry Stream */}
        <TelemetryStream logs={logs} connected={connected} sources={sources} />

        {/* Center: Commander Agent */}
        <CommanderAgent />

        {/* Right: Remediation Engine */}
        <RemediationEngine />
      </div>

      {/* Bottom Status Bar */}
      <div style={{
        marginTop: '12px',
        background: 'linear-gradient(135deg, #1B2559, #111C44)',
        borderRadius: '12px',
        padding: '10px 20px',
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        {STATUS_BAR.map(({ label, value, color }) => (
          <div key={label} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'block' }} className="pulse-dot" />
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.5px' }}>
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
