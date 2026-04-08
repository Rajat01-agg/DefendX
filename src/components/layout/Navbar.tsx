import { useState } from 'react'
import { Bell, Search, Settings, HelpCircle, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useLocation, useNavigate } from 'react-router-dom'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Executive Dashboard', subtitle: 'OPERATIONAL OVERSIGHT' },
  '/live': { title: 'Live Activity', subtitle: 'TELEMETRY INGESTION' },
  '/reports': { title: 'Incident Reports & Compliance', subtitle: 'ENTERPRISE OPERATIONAL INTEGRITY' },
  '/profile': { title: 'Profile', subtitle: 'ACCOUNT MANAGEMENT' },
  '/settings': { title: 'Settings', subtitle: 'SYSTEM CONFIGURATION' },
}

const NOTIFICATIONS = [
  { id: 1, text: 'Critical threat detected on Customer Portal', time: '2m ago', urgent: true },
  { id: 2, text: 'DDoS mitigation completed for Payment Gateway', time: '14m ago', urgent: false },
  { id: 3, text: 'SOC-2 compliance report generated', time: '1h ago', urgent: false },
]

export default function Navbar() {
  const user = useAuthStore(s => s.user)
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [search, setSearch] = useState('')
  const page = PAGE_TITLES[location.pathname] ?? { title: 'DefendX', subtitle: 'SECURITY OPERATIONS' }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: '220px',
        right: 0,
        height: '60px',
        background: 'rgba(7, 10, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1E2D4A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 99,
      }}
    >
      {/* Left: page info */}
      <div>
        <div style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '1.5px', fontWeight: 500 }}>
          {page.subtitle}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#E8EAF0', lineHeight: 1.2 }}>
          {page.title}
        </div>
      </div>

      {/* Center: search */}
      <div style={{ position: 'relative', width: '280px' }}>
        <Search size={14} color="#4A5568" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search telemetry, incidents..."
          style={{
            width: '100%',
            background: '#111827',
            border: '1px solid #1E2D4A',
            borderRadius: '8px',
            padding: '7px 12px 7px 34px',
            color: '#9BA3B8',
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px', borderRadius: '6px',
          background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00FF88', display: 'block' }} className="pulse-dot" />
          <span style={{ fontSize: '11px', color: '#00FF88', fontWeight: 600, letterSpacing: '0.5px' }}>SYSTEMS NOMINAL</span>
        </div>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 36, height: 36, borderRadius: '8px',
              background: '#111827', border: '1px solid #1E2D4A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
            }}
          >
            <Bell size={16} color="#9BA3B8" />
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 8, height: 8,
              borderRadius: '50%', background: '#FF2D55', border: '2px solid #070A12',
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '320px',
              background: '#0D1220',
              border: '1px solid #1E2D4A',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              zIndex: 200,
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #1E2D4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: '#00D4FF', cursor: 'pointer' }}>Mark all read</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #111827',
                  background: n.urgent ? 'rgba(255,45,85,0.04)' : 'transparent',
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    {n.urgent && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2D55', marginTop: 4, flexShrink: 0 }} className="pulse-dot" />}
                    <div>
                      <div style={{ fontSize: '12px', color: '#E8EAF0' }}>{n.text}</div>
                      <div style={{ fontSize: '11px', color: '#4A5568', marginTop: '2px' }}>{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate('/settings')}
          style={{
          width: 36, height: 36, borderRadius: '8px',
          background: '#111827', border: '1px solid #1E2D4A',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Settings size={16} color="#9BA3B8" />
        </button>

        <button style={{
          width: 36, height: 36, borderRadius: '8px',
          background: '#111827', border: '1px solid #1E2D4A',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <HelpCircle size={16} color="#9BA3B8" />
        </button>

        {/* Profile */}
        <div 
          onClick={() => navigate('/profile')}
          style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '5px 10px 5px 6px',
          background: '#111827', border: '1px solid #1E2D4A',
          borderRadius: '8px', cursor: 'pointer',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: '#fff',
          }}>
            {user?.name.charAt(0) ?? 'U'}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0', lineHeight: 1.2 }}>{user?.role ?? 'CISO Office'}</div>
            <div style={{ fontSize: '10px', color: '#00D4FF', lineHeight: 1.2 }}>{user?.clearance ?? 'ADMINISTRATOR'}</div>
          </div>
          <ChevronDown size={13} color="#4A5568" />
        </div>
      </div>
    </header>
  )
}
