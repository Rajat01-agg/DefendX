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
        background: 'linear-gradient(180deg, #1B2559 0%, #111C44 100%)',
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
      <div style={{ padding: '22px 16px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'rgba(57, 101, 255, 0.25)',
            border: '1px solid rgba(57, 101, 255, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
            Defend<span style={{ color: '#3965FF' }}>X</span>
          </span>
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px', paddingLeft: '46px' }}>
          ENTERPRISE SOC
        </div>
      </div>

      {/* User Card */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3965FF, #7551FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {user?.name?.substring(0, 2).toUpperCase() || 'AC'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{user?.name || 'Administrator'}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>{user?.clearance || 'SYSTEM ACCESS'}</div>
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
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(57, 101, 255, 0.3)' : 'transparent',
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
              borderRadius: '10px',
              border: '1px solid rgba(238, 93, 80, 0.35)',
              background: 'rgba(238, 93, 80, 0.12)',
              color: '#EE5D50',
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
            EMERGENCY
          </button>
        </div>

        <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(5, 205, 153, 0.1)', border: '1px solid rgba(5, 205, 153, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Zap size={12} color="#05CD99" />
            <span style={{ fontSize: '10px', color: '#05CD99', letterSpacing: '0.5px', fontWeight: 600 }}>SYSTEM STATUS</span>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>All systems operational</div>
          <div style={{ marginTop: '6px', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: '98%', height: '100%', background: 'linear-gradient(90deg, #05CD99, #3965FF)', borderRadius: '2px' }} />
          </div>
        </div>
      </nav>

      {/* Bottom Items */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(57, 101, 255, 0.3)' : 'transparent',
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
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            color: 'rgba(255,255,255,0.4)',
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
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#fff', border: '2px solid #EE5D50', borderRadius: '20px',
            padding: '40px', width: '100%', maxWidth: '460px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(238,93,80,0.15)',
          }}>
            <AlertTriangle size={56} color="#EE5D50" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1B2559', marginBottom: '12px', letterSpacing: '0.5px' }}>
              INITIATE GLOBAL LOCKDOWN?
            </h2>
            <p style={{ fontSize: '14px', color: '#707EAE', marginBottom: '28px', lineHeight: 1.6 }}>
              This will immediately quarantine all network traffic, sever external API connections, and force-logout users. 
              This action requires physical site authorization to reverse.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowEmergency(false)}
                style={{
                  padding: '12px 24px', borderRadius: '10px', background: '#F0F4F8',
                  border: '1px solid var(--border)', color: '#1B2559', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  flex: 1,
                }}>
                CANCEL
              </button>
              <button 
                onClick={() => {
                  alert("SECURITY PROTOCOL OMEGA INITIATED.");
                  setShowEmergency(false);
                }}
                style={{
                  padding: '12px 24px', borderRadius: '10px', background: '#EE5D50',
                  border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(238,93,80,0.3)', flex: 1,
                }}
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
