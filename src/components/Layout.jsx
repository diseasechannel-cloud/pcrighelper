import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Hub', icon: '⬡' },
  { to: '/scan', label: 'Rig Scan', icon: '⚡' },
  { to: '/build', label: 'Build', icon: '🔧' },
  { to: '/benchmark', label: 'Benchmark', icon: '📊' },
  { to: '/compare', label: 'Compare', icon: '⚖️' },
  { to: '/market', label: 'Market', icon: '🔍' },
  { to: '/legacy', label: 'Legacy', icon: '🏛️' },
  { to: '/flip', label: 'Flip Mode', icon: '💰' },
  { to: '/regions', label: 'Regions', icon: '🌍' },
]

export default function Layout() {
  return (
    <div className="min-h-screen pcb-bg">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 flex items-center h-14">
          <NavLink to="/" className="flex items-center gap-2 mr-8 shrink-0">
            <span className="text-neon font-display font-bold text-lg neon-text tracking-wider">
              UpgradeRig
            </span>
            <span className="text-xs text-gray-500 font-mono">.com</span>
          </NavLink>

          <nav className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-neon/10 text-neon neon-glow border border-neon/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-lighter border border-transparent'
                  }`
                }
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-12">
        <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between text-xs text-gray-600">
          <span className="font-display">UpgradeRig.com</span>
          <span>Prototype v0.1 — All data is simulated</span>
        </div>
      </footer>
    </div>
  )
}
