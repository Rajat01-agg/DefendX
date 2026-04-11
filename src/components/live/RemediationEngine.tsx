import { useState, useEffect, useMemo } from 'react'
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
}

interface RemediationEngineProps {
  findings?: any[]
  revealDelayMs?: number
}

export default function RemediationEngine({ findings = [], revealDelayMs = 1400 }: RemediationEngineProps) {
  const [feed, setFeed] = useState<RemediationState[]>([])

  const doneCount = useMemo(
    () => feed.filter((item) => item.actionStatus === 'DONE').length,
    [feed]
  )
  const inProgressCount = useMemo(
    () => feed.filter((item) => item.actionStatus === 'IN_PROGRESS').length,
    [feed]
  )

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
    if (!findings || findings.length === 0) {
      setFeed([])
      return
    }

    const mapped: RemediationState[] = findings.map(f => {
      const rec = (f.recommended_action || '').toLowerCase()
      const cls = (f.classification || '').toLowerCase()
      let aType: ActionType = 'alert_soc'
      
      if (rec.includes('block') || cls.includes('sql') || cls.includes('brute')) aType = 'block_ip'
      else if (rec.includes('rate') || cls.includes('ddos')) aType = 'rate_limit'
      else if (rec.includes('memory') || cls.includes('resource')) aType = 'manual_review'

      return {
        actionType: aType,
        domain: f.domain || 'unknown',
        actionStatus: aType === 'manual_review' ? 'IN_PROGRESS' : 'DONE',
        description: aType === 'manual_review'
          ? `Escalated ${f.classification} for manual resource allocation review`
          : `Resolved ${f.classification} via ${aType}`,
        findingId: f.finding_id || f.findingId || 'INC-000',
        offender: f.offender?.value || 'unknown',
        quote: `"${f.recommended_action || 'Action executed.'}"`,
      }
    })

    setFeed([])
    let idx = 0
    const t = setInterval(() => {
      if (idx < mapped.length) {
        // eslint-disable-next-line no-loop-func
        setFeed(prev => [mapped[idx], ...prev])
        idx++
      } else {
        clearInterval(t)
      }
    }, revealDelayMs)
    return () => clearInterval(t)
  }, [findings, revealDelayMs])

  const currentLoad = `${Math.min(100, Math.max(0, Math.round((inProgressCount / Math.max(feed.length, 1)) * 100)))}%`

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
