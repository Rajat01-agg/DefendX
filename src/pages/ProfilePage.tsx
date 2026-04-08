import { useAuthStore } from '../store/authStore'
import { Shield, Activity, CheckCircle, Clock, Award, Lock } from 'lucide-react'

const ACTIVITY_TIMELINE = [
  { action: 'Reviewed incident #EIC-2026-001', time: '09:41 AM', type: 'review' },
  { action: 'Approved remediation for DDoS attempt', time: '08:22 AM', type: 'approve' },
  { action: 'Generated CERT-In compliance report', time: 'Yesterday 3:30 PM', type: 'report' },
  { action: 'Updated WAF rule set v48', time: 'Yesterday 11:00 AM', type: 'config' },
  { action: 'Escalated incident #EIC-2026-004', time: '2 days ago', type: 'escalate' },
]

const BADGES = [
  { label: 'Zero Breach Q3', icon: '🏆', color: '#FFB800' },
  { label: 'SOC Champion', icon: '⭐', color: '#00D4FF' },
  { label: '100% Uptime', icon: '🟢', color: '#00FF88' },
  { label: 'Compliance Elite', icon: '🛡️', color: '#8B5CF6' },
]

export default function ProfilePage() {
  const user = useAuthStore(s => s.user)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
      {/* Profile Card */}
      <div className="card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1))',
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '20px', flexShrink: 0,
            background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 800, color: '#fff',
            border: '3px solid rgba(0,212,255,0.3)',
          }}>
            {user?.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#E8EAF0' }}>{user?.name}</h2>
              <span style={{
                padding: '3px 10px', borderRadius: '4px',
                background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                fontSize: '11px', color: '#00D4FF', fontWeight: 700, letterSpacing: '1px',
              }}>{user?.clearance}</span>
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>{user?.email}</div>
            <div style={{ fontSize: '13px', color: '#9BA3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={12} color="#00D4FF" />
              {user?.role} — DefendX Security Operations
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '28px' }}>
          {[
            { label: 'Incidents Resolved', value: '1,247', icon: <CheckCircle size={16} color="#00FF88" />, color: '#00FF88' },
            { label: 'Avg Response Time', value: '2.8s', icon: <Activity size={16} color="#00D4FF" />, color: '#00D4FF' },
            { label: 'Uptime', value: '99.97%', icon: <Clock size={16} color="#8B5CF6" />, color: '#8B5CF6' },
            { label: 'Clearance Level', value: 'L4', icon: <Lock size={16} color="#FFB800" />, color: '#FFB800' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '10px',
              padding: '14px', textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color, marginBottom: '4px' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#4A5568' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Activity Timeline */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0', marginBottom: '16px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {ACTIVITY_TIMELINE.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '16px', position: 'relative' }}>
                {i < ACTIVITY_TIMELINE.length - 1 && (
                  <div style={{
                    position: 'absolute', left: '8px', top: '18px', bottom: 0,
                    width: '1px', background: '#1E2D4A',
                  }} />
                )}
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  background: '#00D4FF22', border: '2px solid #00D4FF44',
                  marginTop: '2px', zIndex: 1,
                }} />
                <div>
                  <div style={{ fontSize: '13px', color: '#E8EAF0' }}>{item.action}</div>
                  <div style={{ fontSize: '11px', color: '#4A5568', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#E8EAF0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} color="#FFB800" /> Achievements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {BADGES.map(({ label, icon, color }) => (
              <div key={label} style={{
                background: '#0D1220', border: `1px solid ${color}22`, borderRadius: '10px',
                padding: '14px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontSize: '12px', color, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
