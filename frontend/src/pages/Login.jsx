import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react'
import { useAuthStore } from '../context/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill all fields')
    const res = await login(form.email, form.password)
    if (res.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(res.message)
    }
  }

  const demoLogin = async () => {
    const res = await login('demo@cardioai.com', 'demo1234')
    if (res.success) { toast.success('Demo login!'); navigate('/dashboard') }
    else toast('Demo account not set up — register first', { icon: 'ℹ️' })
  }

  return (
    <div className="min-h-screen bg-navy-mid flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(193,18,31,0.08),transparent)]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-crimson rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Heart size={22} className="fill-white text-white" />
            </div>
            <h1 className="font-syne font-bold text-xl">Welcome back</h1>
            <p className="text-gray-400 text-xs mt-1">Sign in to your CardioAI account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="you@email.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="form-input !pl-9" autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="form-input !pl-9 !pr-9" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="btn-primary w-full justify-center !py-2.5 text-sm">
              {isLoading ? <Loader size={15} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div>
            <div className="relative flex justify-center"><span className="bg-navy-light px-3 text-xs text-gray-500">or</span></div>
          </div>

          <button onClick={demoLogin} className="btn-ghost w-full justify-center text-xs !py-2">
            Try Demo Account
          </button>

          <p className="text-center text-xs text-gray-400 mt-5">
            No account? <Link to="/register" className="text-crimson-light hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
