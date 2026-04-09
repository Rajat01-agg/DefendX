import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '220px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main
          className="grid-bg"
          style={{
            flex: 1,
            marginTop: '60px',
            padding: '24px',
            minHeight: 'calc(100vh - 60px)',
            overflowY: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
