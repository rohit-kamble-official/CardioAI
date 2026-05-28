import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Activity, Shield, Clock, TrendingUp, ChevronRight, AlertTriangle } from 'lucide-react'
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthStore } from '../context/authStore'
import { StatCard, RiskBadge, GaugeChart, SectionHeader, Skeleton } from '../components/UI'
import api from '../utils/api'

const trendData = [
  { date: 'Oct 1', risk: 29 }, { date: 'Oct 15', risk: 35 }, { date: 'Oct 28', risk: 41 },
  { date: 'Nov 5', risk: 44 }, { date: 'Nov 12', risk: 52 }, { date: 'Nov 19', risk: 58 }, { date: 'Today', risk: 62 },
]

const radarData = [
  { metric: 'BP', current: 88, target: 60 }, { metric: 'Cholesterol', current: 72, target: 50 },
  { metric: 'Heart Rate', current: 65, target: 60 }, { metric: 'BMI', current: 68, target: 55 },
  { metric: 'O₂ Level', current: 97, target: 99 }, { metric: 'Stress', current: 70, target: 40 },
]

const mockHistory = [
  { date: 'Today, 10:32 AM', type: 'Full Assessment', risk: 62, level: 'Medium' },
  { date: 'Yesterday, 4:15 PM', type: 'Quick Check', risk: 58, level: 'Medium' },
  { date: 'Nov 12, 2:00 PM', type: 'Full Assessment', risk: 41, level: 'Low' },
  { date: 'Oct 28, 11:20 AM', type: 'Full Assessment', risk: 35, level: 'Low' },
  { date: 'Oct 15, 9:00 AM', type: 'Quick Check', risk: 29, level: 'Low' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-lighter border border-white/10 rounded-lg px-3 py-2 text-xs">
      <div className="text-gray-400">{label}</div>
      <div className="font-bold text-crimson-light">{payload[0].value}% Risk</div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const firstName = user?.name?.split(' ')[0] || 'there'

  useEffect(() => {
    api.get('/predictions/history')
      .then(r => setHistory(r.data.predictions || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-syne font-extrabold text-2xl">{greeting}, {firstName} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Your health summary · Last prediction: 2 hours ago</p>
      </div>

      {/* Alert */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/25">
        <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-semibold text-amber-300">Medium Risk Detected — </span>
          <span className="text-gray-300">Your BP (142/88) and cholesterol (215 mg/dL) have trended upward. Consider scheduling a cardiologist visit.</span>
        </div>
        <Link to="/doctors" className="ml-auto btn-ghost !text-xs !py-1 flex-shrink-0">Book <ChevronRight size={12} /></Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Heart} iconClass="stat-icon-red" value="62%" label="Current Risk Score" change="↑ 4% from last week" changeType="down" />
        <StatCard icon={Activity} iconClass="stat-icon-amber" value="142/88" label="Blood Pressure" change="Stage 2 Hypertension" changeType="down" />
        <StatCard icon={Clock} iconClass="stat-icon-green" value="78 bpm" label="Heart Rate" change="↓ 3 from yesterday" changeType="up" />
        <StatCard icon={Shield} iconClass="stat-icon-blue" value="97%" label="O₂ Saturation" change="↑ Normal range" changeType="up" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="mb-4">
            <div className="font-syne font-bold text-sm">Risk Score Trend</div>
            <div className="text-xs text-gray-400">Last 30 days progression</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} domain={[20, 75]} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="risk" stroke="#C1121F" strokeWidth={2}
                dot={{ fill: '#C1121F', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="mb-4">
            <div className="font-syne font-bold text-sm">Vitals Overview</div>
            <div className="text-xs text-gray-400">Current vs target values</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Radar name="Current" dataKey="current" stroke="#C1121F" fill="#C1121F" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.06} strokeWidth={1.5} strokeDasharray="4 2" />
              <Tooltip contentStyle={{ background: '#1E2A3B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights + History */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="font-syne font-bold text-sm">AI Health Insights</div>
            <RiskBadge level="Medium" />
          </div>
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3.5 mb-4 text-sm text-gray-300 leading-relaxed">
            <strong className="text-amber-300">⚠ Key Finding: </strong>
            Elevated BP (142/88 mmHg) combined with cholesterol of 215 mg/dL has increased your cardiac risk by 18% vs last month. Immediate lifestyle intervention recommended.
          </div>
          <div className="space-y-2.5">
            {[
              { color: 'bg-emerald-500/12 text-emerald-400', label: 'Reduce sodium intake to <2g/day', priority: 'High · BP reduction' },
              { color: 'bg-blue-500/12 text-blue-400', label: '30 min aerobic exercise daily', priority: 'Medium · Cardio fitness' },
              { color: 'bg-crimson/12 text-crimson-light', label: 'Schedule cardiologist visit', priority: 'High · Professional eval' },
            ].map(({ color, label, priority }) => (
              <div key={label} className="flex items-start gap-3 p-3 bg-navy rounded-lg border border-white/5">
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${color}`}>
                  <TrendingUp size={14} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-200">{label}</div>
                  <div className="text-xs text-gray-500">{priority}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="font-syne font-bold text-sm">Prediction History</div>
            <Link to="/profile" className="text-xs text-crimson-light hover:underline flex items-center gap-1">
              View all <ChevronRight size={11} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <div className="divide-y divide-white/6">
              {(history.length ? history.slice(0, 5) : mockHistory).map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-200">{item.type || item.result?.riskLevel ? 'Full Assessment' : 'Check'}</div>
                    <div className="text-xs text-gray-500">{item.date || new Date(item.createdAt).toLocaleString()}</div>
                  </div>
                  <RiskBadge level={item.level || item.result?.riskLevel || 'Medium'} />
                </div>
              ))}
            </div>
          )}
          <Link to="/predict" className="btn-primary w-full justify-center mt-4 text-xs">
            New Prediction <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* Gauge */}
      <div className="card flex flex-col items-center py-6">
        <div className="font-syne font-bold text-sm mb-4">Current Risk Score</div>
        <GaugeChart value={62} size={220} />
        <div className="mt-3 grid grid-cols-3 gap-8 text-center">
          <div><div className="text-xs text-gray-400">Low</div><div className="text-xs font-bold text-emerald-400">0–35%</div></div>
          <div><div className="text-xs text-gray-400">Medium</div><div className="text-xs font-bold text-amber-400">35–65%</div></div>
          <div><div className="text-xs text-gray-400">High</div><div className="text-xs font-bold text-crimson-light">65–100%</div></div>
        </div>
      </div>
    </div>
  )
}
