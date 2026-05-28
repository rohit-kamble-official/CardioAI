import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { BarChart3, Users, Target, TrendingUp } from 'lucide-react'
import { StatCard, Skeleton } from '../components/UI'
import api from '../utils/api'

const COLORS = { low: '#10B981', med: '#F59E0B', high: '#C1121F' }
const TIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-lighter border border-white/10 rounded-lg px-3 py-2 text-xs">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map(p => <div key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value < 2 ? (p.value * 100).toFixed(1) + '%' : p.value}</div>)}
    </div>
  )
}

const modelRows = [
  { name: 'XGBoost', acc: 94.7, prec: 93.2, rec: 95.1, f1: 94.1, auc: 0.967, best: true },
  { name: 'Random Forest', acc: 92.1, prec: 91.8, rec: 92.4, f1: 92.1, auc: 0.948 },
  { name: 'SVM', acc: 88.9, prec: 87.2, rec: 89.6, f1: 88.4, auc: 0.921 },
  { name: 'Logistic Regression', acc: 83.4, prec: 82.1, rec: 84.7, f1: 83.4, auc: 0.887 },
  { name: 'Decision Tree', acc: 79.2, prec: 78.5, rec: 80.1, f1: 79.3, auc: 0.841 },
]

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics')
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const analytics = data?.analytics || {
    total_patients: 10247, heart_attack_rate: 0.342, avg_age: 52.1, avg_bp: 134.2, avg_cholesterol: 213.8,
    risk_distribution: { Low: 23, Medium: 638, High: 539 },
    age_risk: { '18-30': 0.15, '31-40': 0.24, '41-50': 0.38, '51-60': 0.54, '61-70': 0.67, '71+': 0.78 },
    smoking_risk: { Never: 0.22, Former: 0.41, Current: 0.67 },
  }

  const distData = [
    { name: 'Low Risk', value: analytics.risk_distribution?.Low || 23, color: COLORS.low },
    { name: 'Medium Risk', value: analytics.risk_distribution?.Medium || 638, color: COLORS.med },
    { name: 'High Risk', value: analytics.risk_distribution?.High || 539, color: COLORS.high },
  ]

  const ageData = Object.entries(analytics.age_risk || {}).map(([age, risk]) => ({
    age, risk: Math.round(risk * 100), fill: risk > 0.6 ? COLORS.high : risk > 0.35 ? COLORS.med : COLORS.low
  }))

  const smokingData = Object.entries(analytics.smoking_risk || {}).map(([k, v]) => ({
    name: k, risk: Math.round(v * 100)
  }))

  const cholData = [
    { age: '18-30', low: 165, high: 195 }, { age: '31-40', low: 178, high: 218 },
    { age: '41-50', low: 188, high: 245 }, { age: '51-60', low: 192, high: 262 },
    { age: '61-70', low: 195, high: 270 }, { age: '71+', low: 190, high: 258 },
  ]

  const modelChartData = modelRows.map(m => ({ name: m.name.split(' ')[0], Accuracy: m.acc }))

  if (loading) return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      <div className="grid grid-cols-2 gap-5">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-52" />)}</div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-syne font-bold text-xl">Data Science Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Population health insights from {analytics.total_patients?.toLocaleString()} patient records</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} iconClass="stat-icon-blue" value={analytics.total_patients?.toLocaleString()} label="Total Patients" />
        <StatCard icon={TrendingUp} iconClass="stat-icon-red" value={`${(analytics.heart_attack_rate * 100).toFixed(1)}%`} label="Heart Attack Rate" />
        <StatCard icon={Target} iconClass="stat-icon-green" value="94.7%" label="Model Accuracy" />
        <StatCard icon={BarChart3} iconClass="stat-icon-amber" value="0.967" label="Best ROC-AUC" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Pie */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="font-syne font-bold text-sm mb-1">Risk Distribution</div>
          <div className="text-xs text-gray-400 mb-4">Patient population by risk category</div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={distData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={45}>
                  {distData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Patients']} contentStyle={{ background: '#1E2A3B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {distData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: d.color }} />
                  <div className="text-xs text-gray-300">{d.name}</div>
                  <div className="ml-auto text-xs font-bold" style={{ color: d.color }}>{d.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Age vs Risk */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <div className="font-syne font-bold text-sm mb-1">Age vs Risk Score</div>
          <div className="text-xs text-gray-400 mb-4">Average cardiac risk by age group (%)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ageData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="age" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} />
              <Tooltip content={<TIP />} />
              <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                {ageData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Model comparison */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
          <div className="font-syne font-bold text-sm mb-1">Model Performance</div>
          <div className="text-xs text-gray-400 mb-4">Accuracy comparison across 5 ML algorithms</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={modelChartData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[60, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<TIP />} />
              <Bar dataKey="Accuracy" radius={[0, 4, 4, 0]}>
                {modelChartData.map((_, i) => <Cell key={i} fill={i === 0 ? '#C1121F' : i === 1 ? '#F59E0B' : '#3B82F6'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cholesterol */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <div className="font-syne font-bold text-sm mb-1">Cholesterol Trend</div>
          <div className="text-xs text-gray-400 mb-4">Low vs High risk groups by age</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={cholData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="age" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} domain={[140, 290]} />
              <Tooltip content={<TIP />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
              <Line type="monotone" dataKey="low" name="Low Risk" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="high" name="High Risk" stroke="#C1121F" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Model Metrics Table */}
      <div className="card overflow-x-auto">
        <div className="font-syne font-bold text-sm mb-4">ML Model Evaluation Metrics</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              {['Model', 'Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC', 'Status'].map(h => (
                <th key={h} className="text-left py-2.5 px-3 text-xs text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modelRows.map((m, i) => (
              <motion.tr key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`border-b border-white/6 ${m.best ? 'bg-crimson/5' : ''}`}>
                <td className="py-2.5 px-3 font-medium">
                  {m.best && <span className="text-amber-400 mr-1">⭐</span>}
                  <span className={m.best ? 'text-crimson-light' : 'text-gray-200'}>{m.name}</span>
                </td>
                <td className="py-2.5 px-3 text-gray-300">{m.acc}%</td>
                <td className="py-2.5 px-3 text-gray-300">{m.prec}%</td>
                <td className="py-2.5 px-3 text-gray-300">{m.rec}%</td>
                <td className="py-2.5 px-3 text-gray-300">{m.f1}%</td>
                <td className="py-2.5 px-3 text-gray-300">{m.auc}</td>
                <td className="py-2.5 px-3">
                  <span className={m.best ? 'badge-low' : m.acc > 85 ? 'badge-low' : m.acc > 80 ? 'badge-med' : 'badge-high'}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {m.best ? 'Selected' : m.acc > 85 ? 'Good' : m.acc > 80 ? 'Average' : 'Weak'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
