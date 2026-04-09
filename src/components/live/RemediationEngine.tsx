import { useState, useEffect } from 'react'
import { Download, Shield, Zap } from 'lucide-react'
import type { ActionType, ActionStatus, Domain } from '../../types/schema'
import { ACTION_TYPE_LABELS, ACTION_STATUS_COLORS } from '../../types/schema'

interface RemediationState {
  actionType: ActionType
  domain: Domain
  actionStatus: ActionStatus
  description: string
  findingId: string
  offender: string
  quote: string
  doneCount: number
  load: string
}

const REMEDIATION_STATES: RemediationState[] = [
  {
    actionType: 'block_ip', domain: 'http', actionStatus: 'DONE',
    description: 'IP 185.220.101.45 quarantined at WAF layer',
    findingId: 'INC-001', offender: 'ip: 185.220.101.45',
    quote: '"SQL injection source neutralized at edge in 14ms"',
    doneCount: 1242, load: '0.04%',
  },
  {
    actionType: 'rate_limit', domain: 'http', actionStatus: 'DONE',
    description: 'Rate limit applied to 847 botnet source IPs',
    findingId: 'INC-002', offender: 'ip: 103.45.xx.xx (847 sources)',
    quote: '"DDoS traffic null-routed. Payment gateway latency restored"',
    doneCount: 1243, load: '0.06%',
  },
  {
    actionType: 'block_ip', domain: 'auth', actionStatus: 'DONE',
    description: 'Brute force source blocked on auth-api endpoint',
    findingId: 'INC-003', offender: 'ip: 103.4xx.xx.x',
    quote: '"Auth endpoint secured. 127 failed attempts terminated"',
    doneCount: 1248, load: '0.03%',
  },
  {
    actionType: 'alert_soc', domain: 'auth', actionStatus: 'DONE',
    description: 'SOC alerted: 3 credential stuffing successes detected',
    findingId: 'INC-004', offender: 'ip: 45.33.xx.xx',
    quote: '"Alert dispatched. 3 compromised accounts flagged for review"',
    doneCount: 1251, load: '0.02%',
  },
  {
    actionType: 'manual_review', domain: 'infra', actionStatus: 'IN_PROGRESS',
    description: 'Payment processor pod OOMKilled — escalated for review',
    findingId: 'INC-005', offender: 'service: payment-processor-pod-xz91',
    quote: '"Resource exhaustion requires human approval for remediation"',
    doneCount: 1254, load: '0.12%',
  },
]

export default function RemediationEngine() {
  const [feed, setFeed] = useState<RemediationState[]>([REMEDIATION_STATES[0]])
  const [nextIdx, setNextIdx] = useState(1)
  const [doneCount, setDoneCount] = useState(REMEDIATION_STATES[0].doneCount)

  const handleDownloadLog = () => {
    const logText = "--- DEFENDX REMEDIATION AUDIT LOG ---\n"
      + `Generated: ${new Date().toISOString()}\n\n`
      + feed.map(r => `[${r.findingId}] Domain: ${r.domain} | Action: ${r.actionType} | Status: ${r.actionStatus} | Target: ${r.offender}\n> ${r.description}\n`).join("\n");
    const textContent = "data:text/plain;charset=utf-8," + encodeURIComponent(logText);
    const link = document.createElement("a");
    link.href = textContent;
    link.download = "remediation_audit_log.txt";
    link.click();
  }

  useEffect(() => {
    const t = setInterval(() => {
      setFeed(prev => [REMEDIATION_STATES[nextIdx], ...prev])
      setNextIdx(i => (i + 1) % REMEDIATION_STATES.length)
    }, 4000)
    return () => clearInterval(t)
  }, [nextIdx])

  useEffect(() => {
    const current = feed[0]
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDoneCount(current.doneCount)
  }, [feed])

  useEffect(() => {
    const t = setInterval(() => {
      setDoneCount(c => c + Math.floor(Math.random() * 3))
    }, 3000)
    return () => clearInterval(t)
  }, [])

  const currentLoad = feed[0]?.load || '0.00%'

  return (
    <div style={{
      height: '100%',
      background: '#080B14',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <Zap size={14} color="#05CD99" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '2px' }}>REMEDIATION ENGINE</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
          LIVE FEED
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flexShrink: 0 }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>ACTIONS COMPLETED</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
            {doneCount.toLocaleString()}
          </div>
        </div>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>SYSTEM LOAD</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#05CD99', fontFamily: 'JetBrains Mono, monospace' }}>
            {currentLoad}
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

      {/* Feed */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
        {feed.map((item, idx) => {
          const statusColor = ACTION_STATUS_COLORS[item.actionStatus]
          const isDone = item.actionStatus === 'DONE'

          return (
            <div
              key={idx}
              className="fade-in-up"
              style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${statusColor}44`,
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={11} color={statusColor} />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor, letterSpacing: '0.5px' }}>
                    {ACTION_TYPE_LABELS[item.actionType]}
                  </span>
                </div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{item.findingId}</span>
              </div>
              
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
                {item.description}
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                Target: {item.offender}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{
                  padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: 700,
                  background: isDone ? 'rgba(5,205,153,0.1)' : 'rgba(255,181,71,0.1)',
                  color: isDone ? '#05CD99' : '#FFB547', letterSpacing: '0.5px'
                }}>
                  {item.actionStatus}
                </span>
                <span style={{ fontSize: '9px', color: '#3965FF', fontStyle: 'italic' }}>
                  {item.quote.substring(0, 25)}...
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Download button */}
      <button 
        onClick={handleDownloadLog}
        style={{
        width: '100%',
        padding: '10px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        color: 'var(--text-muted)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '1px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexShrink: 0,
      }}>
        <Download size={13} />
        DOWNLOAD AUDIT LOG
      </button>
    </div>
  )
}
