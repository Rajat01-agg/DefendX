import { useState } from 'react'
import { Bell, Link, Key } from 'lucide-react'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 42, height: 24, borderRadius: '12px', cursor: 'pointer', flexShrink: 0,
        background: checked ? '#00D4FF' : '#1E2D4A',
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
      }} />
    </div>
  )
}

const INTEGRATIONS = [
  { name: 'Slack', icon: '💬', connected: true, desc: 'Incident alerts and remediation notifications' },
  { name: 'Jira', icon: '📋', connected: true, desc: 'Auto-creates tickets for every incident' },
  { name: 'PagerDuty', icon: '🔔', connected: false, desc: 'On-call escalation for critical incidents' },
  { name: 'Splunk', icon: '🔍', connected: false, desc: 'SIEM data forwarding and correlation' },
]

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({
    criticalAlerts: true,
    emailDigest: true,
    slackNotify: true,
    weeklyReport: false,
    systemHealth: true,
  })

  const toggle = (key: keyof typeof notifs) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      {/* Notification Preferences */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Bell size={16} color="#00D4FF" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0' }}>Notification Preferences</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { key: 'criticalAlerts', label: 'Critical Alerts', desc: 'Immediate push for CRITICAL severity incidents' },
            { key: 'emailDigest', label: 'Email Digest', desc: 'Daily summary of incidents and actions taken' },
            { key: 'slackNotify', label: 'Slack Notifications', desc: 'Send alerts to connected Slack workspace' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Auto-generate weekly security briefing' },
            { key: 'systemHealth', label: 'System Health Alerts', desc: 'Node failures, storage warnings, latency spikes' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', borderBottom: '1px solid #111827',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#E8EAF0' }}>{label}</div>
                <div style={{ fontSize: '11px', color: '#4A5568', marginTop: '2px' }}>{desc}</div>
              </div>
              <Toggle
                checked={notifs[key as keyof typeof notifs]}
                onChange={() => toggle(key as keyof typeof notifs)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Link size={16} color="#00D4FF" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0' }}>Integrations</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {INTEGRATIONS.map(({ name, icon, connected, desc }) => (
            <div key={name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px', borderRadius: '8px',
              background: '#0D1220', border: '1px solid #1E2D4A',
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0' }}>{name}</div>
                  <div style={{ fontSize: '11px', color: '#4A5568' }}>{desc}</div>
                </div>
              </div>
              <button style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', border: connected ? '1px solid rgba(0,255,136,0.3)' : '1px solid #1E2D4A',
                background: connected ? 'rgba(0,255,136,0.1)' : '#111827',
                color: connected ? '#00FF88' : '#6B7280',
              }}>
                {connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Key size={16} color="#00D4FF" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0' }}>API Keys</h3>
        </div>
        {[
          { label: 'Production API Key', value: 'dxp_••••••••••••••••••••••••sk_live_Xz91' },
          { label: 'Webhook Secret', value: 'whsec_••••••••••••••••••••••••••••••••••' },
        ].map(({ label, value }) => (
          <div key={label} style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
              {label.toUpperCase()}
            </label>
            <div style={{
              display: 'flex', gap: '8px',
              background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '8px',
              padding: '10px 12px', alignItems: 'center',
            }}>
              <span style={{ flex: 1, fontSize: '13px', color: '#6B7280', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value}
              </span>
              <button style={{
                padding: '4px 10px', borderRadius: '4px', fontSize: '11px',
                background: '#1E2D4A', border: 'none', color: '#9BA3B8', cursor: 'pointer',
              }}>Copy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
