import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Shield, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('All fields required'); return }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1200))
    const ok = login(email, password)
    if (ok) navigate('/dashboard')
    else { setError('Invalid credentials'); setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070A12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background grid */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      {/* Glowing orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '15%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,45,85,0.06), transparent 70%)',
        filter: 'blur(40px)',
      }} />

      {/* Login card */}
      <div className="glass" style={{
        width: '100%',
        maxWidth: '420px',
        borderRadius: '20px',
        padding: '40px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)',
        }} />

        {/* Shield icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', width: 64, height: 64, borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))',
            border: '1px solid rgba(0,212,255,0.3)',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 30px rgba(0,212,255,0.2)',
          }}>
            <Shield size={28} color="#00D4FF" />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#E8EAF0', letterSpacing: '-0.5px' }}>
            Defend<span style={{ color: '#00D4FF' }}>X</span>
          </h1>
          <p style={{ fontSize: '12px', color: '#4A5568', marginTop: '4px', letterSpacing: '2px' }}>
            SECURE ACCESS PORTAL
          </p>
        </div>

        {/* Clearance notice */}
        <div style={{
          background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)',
          borderRadius: '8px', padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '24px',
        }}>
          <Lock size={12} color="#FF2D55" />
          <span style={{ fontSize: '11px', color: '#FF2D55', fontWeight: 600, letterSpacing: '0.5px' }}>
            AUTHORIZED PERSONNEL ONLY — LEVEL 4 CLEARANCE REQUIRED
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '1px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              OPERATOR EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@defendx.io"
              style={{
                width: '100%', padding: '12px 14px',
                background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '8px',
                color: '#E8EAF0', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#00D4FF44')}
              onBlur={e => (e.target.style.borderColor = '#1E2D4A')}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '1px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              PASSPHRASE
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%', padding: '12px 42px 12px 14px',
                  background: '#0D1220', border: '1px solid #1E2D4A', borderRadius: '8px',
                  color: '#E8EAF0', fontSize: '14px', outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = '#00D4FF44')}
                onBlur={e => (e.target.style.borderColor = '#1E2D4A')}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              marginBottom: '12px', padding: '8px 12px', borderRadius: '6px',
              background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.2)',
              fontSize: '12px', color: '#FF2D55',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', marginTop: '20px',
              padding: '13px',
              background: loading ? '#1E2D4A' : 'linear-gradient(135deg, #00D4FF, #0099BB)',
              border: 'none', borderRadius: '10px',
              color: loading ? '#6B7280' : '#070A12',
              fontSize: '14px', fontWeight: 800, letterSpacing: '1.5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading ? 'none' : '0 0 30px rgba(0,212,255,0.3)',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, border: '2px solid #4A5568', borderTopColor: '#00D4FF',
                  borderRadius: '50%', animation: 'radar-spin 0.8s linear infinite',
                }} />
                AUTHENTICATING...
              </>
            ) : (
              <>AUTHENTICATE <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#4A5568' }}>
          All access attempts are logged and monitored
        </p>
      </div>
    </div>
  )
}
