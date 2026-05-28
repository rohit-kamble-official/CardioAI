import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Activity, BarChart3, MessageSquare, Users, User,
  Heart, LogOut, Menu, X, Zap, Bell, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '../context/authStore'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/predict', icon: Activity, label: 'Predict Risk', badge: 'AI' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/chatbot', icon: MessageSquare, label: 'AI Assistant' },
  { to: '/doctors', icon: Users, label: 'Doctors' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="flex min-h-screen bg-navy-mid">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-navy-mid border-r border-white/8 flex flex-col z-50 transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-crimson rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <div>
              <div className="font-syne font-extrabold text-sm text-white">CardioAI</div>
              <div className="text-[10px] text-crimson-light font-medium tracking-wide uppercase">Health Monitor</div>
            </div>
            <button className="ml-auto lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider px-2 mb-2">Menu</div>
          {navLinks.map(({ to, icon: Icon, label, badge }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && <span className="bg-crimson text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/8">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crimson to-crimson-light flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user?.name || 'User'}</div>
              <div className="text-[10px] text-gray-400 capitalize">{user?.role || 'Patient'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full nav-item text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-60">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-navy-mid border-b border-white/8 flex items-center px-4 gap-3">
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Online
          </div>
          <button className="relative btn-ghost !py-1.5 !px-2" onClick={() => toast('No new notifications', { icon: '🔔' })}>
            <Bell size={15} />
          </button>
          <NavLink to="/predict" className="btn-primary text-xs !py-1.5">
            <Zap size={13} /> New Prediction
          </NavLink>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
