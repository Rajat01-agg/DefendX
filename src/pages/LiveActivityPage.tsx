import { useState, useCallback, useEffect, useRef } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import TelemetryStream from '../components/live/TelemetryStream'
import CommanderAgent from '../components/live/CommanderAgent'
import RemediationEngine from '../components/live/RemediationEngine'
import type { LogEvent } from '../data/mockData'
import { apiClient } from '../api/client'
import { Play, Square, ChevronDown, Clock, Timer, Zap, Activity, Settings2 } from 'lucide-react'
import type { Job } from '../types/schema'

const LIVE_ACTIVITY_STATE_KEY = 'defendx_live_activity_state'
const TELEMETRY_RENDER_DELAY_MS = 600
const MAX_PROCESSED_MESSAGE_IDS = 1000

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

function toAgentFindingShape(job: Job): any[] {
  const reportFindings = (job.report as any)?.jsonReport?.findings
  if (Array.isArray(reportFindings) && reportFindings.length > 0) {
    return reportFindings
  }

  return (job.findings ?? []).map((f) => ({
    ...f,
    finding_id: (f as any).findingId ?? (f as any).finding_id,
    recommended_action: (f as any).recommended_action ?? ((f as any).actions?.[0]?.description || 'Action executed.'),
  }))
}

export default function LiveActivityPage() {
  const { connected, messages, socketState, reconnectAttempt, connectSocket, disconnectSocket } = useWebSocket()

  const [persistedFindings, setPersistedFindings] = useState<any[]>([])
  const [displayedLogs, setDisplayedLogs] = useState<LogEvent[]>([])
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [finalJobSnapshot, setFinalJobSnapshot] = useState<Job | null>(null)
  const logQueue = useRef<LogEvent[]>([])
  const auditStartTimeRef = useRef<number>(Date.now() - 24 * 60 * 60 * 1000) // default to past
  const processedMessageIds = useRef<Set<string>>(new Set())
  const processedMessageOrder = useRef<string[]>([])
  const hydratedJobs = useRef<Set<string>>(new Set())

  // Audit control state
  const [showAuditPanel, setShowAuditPanel] = useState(false)
  const [showSummaryCard, setShowSummaryCard] = useState(false)
  const [selectedMinutes, setSelectedMinutes] = useState(15)
  const [customMinutes, setCustomMinutes] = useState('')
  const [auditRunning, setAuditRunning] = useState(false)
  const [auditElapsed, setAuditElapsed] = useState(0)
  const [auditTimerId, setAuditTimerId] = useState<ReturnType<typeof setInterval> | null>(null)

  const applyFinalJobSnapshot = useCallback((job: Job) => {
    setFinalJobSnapshot(job)
    setPersistedFindings(toAgentFindingShape(job))
    setAuditTimerId((currentTimerId) => {
      if (currentTimerId) clearInterval(currentTimerId)
      return null
    })
    setAuditRunning(false)
  }, [])

  useEffect(() => {
    const raw = sessionStorage.getItem(LIVE_ACTIVITY_STATE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as {
        displayedLogs?: LogEvent[]
        persistedFindings?: any[]
        activeJobId?: string | null
        finalJobSnapshot?: Job | null
      }
      if (Array.isArray(parsed.displayedLogs)) setDisplayedLogs(parsed.displayedLogs)
      if (Array.isArray(parsed.persistedFindings)) setPersistedFindings(parsed.persistedFindings)
      if (parsed.activeJobId) setActiveJobId(parsed.activeJobId)
      if (parsed.finalJobSnapshot) setFinalJobSnapshot(parsed.finalJobSnapshot)
    } catch {
      sessionStorage.removeItem(LIVE_ACTIVITY_STATE_KEY)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem(
      LIVE_ACTIVITY_STATE_KEY,
      JSON.stringify({ displayedLogs, persistedFindings, activeJobId, finalJobSnapshot })
    )
  }, [displayedLogs, persistedFindings, activeJobId, finalJobSnapshot])

  useEffect(() => {
    if (!auditRunning && !activeJobId) return
    const finalSeconds = (customMinutes ? parseInt(customMinutes, 10) : selectedMinutes) * 60

    const rememberMessageId = (msgId: string) => {
      processedMessageIds.current.add(msgId)
      processedMessageOrder.current.push(msgId)
      if (processedMessageOrder.current.length > MAX_PROCESSED_MESSAGE_IDS) {
        const oldest = processedMessageOrder.current.shift()
        if (oldest) processedMessageIds.current.delete(oldest)
      }
    }

    messages.forEach((message) => {
      const payloadText = typeof message.payload === 'object' ? JSON.stringify(message.payload) : String(message.payload)
      const msgId = `${message.jobId}-${message.state}-${message.timestamp}-${payloadText}`
      if (message.timestamp < auditStartTimeRef.current) return
      if (processedMessageIds.current.has(msgId)) return

      rememberMessageId(msgId)
      setActiveJobId(message.jobId)

      if (message.state === 'ANALYZING' && message.payload?.findings) {
        const payloadFindings = message.payload.findings as any
        const f = payloadFindings.findings || payloadFindings
        if (Array.isArray(f) && f.length > 0) {
          setPersistedFindings(f)
        }
      }

      if (message.state === 'COMPLETED' || message.state === 'ERROR') {
        console.log('[LIVE] Job state:', message.state, '- NOT closing socket, keeping connection alive')
        if (auditTimerId) clearInterval(auditTimerId)
        setAuditTimerId(null)
        setAuditRunning(false)
        if (message.state === 'COMPLETED') setAuditElapsed(finalSeconds)

        if (message.state === 'COMPLETED' && !hydratedJobs.current.has(message.jobId)) {
          hydratedJobs.current.add(message.jobId)
          void apiClient.getJob(message.jobId)
            .then((job) => {
              applyFinalJobSnapshot(job)
            })
            .catch((error) => {
              console.error('Failed to hydrate final job snapshot:', error)
            })
        }
      }

      const timeStr = new Date(message.timestamp).toLocaleTimeString('en-US', {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
      })

      const domain = message.payload?.domain as string | undefined
      let source: any = 'SIEM'
      if (domain === 'auth') source = 'AUTH_SVC'
      else if (domain === 'http') source = 'GRAFANA_LOKI'
      else if (domain === 'infra') source = 'FIREWALL'

      logQueue.current.push({
        id: msgId,
        timestamp: `[${timeStr}]`,
        source,
        severity: 'info',
        message: `${message.state} • ${payloadText}`,
      })
    })
  }, [messages, auditRunning, activeJobId, auditTimerId, applyFinalJobSnapshot, customMinutes, selectedMinutes])

  useEffect(() => {
    const timer = setInterval(() => {
      if (logQueue.current.length > 0) {
        const nextLog = logQueue.current.shift()!
        setDisplayedLogs(prev => [...prev.slice(-99), nextLog])
      }
    }, TELEMETRY_RENDER_DELAY_MS)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!activeJobId || connected || finalJobSnapshot?.status === 'COMPLETED' || finalJobSnapshot?.status === 'ERROR') return

    const poll = setInterval(() => {
      void apiClient.getJob(activeJobId)
        .then((job) => {
          if (job.status === 'COMPLETED' || job.status === 'ERROR') {
            applyFinalJobSnapshot(job)
          }
        })
        .catch((error) => {
          console.error('Disconnected completion poll failed:', error)
        })
    }, 3000)

    return () => clearInterval(poll)
  }, [activeJobId, connected, finalJobSnapshot?.status, applyFinalJobSnapshot])

  const resetLiveView = useCallback(() => {
    setDisplayedLogs([])
    setPersistedFindings([])
    setFinalJobSnapshot(null)
    setActiveJobId(null)
    setShowAuditPanel(false)
    setAuditElapsed(0)
    sessionStorage.removeItem(LIVE_ACTIVITY_STATE_KEY)
    processedMessageIds.current.clear()
    processedMessageOrder.current = []
    logQueue.current = []
    hydratedJobs.current.clear()
  }, [])

  const handleAuditToggle = useCallback(async () => {
    if (auditRunning) {
      if (auditTimerId) clearInterval(auditTimerId)
      setAuditTimerId(null)
      setAuditRunning(false)
      // disconnectSocket()
      // resetLiveView()
      return
    }

    const minutes = customMinutes ? parseInt(customMinutes, 10) : selectedMinutes
    if (!minutes || minutes <= 0) return

    // Add a small buffer to account for clock drift between frontend and backend
    auditStartTimeRef.current = Date.now() - 1000
    resetLiveView()

    try {
      connectSocket()
      await apiClient.triggerJob(minutes)
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
    } catch (error) {
      console.error('Failed to trigger job:', error)
      disconnectSocket()
      // Handle error, maybe show a toast
    }
  }, [auditRunning, auditTimerId, customMinutes, selectedMinutes, connectSocket, disconnectSocket, resetLiveView])

  const totalSeconds = (customMinutes ? parseInt(customMinutes, 10) : selectedMinutes) * 60
  const progressPct = totalSeconds > 0 ? (auditElapsed / totalSeconds) * 100 : 0
  const elapsedMin = Math.floor(auditElapsed / 60)
  const elapsedSec = auditElapsed % 60

  const statusBar = [
    { label: 'PIPELINE', value: auditRunning ? 'RUNNING' : (finalJobSnapshot?.status || 'IDLE'), color: auditRunning ? '#05CD99' : '#3965FF' },
    { label: 'JOB', value: activeJobId ? `${activeJobId.slice(0, 8)}…` : '—', color: '#3965FF' },
    { label: 'FINDINGS', value: String(persistedFindings.length), color: '#FFB547' },
    { label: 'ACTIONS', value: String(finalJobSnapshot?.actionsCount ?? 0), color: '#05CD99' },
    { label: 'EVENTS', value: String(displayedLogs.length), color: '#7551FF' },
    { label: 'WS', value: socketState.toUpperCase(), color: connected ? '#05CD99' : '#FFB547' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px - 48px)', gap: '0' }}>

      {/* ─── Audit Control Bar ─── */}
      <div style={{ marginBottom: '12px', flexShrink: 0 }}>
        {socketState !== 'connected' && socketState !== 'completed' && !finalJobSnapshot && (
          <div className="card" style={{ padding: '10px 14px', marginBottom: '10px', borderLeft: '3px solid #FFB547' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Live stream status: <span style={{ fontWeight: 700, color: '#FFB547' }}>{socketState.toUpperCase()}</span>
              {reconnectAttempt > 0 ? ` (retry ${reconnectAttempt})` : ''}
              {activeJobId ? ' - fallback polling is active for this job while disconnected.' : ''}
            </div>
          </div>
        )}
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
                    : activeJobId
                      ? `Last session ${activeJobId}`
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
                    onClick={handleAuditToggle}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 20px', borderRadius: '10px',
                      background: 'var(--navy)', border: 'none',
                      color: '#fff', fontSize: '13px', fontWeight: 700,
                      cursor: 'pointer', letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(27, 37, 89, 0.2)',
                    }}
                  >
                    {auditRunning ? <Square size={12} fill="#fff" /> : <Play size={14} fill="#fff" />} {auditRunning ? 'Stop Audit' : 'Start Audit'}
                  </button>
                </>
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
                    onClick={handleAuditToggle}
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

      {finalJobSnapshot && !auditRunning && (
        <div className="card" style={{ padding: '14px 18px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>LAST COMPLETED JOB</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{finalJobSnapshot.jobId}</div>
            <div style={{ fontSize: '11px', color: '#3965FF', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
              WebSocket stream remains active. Start a new audit when ready.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Status: <span style={{ color: '#05CD99', fontWeight: 700 }}>{finalJobSnapshot.status}</span></div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Findings: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{finalJobSnapshot.findingsCount}</span></div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Actions: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{finalJobSnapshot.actionsCount}</span></div>
            <button
              onClick={() => setShowSummaryCard(!showSummaryCard)}
              style={{
                padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
                background: showSummaryCard ? 'var(--border)' : 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {showSummaryCard ? 'Hide Summary' : 'View Summary'}
            </button>
          </div>
        </div>
      )}

      {showSummaryCard && finalJobSnapshot && (
        <div className="card" style={{ padding: '20px', marginBottom: '12px', background: 'var(--bg-surface-alt)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '12px' }}>
            REPORT SUMMARY
          </div>
          <pre style={{
             whiteSpace: 'pre-wrap', 
             fontFamily: 'JetBrains Mono, monospace', 
             fontSize: '12px', 
             color: 'var(--text-secondary)',
             lineHeight: 1.6,
             background: '#050810',
             padding: '16px',
             borderRadius: '8px',
             border: '1px solid var(--border)'
          }}>
            {(finalJobSnapshot.report as any)?.humanReport || 'Summary not available. Check individual findings.'}
          </pre>
        </div>
      )}

      {/* Main 3-column grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 280px 280px',
        gap: '16px',
        flex: 1,
        minHeight: 0,
      }}>
        {/* Left: Telemetry Stream */}
        <TelemetryStream logs={displayedLogs} connected={connected} sources={displayedLogs.length || 1} />

        {/* Center: Commander Agent */}
        <CommanderAgent findings={persistedFindings} revealDelayMs={1400} />

        {/* Right: Remediation Engine */}
        <RemediationEngine findings={persistedFindings} revealDelayMs={1400} />
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
        {statusBar.map(({ label, value, color }) => (
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