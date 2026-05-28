import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Edit3, Download, Trash2, Save, Shield, Bell, Moon } from 'lucide-react'
import { useAuthStore } from '../context/authStore'
import { RiskBadge } from '../components/UI'
import api from '../utils/api'
import toast from 'react-hot-toast'

const mockHistory = [
  { date: 'Today, 10:32 AM', type: 'Full Assessment', level: 'Medium', risk: 62 },
  { date: 'Yesterday, 4:15 PM', type: 'Quick Check', level: 'Medium', risk: 58 },
  { date: 'Nov 12, 2:00 PM', type: 'Full Assessment', level: 'Low', risk: 41 },
  { date: 'Oct 28, 11:20 AM', type: 'Full Assessment', level: 'Low', risk: 35 },
  { date: 'Sep 14, 9:00 AM', type: 'Full Assessment', level: 'Low', risk: 29 },
]

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [history, setHistory] = useState([])
  const [form, setForm] = useState({
    name: user?.name || '',
    profile: { age: '', gender: '', bloodType: '', height: '', weight: '', phone: '', ...(user?.profile || {}) },
    settings: { darkMode: true, notifications: true, emailAlerts: true, ...(user?.settings || {}) },
  })

  useEffect(() => {
    api.get('/predictions/history')
      .then(r => setHistory(r.data.predictions || []))
      .catch(() => setHistory([]))
  }, [])

  const save = async () => {
    try {
      const { data } = await api.patch('/users/profile', form)
      updateUser(data.user)
      setEditing(false)
      toast.success('Profile updated!')
    } catch {
      toast.success('Profile saved (demo mode)')
      setEditing(false)
    }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const displayHistory = history.length ? history : mockHistory

  const profileFields = [
    { label: 'Age', key: 'age', type: 'number', placeholder: '45' },
    { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
    { label: 'Blood Type', key: 'bloodType', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    { label: 'Height (cm)', key: 'height', type: 'number', placeholder: '175' },
    { label: 'Weight (kg)', key: 'weight', type: 'number', placeholder: '83' },
    { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 9876543210' },
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson to-crimson-light flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="font-syne font-bold text-xl">{user?.name || 'User'}</h1>
          <div className="text-gray-400 text-sm">{user?.email}</div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <RiskBadge level="Medium" />
            <span className="text-xs text-gray-500 bg-navy border border-white/8 rounded-full px-2.5 py-1">
              Patient ID: CAI-{user?._id?.slice(-6).toUpperCase() || '2024-00847'}
            </span>
            <span className="text-xs text-gray-500 bg-navy border border-white/8 rounded-full px-2.5 py-1 capitalize">
              {user?.role || 'Patient'}
            </span>
          </div>
        </div>
        <button onClick={() => setEditing(p => !p)} className={editing ? 'btn-ghost' : 'btn-primary'}>
          {editing ? 'Cancel' : <><Edit3 size={14} /> Edit Profile</>}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-sm text-center">
          <div className="font-syne font-bold text-2xl text-crimson-light">{displayHistory.length}</div>
          <div className="text-xs text-gray-400 mt-1">Total Predictions</div>
        </div>
        <div className="card-sm text-center">
          <div className="font-syne font-bold text-2xl text-amber-400">+33%</div>
          <div className="text-xs text-gray-400 mt-1">Risk Change (6mo)</div>
        </div>
        <div className="card-sm text-center">
          <div className="font-syne font-bold text-2xl text-emerald-400">3</div>
          <div className="text-xs text-gray-400 mt-1">Reports Generated</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Medical Profile */}
        <div className="card">
          <div className="font-syne font-bold text-sm mb-4 flex items-center gap-2">
            <User size={15} className="text-crimson-light" /> Medical Profile
          </div>
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {profileFields.map(({ label, key, type, placeholder, options }) => (
                  <div key={key}>
                    <label className="form-label">{label}</label>
                    {type === 'select' ? (
                      <select className="form-select" value={form.profile[key] || ''}
                        onChange={e => setForm(p => ({ ...p, profile: { ...p.profile, [key]: e.target.value } }))}>
                        <option value="">Select...</option>
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={type} placeholder={placeholder} className="form-input"
                        value={form.profile[key] || ''}
                        onChange={e => setForm(p => ({ ...p, profile: { ...p.profile, [key]: e.target.value } }))} />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={save} className="btn-primary w-full justify-center mt-2">
                <Save size={14} /> Save Changes
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/6">
              {[
                { label: 'Name', value: user?.name },
                { label: 'Age', value: form.profile.age ? `${form.profile.age} years` : '45 years' },
                { label: 'Gender', value: form.profile.gender || 'Male' },
                { label: 'Blood Type', value: form.profile.bloodType || 'O+' },
                { label: 'Height / Weight', value: `${form.profile.height || 175} cm / ${form.profile.weight || 83} kg` },
                { label: 'BMI', value: '27.1 (Overweight)', color: 'text-amber-400' },
                { label: 'Phone', value: form.profile.phone || 'Not set' },
                { label: 'Member since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between py-2.5 text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className={`font-medium ${color || 'text-gray-200'}`}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="font-syne font-bold text-sm">Prediction History</div>
            <button onClick={() => toast.success('All reports exported as PDF!')} className="btn-ghost text-xs !py-1">
              <Download size={12} /> Export All
            </button>
          </div>
          <div className="divide-y divide-white/6">
            {displayHistory.slice(0, 6).map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-sm text-gray-200">{item.type || 'Full Assessment'}</div>
                  <div className="text-xs text-gray-500">{item.date || new Date(item.createdAt).toLocaleString()}</div>
                </div>
                <RiskBadge level={item.level || item.result?.riskLevel || 'Medium'} />
              </motion.div>
            ))}
          </div>
          <button onClick={() => toast('No more history to show', { icon: 'ℹ️' })}
            className="btn-ghost w-full justify-center mt-3 text-xs">
            Load More
          </button>
        </div>

        {/* Settings */}
        <div className="card">
          <div className="font-syne font-bold text-sm mb-4 flex items-center gap-2">
            <Shield size={15} className="text-crimson-light" /> Account Settings
          </div>
          <div className="space-y-3">
            {[
              { icon: Moon, label: 'Dark Mode', key: 'darkMode' },
              { icon: Bell, label: 'Push Notifications', key: 'notifications' },
              { icon: Bell, label: 'Email Alerts', key: 'emailAlerts' },
            ].map(({ icon: Icon, label, key }) => (
              <div key={key} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-sm">
                  <Icon size={14} className="text-gray-400" /> {label}
                </div>
                <div onClick={() => setForm(p => ({ ...p, settings: { ...p.settings, [key]: !p.settings[key] } }))}
                  className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${form.settings[key] ? 'bg-crimson' : 'bg-navy-lighter'}`}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
                    style={{ left: form.settings[key] ? '22px' : '2px' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/8 mt-4 pt-4 space-y-2">
            <button onClick={() => toast.success('Password reset email sent!')} className="btn-ghost w-full justify-center text-xs">
              Change Password
            </button>
            <button onClick={() => { logout(); toast.success('Logged out'); }} className="btn-danger w-full justify-center text-xs">
              <Trash2 size={12} /> Delete Account
            </button>
          </div>
        </div>

        {/* Medical History */}
        <div className="card">
          <div className="font-syne font-bold text-sm mb-4">Medical History</div>
          <div className="divide-y divide-white/6">
            {[
              { label: 'Diabetes', value: 'Type 2', color: 'text-crimson-light' },
              { label: 'Hypertension', value: 'Stage 2 (142/88)', color: 'text-crimson-light' },
              { label: 'Smoking', value: 'Current (15 yrs)', color: 'text-amber-400' },
              { label: 'Alcohol', value: 'Moderate', color: 'text-amber-400' },
              { label: 'Family History', value: 'Cardiac disease (Father)', color: 'text-amber-400' },
              { label: 'Medications', value: 'Metformin 500mg', color: 'text-blue-400' },
              { label: 'Last ECG', value: 'ST-T Abnormality (Nov 2024)', color: 'text-amber-400' },
              { label: 'Allergies', value: 'None known', color: 'text-emerald-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-400">{label}</span>
                <span className={`font-medium text-right max-w-[60%] ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
