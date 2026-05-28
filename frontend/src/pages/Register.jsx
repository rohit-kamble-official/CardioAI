import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react'
import { useAuthStore } from '../context/authStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    const res = await register(form.name, form.email, form.password)
    if (res.success) {
      toast.success('Account created! Welcome to CardioAI')
      navigate('/dashboard')
    } else {
      toast.error(res.message)
    }
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
            <h1 className="font-syne font-bold text-xl">Create account</h1>
            <p className="text-gray-400 text-xs mt-1">Start monitoring your heart health today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Arjun Kapoor" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="form-input !pl-9" />
              </div>
            </div>
            <div>
              <label className="form-label">Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="you@email.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="form-input !pl-9" />
              </div>
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="form-input !pl-9 !pr-9" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="form-label">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" placeholder="Repeat password" value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  className="form-input !pl-9" />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="btn-primary w-full justify-center !py-2.5 text-sm mt-2">
              {isLoading ? <Loader size={15} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Already have an account? <Link to="/login" className="text-crimson-light hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-[10px] text-gray-600 mt-3">
            By registering you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  )
}
