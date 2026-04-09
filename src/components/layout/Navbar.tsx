import { useState } from 'react'
import { Bell, Search, Settings, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useLocation, useNavigate } from 'react-router-dom'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Home / Dashboard' },
  '/live': { title: 'Live Activity', subtitle: 'Home / Live Activity' },
  '/reports': { title: 'Reports & Compliance', subtitle: 'Home / Reports' },
  '/profile': { title: 'Profile', subtitle: 'Home / Profile' },
  '/settings': { title: 'Settings', subtitle: 'Home / Settings' },
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
  const page = PAGE_TITLES[location.pathname] ?? { title: 'DefendX', subtitle: 'Home' }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: '220px',
        right: 0,
        height: '64px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        zIndex: 99,
      }}
    >
      {/* Left: breadcrumb & page title */}
      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
          {page.subtitle}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {page.title}
        </div>
      </div>

      {/* Right: search + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              width: '100%',
              background: '#F0F4F8',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '8px 12px 8px 34px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 38, height: 38, borderRadius: '10px',
              background: '#F0F4F8', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
            }}
          >
            <Bell size={16} color="var(--text-secondary)" />
            <span style={{
              position: 'absolute', top: 7, right: 7, width: 7, height: 7,
              borderRadius: '50%', background: '#EE5D50', border: '2px solid #fff',
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '320px',
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(27,37,89,0.12)',
              zIndex: 200,
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: 'var(--text-accent)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: n.urgent ? 'rgba(238,93,80,0.04)' : 'transparent',
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    {n.urgent && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EE5D50', marginTop: 5, flexShrink: 0 }} className="pulse-dot" />}
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{n.text}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{n.time}</div>
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
          width: 38, height: 38, borderRadius: '10px',
          background: '#F0F4F8', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Settings size={16} color="var(--text-secondary)" />
        </button>



        {/* Profile */}
        <div 
          onClick={() => navigate('/profile')}
          style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '5px 12px 5px 6px',
          background: '#F0F4F8', border: '1px solid var(--border)',
          borderRadius: '12px', cursor: 'pointer',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3965FF, #7551FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: '#fff',
          }}>
            {user?.name.charAt(0) ?? 'U'}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name ?? 'Admin'}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.2 }}>{user?.clearance ?? 'ADMIN'}</div>
          </div>
          <ChevronDown size={13} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  )
}
