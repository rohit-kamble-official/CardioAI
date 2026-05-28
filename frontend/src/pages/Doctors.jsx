import { motion } from 'framer-motion'
import { MapPin, Star, Clock, Phone, Video, AlertTriangle, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const doctors = [
  {
    initials: 'PS', color: 'from-blue-700 to-blue-500',
    name: 'Dr. Priya Sharma', qual: 'DM Cardiology · 18 yrs experience',
    rating: 4.9, reviews: 312, hospital: 'AIIMS Nagpur', dist: '2.1 km',
    fee: '₹800', avail: 'Today', availColor: 'badge-low',
    tags: ['Interventional Cardiology', 'Hypertension', 'Heart Failure'],
    phone: '+91 712 280 1234',
  },
  {
    initials: 'RK', color: 'from-emerald-700 to-emerald-500',
    name: 'Dr. Rahul Kumar', qual: 'MD, DNB Cardiology · 24 yrs experience',
    rating: 4.8, reviews: 489, hospital: 'Orange City Hospital', dist: '3.8 km',
    fee: '₹1,200', avail: 'Fri, 2 PM', availColor: 'badge-med',
    tags: ['Preventive Cardiology', 'Diabetes & Heart', 'ECG Specialist'],
    phone: '+91 712 556 7890',
  },
  {
    initials: 'AM', color: 'from-purple-700 to-purple-500',
    name: 'Dr. Anjali Mehta', qual: 'MBBS, MD, FACC · 12 yrs experience',
    rating: 4.7, reviews: 156, hospital: 'Wockhardt Heart Institute', dist: '5.2 km',
    fee: '₹600', avail: 'Available Now', availColor: 'badge-low',
    tags: ['Women\'s Cardiology', 'Lifestyle Medicine', 'Risk Assessment'],
    phone: '+91 712 334 5678',
    video: true,
  },
  {
    initials: 'VD', color: 'from-amber-700 to-amber-500',
    name: 'Dr. Vijay Deshmukh', qual: 'MS, MCh Cardiac Surgery · 30 yrs experience',
    rating: 4.9, reviews: 720, hospital: 'Care CHL Hospital', dist: '6.0 km',
    fee: '₹2,000', avail: 'Mon, 10 AM', availColor: 'badge-med',
    tags: ['Cardiac Surgery', 'Bypass Surgery', 'Valve Repair'],
    phone: '+91 712 442 9900',
  },
]

const precautions = [
  { icon: '🥗', title: 'Dietary Changes', desc: 'Adopt the DASH diet, reduce sodium to <2g/day, eliminate trans fats.' },
  { icon: '🏃', title: 'Regular Exercise', desc: 'Aim for 150 minutes of moderate aerobic exercise per week.' },
  { icon: '🚭', title: 'Quit Smoking', desc: 'Smoking cessation reduces cardiac risk by 50% within 12 months.' },
  { icon: '💊', title: 'Medication Adherence', desc: 'Take prescribed medications consistently; never skip doses.' },
  { icon: '📊', title: 'Monitor Vitals', desc: 'Check blood pressure and blood sugar daily at home.' },
  { icon: '😴', title: 'Quality Sleep', desc: 'Maintain 7–9 hours of sleep; screen for sleep apnea if needed.' },
]

export default function Doctors() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-syne font-bold text-xl">Cardiologist Recommendations</h1>
        <p className="text-gray-400 text-sm mt-1">Based on your risk profile · Nagpur, Maharashtra</p>
      </div>

      {/* Emergency Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-crimson/10 border border-crimson/30">
        <div className="w-9 h-9 rounded-xl bg-crimson flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-crimson-light">Medium-High Risk — Professional Consultation Recommended</div>
          <div className="text-xs text-gray-400">Your AI assessment suggests scheduling a cardiologist visit within 2 weeks.</div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => toast('Emergency: Call 112 immediately for chest pain!', { icon: '🚨', duration: 5000 })}
            className="btn-primary text-xs !py-1.5">🚨 Emergency: 112</button>
        </div>
      </div>

      {/* Doctors list */}
      <div className="space-y-4">
        {doctors.map((doc, i) => (
          <motion.div key={doc.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card flex flex-col sm:flex-row gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doc.color} flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0`}>
              {doc.initials}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-syne font-bold text-base">{doc.name}</div>
                  <div className="text-xs text-gray-400">{doc.qual}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array(5).fill(0).map((_, j) => (
                      <Star key={j} size={11} className={j < Math.floor(doc.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{doc.rating} ({doc.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={doc.availColor}><span className="w-1.5 h-1.5 rounded-full bg-current" />{doc.avail}</span>
                  <button onClick={() => toast.success(`Appointment request sent to ${doc.name}!`)}
                    className="btn-primary text-xs !py-1.5">Book Appointment</button>
                  {doc.video && (
                    <button onClick={() => toast.success(`Video consultation booked with ${doc.name}!`)}
                      className="btn-ghost text-xs !py-1.5"><Video size={12} /> Video</button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={11} /> {doc.hospital} · {doc.dist}</span>
                <span className="flex items-center gap-1"><Phone size={11} /> {doc.phone}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> Fee: {doc.fee}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {doc.tags.map(t => (
                  <span key={t} className="text-[10px] bg-navy border border-white/8 text-gray-400 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Health Precautions */}
      <div>
        <h2 className="font-syne font-bold text-base mb-4">Health Precautions for Your Risk Level</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {precautions.map(({ icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-sm flex gap-3 hover:border-white/15 transition-colors">
              <div className="text-2xl flex-shrink-0">{icon}</div>
              <div>
                <div className="font-medium text-sm mb-1">{title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency card */}
      <div className="card bg-gradient-to-r from-crimson/15 to-crimson-dark/10 border-crimson/30">
        <div className="font-syne font-bold text-sm mb-2">🚨 Emergency Information</div>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div><div className="text-xs text-gray-400 mb-1">Emergency Services</div><div className="font-bold text-crimson-light">112</div></div>
          <div><div className="text-xs text-gray-400 mb-1">Ambulance (108)</div><div className="font-bold text-crimson-light">108</div></div>
          <div><div className="text-xs text-gray-400 mb-1">AIIMS Nagpur Emergency</div><div className="font-bold text-crimson-light">+91 712 280 1000</div></div>
        </div>
      </div>
    </div>
  )
}
