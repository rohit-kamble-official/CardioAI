import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const QUICK_QUESTIONS = [
  '🥗 What foods should I avoid with hypertension?',
  '🏃 What exercises are safe for medium cardiac risk?',
  '💊 How to lower cholesterol naturally?',
  '🚨 What are the warning signs of a heart attack?',
  '🚬 How does smoking affect heart disease risk?',
  '🥑 Tell me about the DASH diet for heart health',
  '😴 How does poor sleep affect heart risk?',
  '💪 What is the ideal BMI for heart health?',
]

const RESPONSES = {
  food: `For high blood pressure and heart health, avoid:
❌ High-sodium foods (processed meats, canned soups, fast food)
❌ Trans fats and saturated fats (fried foods, butter, red meat)
❌ Added sugars and refined carbs
❌ Excessive alcohol (>1 drink/day for women, >2 for men)
❌ Caffeinated drinks if sensitive

Prioritize instead:
✅ Fruits and vegetables (esp. potassium-rich: bananas, avocados, sweet potatoes)
✅ Whole grains (oats, brown rice, quinoa)
✅ Lean proteins (fish, legumes, skinless poultry)
✅ Healthy fats (olive oil, nuts, flaxseed)
✅ Low-fat dairy products`,

  exercise: `Safe exercises for medium-high cardiac risk:

✅ CARDIO (primary):
• Brisk walking: 30 min/day, 5 days/week
• Swimming or water aerobics
• Cycling (flat terrain, moderate pace)
• Dancing, yoga, tai chi

⚠️ GUIDELINES:
• Keep heart rate: 50–70% of max (220 − your age)
• Always warm up 5 min, cool down 5 min
• Stop if: chest pain, dizziness, severe shortness of breath

❌ AVOID (without medical clearance):
• High-intensity interval training (HIIT)
• Heavy weightlifting / powerlifting
• Competitive sports with sudden bursts`,

  cholesterol: `To lower cholesterol naturally:

🥑 Diet changes (most impactful):
• Soluble fiber: oats, beans, lentils, apples, psyllium
• Omega-3 fatty acids: salmon, mackerel, walnuts, flaxseed
• Plant sterols: fortified foods, olive oil
• Reduce: red meat, full-fat dairy, coconut/palm oil

🏃 Exercise:
• 30 min moderate cardio 5x/week reduces LDL by 5–10%
• Resistance training also helps raise HDL

🚭 Lifestyle:
• Quit smoking → raises HDL within weeks
• Lose 5–10% body weight if overweight
• Limit alcohol

⏱️ Timeline: Diet + exercise changes show effect in 6–12 weeks. If insufficient, statins may be needed — discuss with your doctor.`,

  warning: `🚨 HEART ATTACK WARNING SIGNS:

CLASSIC symptoms (call 112 IMMEDIATELY):
• Chest pain, pressure, squeezing or tightness
• Pain radiating to left arm, jaw, neck, shoulder, or back
• Shortness of breath (with or without chest pain)
• Cold sweat, nausea, or lightheadedness
• Sudden fatigue or weakness

WOMEN may also experience:
• Unusual fatigue
• Indigestion-like discomfort
• Jaw or upper back pain

⚡ ACT FAST — every minute matters:
1. Call 112 immediately — do NOT drive yourself
2. Chew 325mg aspirin (if not allergic and not contraindicated)
3. Loosen tight clothing, sit or lie down
4. Stay calm and wait for emergency services`,

  smoking: `How smoking damages your heart:

📈 Risk statistics:
• Smoking DOUBLES your risk of heart disease
• 1 in 5 cardiovascular deaths is smoking-related
• Even 1–4 cigarettes/day raises risk significantly

🔬 Mechanisms:
• Nicotine raises blood pressure and heart rate
• Carbon monoxide reduces blood oxygen capacity
• Damages arterial walls → accelerates atherosclerosis
• Promotes blood clotting → increases heart attack risk

✅ Benefits of quitting (timeline):
• 20 minutes: BP and heart rate normalize
• 12 hours: Carbon monoxide levels drop
• 1 year: Heart disease risk drops by 50%
• 5 years: Stroke risk equals non-smoker
• 15 years: Heart disease risk = non-smoker

🛑 Cessation options: Nicotine patches, varenicline (Champix), bupropion, or behavioral counseling. Combination therapy is most effective.`,

  dash: `The DASH Diet (Dietary Approaches to Stop Hypertension):

📋 Core principles:
• Sodium: <2,300mg/day (ideally <1,500mg)
• High in fruits & vegetables (8–10 servings/day)
• Whole grains: 6–8 servings/day
• Low-fat dairy: 2–3 servings/day
• Lean protein: fish 2x/week, limit red meat
• Nuts/seeds: 4–5 servings/week
• Limit sweets: <5/week

📊 Evidence-based results:
• Lowers systolic BP by 8–14 mmHg
• Reduces LDL cholesterol by 5–10%
• Improves insulin sensitivity

🕐 Timeline: Measurable BP reduction in 2 weeks. Full metabolic benefits in 8–12 weeks.

For your profile (BP 142/88), the DASH diet could potentially bring it to ~130–132/80 range.`,

  sleep: `Sleep and heart health:

😴 Why sleep matters for your heart:
• During deep sleep, BP drops 10–20% ("nocturnal dipping")
• Poor sleepers have 45–61% higher heart attack risk
• Sleep deprivation raises cortisol → increases BP
• Short sleep linked to obesity, diabetes, and inflammation

⚠️ Risks of <6 hours/night:
• 20% higher risk of heart attack
• Increased arterial stiffness
• Higher inflammatory markers (CRP, IL-6)
• Impaired blood sugar regulation

✅ Optimize your sleep:
• Target: 7–9 hours per night
• Keep consistent wake/sleep times (even weekends)
• Cool, dark room (65–68°F / 18–20°C)
• No screens 60 min before bed
• Avoid caffeine after 2 PM
• Screen for sleep apnea if you snore heavily`,

  bmi: `BMI and Cardiovascular Health:

📊 BMI Categories:
• Underweight: < 18.5
• Normal: 18.5–24.9 ✅
• Overweight: 25–29.9 ⚠️
• Obese Class I: 30–34.9 ❌
• Obese Class II: 35–39.9 ❌❌
• Obese Class III: ≥ 40 🚨

❤️ Heart risk at different BMIs:
• BMI 25–30: 30% higher heart disease risk
• BMI 30–35: 70% higher risk
• BMI >35: 2.5–3x higher risk

🎯 Target: BMI 20–25 is ideal for heart health. For most adults, losing just 5–10% of body weight significantly reduces BP, cholesterol, and blood sugar.

Important: BMI doesn't account for muscle mass or fat distribution. Waist circumference (<90cm men, <80cm women) is also a key cardiac risk indicator.`,

  default: `I'm your CardioAI Health Assistant, specialized in cardiac health guidance. I can help you with:

❤️ Topics I cover:
• Diet and nutrition for heart health
• Safe exercise recommendations
• Cholesterol and blood pressure management
• Understanding your risk factors
• Heart attack warning signs and prevention
• Lifestyle modifications (sleep, stress, smoking)
• Medications and what to ask your doctor

Based on your current profile (62% medium risk, BP 142/88, Cholesterol 215), I'd specifically recommend discussing blood pressure management and cholesterol-lowering strategies.

What would you like to know more about?`,
}

