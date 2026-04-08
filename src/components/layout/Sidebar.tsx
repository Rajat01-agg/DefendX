import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Activity, FileText, User, Settings,
  Shield, AlertTriangle, LogOut, Zap
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/live', icon: Activity, label: 'Live Activity' },
  { to: '/reports', icon: FileText, label: 'Reports' },
]

const bottomItems = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const logout = useAuthStore(s => s.logout)
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const [showEmergency, setShowEmergency] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: '#0A0F1E',
        borderRight: '1px solid #1E2D4A',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1E2D4A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #00D4FF22, #00D4FF44)',
            border: '1px solid #00D4FF44',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={18} color="#00D4FF" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#E8EAF0', letterSpacing: '-0.3px' }}>
            Defend<span style={{ color: '#00D4FF' }}>X</span>
          </span>
        </div>
        <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', paddingLeft: '46px' }}>
          ENTERPRISE DEFENSE
        </div>
      </div>

      {/* User Card */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E2D4A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {user?.name?.substring(0, 2).toUpperCase() || 'AC'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>{user?.name || 'Administrator'}</div>
            <div style={{ fontSize: '10px', color: '#00D4FF', letterSpacing: '0.5px' }}>{user?.clearance || 'SYSTEM ACCESS'}</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#00D4FF' : '#6B7280',
              background: isActive ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
              borderLeft: isActive ? '2px solid #00D4FF' : '2px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowEmergency(true)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #FF2D5544',
              background: 'rgba(255, 45, 85, 0.08)',
              color: '#FF2D55',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            className="emergency-pulse"
          >
            <AlertTriangle size={14} />
            EMERGENCY PROTOCOL
          </button>
        </div>

        <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Zap size={12} color="#00FF88" />
            <span style={{ fontSize: '10px', color: '#00FF88', letterSpacing: '0.5px', fontWeight: 600 }}>SYSTEM STATUS</span>
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>All systems operational</div>
          <div style={{ marginTop: '6px', height: '3px', borderRadius: '2px', background: '#1E2D4A', overflow: 'hidden' }}>
            <div style={{ width: '98%', height: '100%', background: 'linear-gradient(90deg, #00FF88, #00D4FF)', borderRadius: '2px' }} />
          </div>
        </div>
      </nav>

      {/* Bottom Items */}
      <div style={{ padding: '10px', borderTop: '1px solid #1E2D4A' }}>
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#00D4FF' : '#6B7280',
              background: isActive ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
              marginBottom: '2px',
            })}
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            color: '#6B7280',
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
      {/* Emergency Modal */}
      {showEmergency && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#070A12', border: '1px solid #FF2D55', borderRadius: '16px',
            padding: '40px', width: '100%', maxWidth: '500px', textAlign: 'center',
            boxShadow: '0 0 50px rgba(255,45,85,0.2)',
          }}>
            <AlertTriangle size={64} color="#FF2D55" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '1px' }}>
              INITIATE GLOBAL LOCKDOWN?
            </h2>
            <p style={{ fontSize: '14px', color: '#9BA3B8', marginBottom: '32px', lineHeight: 1.6 }}>
              Activating the emergency protocol will immediately quarantine all internal network traffic, 
              sever all external API connections, and force-logout all active users to prevent lateral movement. 
              This action cannot be reversed without physical site authorization.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowEmergency(false)}
                style={{
                  padding: '12px 24px', borderRadius: '8px', background: 'transparent',
                  border: '1px solid #1E2D4A', color: '#E8EAF0', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  flex: 1,
                }}>
                CANCEL
              </button>
              <button 
                onClick={() => {
                  alert("SECURITY PROTOCOL OMEGA INITIATED. SEVERING ALL CONNECTIONS.");
                  setShowEmergency(false);
                }}
                style={{
                  padding: '12px 24px', borderRadius: '8px', background: 'rgba(255, 45, 85, 0.1)',
                  border: '1px solid #FF2D55', color: '#FF2D55', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(255,45,85,0.3)', flex: 1,
                }}
                className="emergency-pulse"
              >
                CONFIRM LOCKDOWN
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
