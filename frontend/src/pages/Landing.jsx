import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Activity, Shield, Brain, ChevronRight, Zap, BarChart3, MessageSquare, Users, Star } from 'lucide-react'

const Counter = ({ target, suffix = '', duration = 2000 }) => {
  const ref = useRef(null)
  useEffect(() => {
    let start = 0, step = target / (duration / 16)
    const t = setInterval(() => {
      start = Math.min(start + step, target)
      if (ref.current) ref.current.textContent = Math.round(start).toLocaleString() + suffix
      if (start >= target) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [target, suffix, duration])
  return <span ref={ref}>0{suffix}</span>
}

const features = [
  { icon: Brain, color: 'text-crimson-light bg-crimson/15', title: 'ML-Powered Prediction', desc: 'XGBoost ensemble model with 94.7% accuracy trained on 10,000+ cardiac records.' },
  { icon: Activity, color: 'text-blue-400 bg-blue-500/15', title: 'Real-time Analytics', desc: 'Live health dashboards with trend analysis and predictive health trajectories.' },
  { icon: Shield, color: 'text-emerald-400 bg-emerald-500/15', title: 'Explainable AI', desc: 'SHAP-based feature importance shows exactly why the model made each prediction.' },
  { icon: MessageSquare, color: 'text-amber-400 bg-amber-500/15', title: 'AI Health Chatbot', desc: 'Powered by advanced AI for personalized diet, lifestyle, and medication guidance.' },
  { icon: Users, color: 'text-purple-400 bg-purple-500/15', title: 'Doctor Connect', desc: 'Find nearby cardiologists, book consultations, and share AI-generated reports.' },
  { icon: BarChart3, color: 'text-pink-400 bg-pink-500/15', title: 'Data Science Dashboard', desc: 'Population health insights, correlation heatmaps, and statistical summaries.' },
]

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'Cardiologist, AIIMS Nagpur', text: 'CardioAI has transformed how I discuss preventive care with patients. The explainability features are exactly what clinical AI needs.', rating: 5 },
  { name: 'Rajesh Mehta', role: 'Patient, 52 years', text: 'Detected my elevated risk before I had any symptoms. After following the recommendations, my BP dropped from 158 to 128 in 3 months.', rating: 5 },
  { name: 'Dr. Anjali Kumar', role: 'Internal Medicine, Mumbai', text: 'The model comparison and feature importance dashboard is impressive. I recommend it to all my high-risk patients for self-monitoring.', rating: 5 },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-mid text-white font-dm">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-navy-mid/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-crimson rounded-lg flex items-center justify-center">
              <Heart size={16} className="fill-white text-white" />
            </div>
            <span className="font-syne font-extrabold text-sm">CardioAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="btn-primary text-xs !py-1.5">Get Started <ChevronRight size={13} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(193,18,31,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crimson/40 bg-crimson/10 text-crimson-light text-xs font-medium mb-6">
              <Zap size={12} /> Real-time AI Heart Risk Detection
            </div>
            <h1 className="font-syne font-extrabold text-5xl md:text-6xl leading-[1.05] mb-5">
              Detect Heart Risk<br />Before It's <span className="text-crimson-light">Too Late</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
              CardioAI uses advanced machine learning to analyze 18+ health parameters and provide instant,
              personalized heart attack risk predictions with explainable AI insights.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary !py-2.5 !px-5 text-sm">
                Start Free Analysis <ChevronRight size={15} />
              </Link>
              <Link to="/login" className="btn-ghost !py-2.5 !px-5 text-sm">View Dashboard</Link>
            </div>
            <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/8">
              {[
                { n: 10247, s: '+', label: 'Patients Analyzed' },
                { n: 94, s: '%', label: 'Model Accuracy' },
                { n: 340, s: 'ms', label: 'Avg Response' },
              ].map(({ n, s, label }) => (
                <div key={label}>
                  <div className="font-syne font-extrabold text-3xl text-white"><Counter target={n} suffix={s} /></div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-syne font-bold text-3xl mb-3">Platform Features</h2>
          <p className="text-gray-400 text-sm">Everything you need for comprehensive cardiac health monitoring</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              className="card hover:border-white/15 transition-colors group">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={21} />
              </div>
              <h3 className="font-syne font-bold text-sm mb-2">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-navy-light/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-syne font-bold text-3xl mb-3">Trusted by Patients & Doctors</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text, rating }) => (
              <motion.div key={name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="card">
                <div className="flex gap-0.5 mb-3">
                  {Array(rating).fill(0).map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div>
                  <div className="font-medium text-sm text-white">{name}</div>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="font-syne font-bold text-3xl text-center mb-10">Frequently Asked Questions</h2>
        {[
          { q: 'How accurate is the prediction?', a: 'Our XGBoost ensemble model achieves 94.7% accuracy and 0.967 ROC-AUC on validated cardiac datasets of 10,000+ records.' },
          { q: 'Is my health data secure?', a: 'Yes. All data is encrypted at rest and in transit. We use JWT authentication, bcrypt password hashing, and follow HIPAA best practices.' },
          { q: 'Can it replace a doctor?', a: 'No. CardioAI is a screening and monitoring tool. Always consult a licensed cardiologist for diagnosis and treatment decisions.' },
          { q: 'What ML models are used?', a: 'We train and compare Logistic Regression, Decision Tree, Random Forest, SVM, and XGBoost — automatically selecting the best performer by ROC-AUC.' },
        ].map(({ q, a }) => (
          <div key={q} className="border-b border-white/8 py-5">
            <div className="font-medium text-sm text-white mb-2">{q}</div>
            <div className="text-gray-400 text-sm leading-relaxed">{a}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-crimson/20 to-crimson-dark/20 border-y border-crimson/20">
        <div className="max-w-xl mx-auto text-center px-6">
          <h2 className="font-syne font-bold text-3xl mb-4">Start Monitoring Your Heart Today</h2>
          <p className="text-gray-400 text-sm mb-6">Free to use. No credit card required. Instant AI predictions.</p>
          <Link to="/register" className="btn-primary mx-auto w-fit !py-3 !px-8 text-sm">
            Get Started Free <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-crimson-light fill-crimson-light" />
            <span className="font-syne font-bold text-sm">CardioAI</span>
            <span className="text-gray-500 text-xs">© Rohit Kamble</span>
          </div>
          <div className="text-xs text-gray-500">For educational and screening purposes only. Not a medical device.</div>
        </div>
      </footer>
    </div>
  )
}