function classify(msg) {
  const m = msg.toLowerCase()
  if (m.includes('food') || m.includes('eat') || m.includes('diet') || m.includes('avoid') || m.includes('sodium')) return 'food'
  if (m.includes('exercise') || m.includes('workout') || m.includes('gym') || m.includes('safe') || m.includes('physical')) return 'exercise'
  if (m.includes('cholesterol') || m.includes('ldl') || m.includes('hdl')) return 'cholesterol'
  if (m.includes('warning') || m.includes('sign') || m.includes('symptom') || m.includes('attack') || m.includes('emergency')) return 'warning'
  if (m.includes('smok') || m.includes('cigarette') || m.includes('tobacco')) return 'smoking'
  if (m.includes('dash') || m.includes('blood pressure') || m.includes('hypert') || m.includes('sodium')) return 'dash'
  if (m.includes('sleep') || m.includes('insomnia') || m.includes('rest') || m.includes('hour')) return 'sleep'
  if (m.includes('bmi') || m.includes('weight') || m.includes('obese') || m.includes('overweight')) return 'bmi'
  return 'default'
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: `👋 Hello! I'm your CardioAI Health Assistant, powered by AI.\n\nI've reviewed your latest prediction showing a **62% medium cardiac risk** with elevated BP (142/88 mmHg) and cholesterol (215 mg/dL).\n\nHow can I help you today? Ask me anything about heart health, diet, exercise, or your specific risk factors.`, time: new Date() },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [aiMode, setAiMode] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(p => [...p, { role: 'user', text: msg, time: new Date() }])
    setTyping(true)

    if (aiMode) {
      // Try Claude API
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 600,
            system: 'You are a compassionate AI cardiac health assistant for CardioAI. The patient has a 62% medium heart attack risk, BP 142/88 mmHg, cholesterol 215 mg/dL, is a current smoker, and has Type 2 diabetes. Give concise, practical, medically accurate advice. Always recommend consulting a doctor for medical decisions. Format responses with clear sections using emojis.',
            messages: [{ role: 'user', content: msg }]
          })
        })
        const data = await res.json()
        const reply = data.content?.[0]?.text || RESPONSES[classify(msg)]
        setTyping(false)
        setMessages(p => [...p, { role: 'bot', text: reply, time: new Date() }])
      } catch {
        setTyping(false)
        setMessages(p => [...p, { role: 'bot', text: RESPONSES[classify(msg)], time: new Date() }])
      }
    } else {
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600))
      setTyping(false)
      setMessages(p => [...p, { role: 'bot', text: RESPONSES[classify(msg)], time: new Date() }])
    }
  }

  const formatText = (text) => text.split('\n').map((line, i) => (
    <span key={i}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}<br /></span>
  ))

  const fmtTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-syne font-bold text-xl">AI Health Assistant</h1>
          <p className="text-gray-400 text-sm mt-1">Personalized cardiac health guidance · Powered by AI</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs text-gray-400">Live AI</span>
          <div onClick={() => { setAiMode(p => !p); toast(aiMode ? 'Using preset responses' : 'Live AI mode enabled (requires API key)', { icon: aiMode ? '📴' : '⚡' }) }}
            className={`w-10 h-5 rounded-full transition-colors relative ${aiMode ? 'bg-crimson' : 'bg-navy-lighter'}`}>
            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${aiMode ? 'left-5.5' : 'left-0.5'}`} style={{ left: aiMode ? '22px' : '2px' }} />
          </div>
        </label>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="card flex-1 flex flex-col p-0 overflow-hidden" style={{ height: 520 }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
              <div className="w-8 h-8 rounded-full bg-crimson flex items-center justify-center">
                <Heart size={14} className="fill-white text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">CardioAI Assistant</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${m.role === 'bot' ? 'bg-crimson' : 'bg-blue-600'}`}>
                    {m.role === 'bot' ? <Bot size={13} className="text-white" /> : <User size={13} className="text-white" />}
                  </div>
                  <div className={`max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed
                      ${m.role === 'bot' ? 'bg-navy-light border border-white/8 rounded-tl-sm' : 'bg-crimson rounded-tr-sm'}`}>
                      {formatText(m.text)}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 px-1">{fmtTime(m.time)}</div>
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-crimson flex items-center justify-center">
                    <Bot size={13} className="text-white" />
                  </div>
                  <div className="bg-navy-light border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d }}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/8 p-3 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask about your heart health..."
                className="form-input flex-1 !py-2" />
              <button onClick={() => sendMessage()} disabled={typing || !input.trim()}
                className="btn-primary !py-2 !px-3 disabled:opacity-50">
                {typing ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card">
            <div className="font-syne font-bold text-sm mb-3">Quick Questions</div>
            <div className="space-y-2">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs text-gray-300 hover:text-white bg-navy hover:bg-navy-lighter border border-white/6 rounded-lg px-3 py-2 transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="font-syne font-bold text-sm mb-3">Your Health Context</div>
            <div className="space-y-2 text-xs divide-y divide-white/6">
              {[
                { label: 'Risk Score', value: '62% Medium', color: 'text-amber-400' },
                { label: 'Blood Pressure', value: '142/88 mmHg', color: 'text-crimson-light' },
                { label: 'Cholesterol', value: '215 mg/dL', color: 'text-amber-400' },
                { label: 'O₂ Level', value: '97%', color: 'text-emerald-400' },
                { label: 'Last Prediction', value: 'Today', color: 'text-gray-300' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between py-2">
                  <span className="text-gray-400">{label}</span>
                  <span className={`font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
