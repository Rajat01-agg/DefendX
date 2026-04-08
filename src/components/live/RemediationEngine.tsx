import { useState, useEffect } from 'react'
import { Download, Shield, Zap } from 'lucide-react'
import type { ActionType, ActionStatus, Domain } from '../../types/schema'
import { ACTION_TYPE_LABELS, DOMAIN_LABELS, ACTION_STATUS_COLORS, DOMAIN_COLORS } from '../../types/schema'

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
  const [stateIdx, setStateIdx] = useState(0)
  const [doneCount, setDoneCount] = useState(REMEDIATION_STATES[0].doneCount)
  const current = REMEDIATION_STATES[stateIdx]

  const handleDownloadLog = () => {
    const logText = "--- DEFENDX REMEDIATION AUDIT LOG ---\n"
      + `Generated: ${new Date().toISOString()}\n\n`
      + REMEDIATION_STATES.map(r => `[${r.findingId}] Domain: ${r.domain} | Action: ${r.actionType} | Status: ${r.actionStatus} | Target: ${r.offender}\n> ${r.description}\n`).join("\n");
    const textContent = "data:text/plain;charset=utf-8," + encodeURIComponent(logText);
    const link = document.createElement("a");
    link.href = textContent;
    link.download = "remediation_audit_log.txt";
    link.click();
  }

  useEffect(() => {
    const t = setInterval(() => {
      setStateIdx(i => (i + 1) % REMEDIATION_STATES.length)
    }, 10000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setDoneCount(current.doneCount)
  }, [current])

  useEffect(() => {
    const t = setInterval(() => {
      setDoneCount(c => c + Math.floor(Math.random() * 3))
    }, 3000)
    return () => clearInterval(t)
  }, [])

  const statusColor = ACTION_STATUS_COLORS[current.actionStatus]
  const domainColor = DOMAIN_COLORS[current.domain]
  const isDone = current.actionStatus === 'DONE'

  return (
    <div style={{
      height: '100%',
      background: '#080B14',
      border: '1px solid #1E2D4A',
      borderRadius: '12px',
      padding: '20px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap size={14} color="#00D4FF" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#9BA3B8', letterSpacing: '2px' }}>REMEDIATION ENGINE</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#4A5568', fontFamily: 'JetBrains Mono, monospace' }}>
          ENGINE REV: 4.2.0
        </span>
      </div>

      {/* Status Banner */}
      <div
        className="fade-in-up"
        style={{
          background: isDone ? 'rgba(0,255,136,0.08)' : 'rgba(255,184,0,0.08)',
          border: `1px solid ${isDone ? '#00FF8844' : '#FFB80044'}`,
          borderRadius: '10px',
          padding: '14px',
          textAlign: 'center',
        }}
        key={stateIdx}
      >
        <div style={{
          fontSize: '20px',
          fontWeight: 800,
          color: statusColor,
          letterSpacing: '2px',
          lineHeight: 1.2,
        }}>
          {current.actionStatus}
        </div>
        <div style={{ marginTop: '6px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <span style={{
            padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
            background: `${domainColor}18`, color: domainColor,
          }}>
            {current.domain.toUpperCase()}
          </span>
          <span style={{
            padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
            background: '#1E2D4A', color: '#9BA3B8',
          }}>
            {ACTION_TYPE_LABELS[current.actionType]}
          </span>
        </div>
      </div>

      {/* Quote */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: '#9BA3B8', fontStyle: 'italic', lineHeight: 1.5 }}>
          {current.quote}
        </p>
      </div>

      {/* Detail Report */}
      <div style={{
        background: '#0D1220',
        border: '1px solid #1E2D4A',
        borderRadius: '10px',
        padding: '12px',
        flex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', letterSpacing: '1px' }}>ACTION DETAILS</span>
          <span style={{ fontSize: '10px', color: '#00D4FF', fontFamily: 'JetBrains Mono, monospace' }}>JUST NOW</span>
        </div>
        {[
          { label: 'ActionType', value: ACTION_TYPE_LABELS[current.actionType] },
          { label: 'Domain', value: DOMAIN_LABELS[current.domain] },
          { label: 'Finding', value: current.findingId },
          { label: 'Offender', value: current.offender },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '5px 0',
            borderBottom: '1px solid #111827',
          }}>
            <span style={{ fontSize: '10px', color: '#4A5568', minWidth: 70 }}>{label}</span>
            <span style={{ fontSize: '10px', color: '#E8EAF0', fontWeight: 500, textAlign: 'right', maxWidth: '150px', fontFamily: 'JetBrains Mono, monospace' }}>{value}</span>
          </div>
        ))}

        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={11} color="#00D4FF" />
          <span style={{ fontSize: '9px', color: '#00D4FF', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
            STATUS: {current.actionStatus}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{ background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '1px', marginBottom: '4px' }}>ACTIONS COMPLETED</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#E8EAF0', fontFamily: 'JetBrains Mono, monospace' }}>
            {doneCount.toLocaleString()}
          </div>
        </div>
        <div style={{ background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '1px', marginBottom: '4px' }}>SYSTEM LOAD</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#00FF88', fontFamily: 'JetBrains Mono, monospace' }}>
            {current.load}
          </div>
        </div>
      </div>

      {/* Download button */}
      <button 
        onClick={handleDownloadLog}
        style={{
        width: '100%',
        padding: '10px',
        background: '#0D1220',
        border: '1px solid #1E2D4A',
        borderRadius: '8px',
        color: '#9BA3B8',
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
