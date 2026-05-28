import { motion } from 'framer-motion'

export const RiskBadge = ({ level }) => {
  const cls = level === 'Low' ? 'badge-low' : level === 'Medium' ? 'badge-med' : 'badge-high'
  return (
    <span className={cls}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {level} Risk
    </span>
  )
}

export const StatCard = ({ icon: Icon, iconClass, value, label, change, changeType }) => (
  <motion.div whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
    className="card flex items-start gap-3 transition-colors">
    <div className={iconClass}><Icon size={19} /></div>
    <div>
      <div className="font-syne text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
      {change && (
        <div className={`text-xs mt-1 ${changeType === 'up' ? 'text-emerald-400' : 'text-crimson-light'}`}>
          {change}
        </div>
      )}
    </div>
  </motion.div>
)

export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
)

export const GaugeChart = ({ value, size = 160 }) => {
  const pct = Math.min(100, Math.max(0, value))
  const r = 54, cx = size / 2, cy = size / 2 - 10
  const arcLen = Math.PI * r
  const filled = (pct / 100) * arcLen
  const color = pct < 35 ? '#10B981' : pct < 65 ? '#F59E0B' : '#C1121F'
  const needleAngle = -180 + (pct / 100) * 180
  const rad = (needleAngle * Math.PI) / 180
  const nx = cx + (r - 10) * Math.cos(rad)
  const ny = cy + (r - 10) * Math.sin(rad)

  return (
    <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
      <defs>
        <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#C1121F" />
        </linearGradient>
      </defs>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="11" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="url(#gGrad)" strokeWidth="11" strokeLinecap="round"
        strokeDasharray={arcLen} strokeDashoffset={arcLen - filled} />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill={color} />
      <text x={cx} y={cy + 22} textAnchor="middle" fill="white" fontSize="20" fontWeight="800" fontFamily="Syne">
        {pct}%
      </text>
      <text x={cx} y={cy + 36} textAnchor="middle" fill="#9CA3AF" fontSize="10">Risk Score</text>
    </svg>
  )
}

export const FeatureBar = ({ label, value, max = 1 }) => {
  const pct = Math.round((value / max) * 100)
  const color = pct > 70 ? '#C1121F' : pct > 40 ? '#F59E0B' : '#10B981'
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-gray-400 w-36 truncate flex-shrink-0">{label}</div>
      <div className="flex-1 h-1.5 bg-navy rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.1 }}
          className="h-full rounded-full" style={{ background: color }} />
      </div>
      <div className="text-xs text-gray-500 w-9 text-right">{value.toFixed(2)}</div>
    </div>
  )
}

export const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-5">
    <h2 className="font-syne font-bold text-xl text-white">{title}</h2>
    {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
  </div>
)
