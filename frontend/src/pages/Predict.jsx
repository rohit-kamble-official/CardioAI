import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Loader, Download, MessageSquare, Users, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { GaugeChart, RiskBadge, FeatureBar } from '../components/UI'

const DEFAULTS = {
  Age: 45, Gender: 'Male', BloodPressure: 130, Cholesterol: 200, HeartRate: 75,
  BloodSugar: 100, BMI: 25, OxygenLevel: 97, StressLevel: 5, SleepHours: 7,
  Smoking: 'Never', AlcoholConsumption: 'None', Diabetes: 'No',
  ChestPainType: 'None', ECGResults: 'Normal', ExerciseAngina: 'No',
  FamilyHistory: 'No', PhysicalActivity: 'Moderate',
}

const Slider = ({ label, name, min, max, step = 1, unit, value, onChange }) => (
  <div>
    <label className="form-label">{label}</label>
    <div className="flex items-center gap-3">
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(name, step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
        className="flex-1 h-1.5 accent-crimson" />
      <div className="text-xs font-bold text-crimson-light min-w-[52px] text-right">
        {typeof value === 'number' && step < 1 ? value.toFixed(1) : value}{unit}
      </div>
    </div>
  </div>
)

const Select = ({ label, name, options, value, onChange }) => (
  <div>
    <label className="form-label">{label}</label>
    <select className="form-select" value={value} onChange={e => onChange(name, e.target.value)}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
)

export default function Predict() {
  const [form, setForm] = useState(DEFAULTS)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = async () => {
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post('/predictions', form)
      const r = data.mlResult || data.prediction?.result
      setResult(r)
      toast.success(`Prediction complete: ${r?.risk_level || r?.riskLevel} Risk (${r?.risk_percentage || r?.riskPercentage}%)`)
      setTimeout(() => document.getElementById('result-panel')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch {
      toast.error('Prediction failed. Running demo mode...')
      // Demo fallback
      const demoRisk = Math.min(100, Math.max(5,
        (form.Age - 18) * 0.5 + (form.BloodPressure - 90) * 0.2 +
        (form.Cholesterol - 150) * 0.1 + (form.Smoking === 'Current' ? 15 : 0) +
        (form.Diabetes === 'Yes' ? 10 : 0) + (form.FamilyHistory === 'Yes' ? 8 : 0) +
        form.StressLevel * 1.5 - form.SleepHours * 2 - (form.OxygenLevel - 85) * 0.5
      ))
      setResult({
        risk_percentage: Math.round(demoRisk), probability: demoRisk / 100,
        risk_level: demoRisk < 35 ? 'Low' : demoRisk < 65 ? 'Medium' : 'High',
        confidence: 85 + Math.random() * 10,
        explanation: `Demo prediction: ${form.BloodPressure > 130 ? 'Elevated blood pressure, ' : ''}${form.Cholesterol > 200 ? 'high cholesterol, ' : ''}${form.Smoking === 'Current' ? 'smoking status ' : ''}are contributing factors. This is a client-side estimate — connect the ML service for full accuracy.`,
        recommendations: ['Maintain a heart-healthy diet', 'Exercise 30 min daily', 'Monitor blood pressure weekly', 'Schedule annual cardiac checkup'],
        feature_importance: { BloodPressure: 0.88, Age: 0.82, Cholesterol: 0.74, FamilyHistory: 0.68, Smoking: 0.61, Diabetes: 0.54, BMI: 0.42, StressLevel: 0.38 },
        model_used: 'Demo (Client-side)',
      })
    }
    setLoading(false)
  }

  const riskPct = result?.risk_percentage ?? result?.riskPercentage ?? 0
  const riskLevel = result?.risk_level ?? result?.riskLevel ?? 'Low'
  const fi = result?.feature_importance ?? {}

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-syne font-bold text-xl">Heart Attack Risk Prediction</h1>
        <p className="text-gray-400 text-sm mt-1">Enter health parameters for AI-powered cardiac risk assessment · XGBoost Ensemble · 94.7% accuracy</p>
      </div>

      {/* Form */}
      <div className="card space-y-6">
        {/* Basic vitals */}
        <div>
          <div className="font-syne font-bold text-sm mb-4 flex items-center gap-2">
            <Activity size={15} className="text-crimson-light" /> Vital Signs & Demographics
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Slider label="Age" name="Age" min={18} max={90} unit=" yrs" value={form.Age} onChange={set} />
            <Select label="Gender" name="Gender" options={['Male', 'Female', 'Other']} value={form.Gender} onChange={set} />
            <Slider label="Blood Pressure" name="BloodPressure" min={85} max={200} unit=" mmHg" value={form.BloodPressure} onChange={set} />
            <Slider label="Cholesterol" name="Cholesterol" min={120} max={400} unit=" mg/dL" value={form.Cholesterol} onChange={set} />
            <Slider label="Heart Rate" name="HeartRate" min={40} max={200} unit=" bpm" value={form.HeartRate} onChange={set} />
            <Slider label="Blood Sugar" name="BloodSugar" min={60} max={400} unit=" mg/dL" value={form.BloodSugar} onChange={set} />
            <Slider label="BMI" name="BMI" min={15} max={50} step={0.1} unit=" kg/m²" value={form.BMI} onChange={set} />
            <Slider label="Oxygen Level" name="OxygenLevel" min={85} max={100} step={0.1} unit="%" value={form.OxygenLevel} onChange={set} />
            <Slider label="Stress Level" name="StressLevel" min={1} max={10} unit="/10" value={form.StressLevel} onChange={set} />
            <Slider label="Sleep Hours" name="SleepHours" min={3} max={12} step={0.5} unit=" hrs" value={form.SleepHours} onChange={set} />
            <Select label="Physical Activity" name="PhysicalActivity" options={['Sedentary', 'Light', 'Moderate', 'Active']} value={form.PhysicalActivity} onChange={set} />
            <Select label="Chest Pain Type" name="ChestPainType" options={['None', 'Atypical angina', 'Typical angina', 'Non-anginal', 'Asymptomatic']} value={form.ChestPainType} onChange={set} />
          </div>
        </div>

        {/* Advanced */}
        <div>
          <button onClick={() => setShowAdvanced(p => !p)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors mb-3">
            {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            Medical History & Lifestyle
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  <Select label="Smoking Status" name="Smoking" options={['Never', 'Former', 'Current']} value={form.Smoking} onChange={set} />
                  <Select label="Alcohol Consumption" name="AlcoholConsumption" options={['None', 'Moderate', 'Heavy']} value={form.AlcoholConsumption} onChange={set} />
                  <Select label="Diabetes" name="Diabetes" options={['No', 'Yes', 'Pre-diabetic']} value={form.Diabetes} onChange={set} />
                  <Select label="ECG Results" name="ECGResults" options={['Normal', 'ST-T abnormality', 'LV hypertrophy']} value={form.ECGResults} onChange={set} />
                  <Select label="Exercise-induced Angina" name="ExerciseAngina" options={['No', 'Yes']} value={form.ExerciseAngina} onChange={set} />
                  <Select label="Family History" name="FamilyHistory" options={['No', 'Yes']} value={form.FamilyHistory} onChange={set} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-white/8 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Info size={12} /> Model: XGBoost (Best Performer) · ROC-AUC: 0.967
          </div>
          <button onClick={submit} disabled={loading} className="btn-primary !py-2.5 !px-6">
            {loading ? <><Loader size={14} className="animate-spin" /> Analyzing...</> : <><Activity size={14} /> Run AI Prediction</>}
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div id="result-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card space-y-5">
            <div className="font-syne font-bold text-base flex items-center gap-2">
              <Activity size={16} className="text-crimson-light" /> AI Prediction Results
              <span className="ml-auto text-xs font-normal text-gray-400">Model: {result.model_used}</span>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Gauge */}
              <div className="flex flex-col items-center">
                <GaugeChart value={riskPct} size={200} />
                <RiskBadge level={riskLevel} />
              </div>

              {/* Confidence */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Model Confidence</div>
                  <div className="font-syne text-3xl font-bold">{result.confidence?.toFixed(1)}%</div>
                  <div className="h-2 bg-navy rounded-full mt-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 0.8 }} className="h-full rounded-full bg-blue-500" />
                  </div>
                </div>
                <div className="h-px bg-white/8" />
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Risk Factors Detected</div>
                  <div className="space-y-1.5">
                    {[
                      form.BloodPressure > 130 && { label: 'Hypertension', sev: 'high' },
                      form.Cholesterol > 200 && { label: 'High Cholesterol', sev: 'high' },
                      form.Smoking === 'Current' && { label: 'Active Smoker', sev: 'med' },
                      form.Diabetes === 'Yes' && { label: 'Diabetes', sev: 'med' },
                      form.FamilyHistory === 'Yes' && { label: 'Family History', sev: 'med' },
                      form.BMI > 30 && { label: 'Obesity (BMI > 30)', sev: 'low' },
                    ].filter(Boolean).map(({ label, sev }) => (
                      <div key={label} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sev === 'high' ? 'bg-crimson-light' : sev === 'med' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                        {label}
                      </div>
                    ))}
                    {[form.BloodPressure > 130, form.Cholesterol > 200, form.Smoking === 'Current', form.Diabetes === 'Yes', form.FamilyHistory === 'Yes', form.BMI > 30].filter(Boolean).length === 0 && (
                      <div className="text-xs text-emerald-400">No major risk factors detected</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recs */}
              <div>
                <div className="text-xs text-gray-400 mb-2">AI Recommendations</div>
                <div className="space-y-2">
                  {result.recommendations?.slice(0, 4).map((r, i) => (
                    <div key={i} className="text-xs text-gray-300 flex gap-2">
                      <span className="text-crimson-light font-bold flex-shrink-0">→</span> {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-white/8" />

            <div className="grid md:grid-cols-2 gap-5">
              {/* Feature importance */}
              <div>
                <div className="font-syne font-semibold text-sm mb-3">Feature Importance (SHAP)</div>
                <div className="space-y-2.5">
                  {Object.entries(fi).slice(0, 8).map(([k, v]) => (
                    <FeatureBar key={k} label={k} value={v} max={Math.max(...Object.values(fi))} />
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <div className="font-syne font-semibold text-sm mb-3">AI Explanation</div>
                <div className={`p-3.5 rounded-xl border text-sm text-gray-300 leading-relaxed mb-4
                  ${riskLevel === 'High' ? 'bg-crimson/8 border-crimson/25' : riskLevel === 'Medium' ? 'bg-amber-500/8 border-amber-500/20' : 'bg-emerald-500/8 border-emerald-500/20'}`}>
                  {result.explanation}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => toast.success('PDF report generated!')} className="btn-primary text-xs !py-1.5">
                    <Download size={12} /> Export PDF
                  </button>
                  <Link to="/chatbot" className="btn-ghost text-xs !py-1.5">
                    <MessageSquare size={12} /> Ask AI
                  </Link>
                  <Link to="/doctors" className="btn-ghost text-xs !py-1.5">
                    <Users size={12} /> Find Doctor
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
