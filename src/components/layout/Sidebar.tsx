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
  const navigate = useNavigate()

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
            RA
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>Rajat Aggarwal</div>
            <div style={{ fontSize: '10px', color: '#00D4FF', letterSpacing: '0.5px' }}>LEVEL 4 CLEARANCE</div>
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

        {/* Emergency Protocol */}
        <div style={{ marginTop: '20px' }}>
          <button
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
    </aside>
  )
}
