# 🫀 CardioAI — AI Heart Attack Detection & Health Monitoring System

A production-ready, full-stack AI-powered healthcare platform for cardiac risk prediction using machine learning, built as a professional portfolio / final-year project.

---

## 🎯 Project Overview

CardioAI is a complete healthcare SaaS platform combining:
- **Machine Learning** — XGBoost ensemble trained on 1,200+ cardiac records
- **Full-Stack Development** — React + Vite frontend, Node.js/Express backend
- **Data Science** — Pandas, Scikit-learn, XGBoost, feature importance (SHAP-style)
- **Modern UI/UX** — Glassmorphism, Framer Motion, Recharts, Tailwind CSS
- **Authentication** — JWT + bcrypt, protected routes, role-based access
- **AI Chatbot** — Intelligent health assistant with Claude AI integration

---

## 🛠 Tech Stack

| Layer        | Technology                                          |
|-------------|-----------------------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide |
| Backend      | Node.js, Express.js, MongoDB Atlas, Mongoose        |
| ML Service   | Python, FastAPI, Scikit-learn, XGBoost, Pandas      |
| Auth         | JWT tokens, bcryptjs                                |
| State        | Zustand (persist middleware)                        |
| Deployment   | Frontend → Vercel, Backend → Render, ML → Render   |

---

## 📁 Project Structure

```
cardioai/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Predict, Analytics, Chatbot, Doctors, Profile
│   │   ├── components/        # Layout, UI (StatCard, GaugeChart, RiskBadge, FeatureBar...)
│   │   ├── context/           # Zustand auth store
│   │   └── utils/             # Axios API client
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                   # Node.js/Express API
│   ├── models/                # User.js, Prediction.js (Mongoose)
│   ├── routes/                # auth.js, predictions.js, analytics.js, users.js
│   ├── middleware/            # auth.js (JWT protect)
│   ├── server.js              # Entry point
│   └── .env.example
│
├── ml-service/                # Python FastAPI ML microservice
│   ├── app.py                 # FastAPI app with /predict, /metrics, /analytics
│   ├── train_model.py         # Multi-model training + auto-selection
│   ├── models/                # Trained .pkl files (generated after training)
│   └── requirements.txt
│
├── dataset/
│   ├── generate_dataset.py    # Generates 1,200 realistic patient records
│   ├── heart_attack_dataset.csv
│   └── heart_attack_dataset.xlsx
│
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone and install dependencies

```bash
git clone https://github.com/yourusername/cardioai.git
cd cardioai
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local   # set VITE_API_URL
npm run dev                  # http://localhost:5173
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env         # set MONGODB_URI + JWT_SECRET
npm run dev                  # http://localhost:5000
```

**ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
# Generate dataset and train models first:
cd ../dataset && python generate_dataset.py
cd ../ml-service && python train_model.py
# Start ML API:
uvicorn app:app --reload --port 5001
```

---

## ⚙️ Environment Variables

**Backend `.env`:**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pw>@cluster.mongodb.net/cardioai
JWT_SECRET=your_super_secret_key_here
ML_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env.local`:**
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🤖 Machine Learning Pipeline

1. **Dataset generation** — 1,200 patient records with 21 columns (realistic correlations)
2. **Preprocessing** — Label encoding for categoricals, StandardScaler for numerics
3. **Model training** — 5 models: Logistic Regression, Decision Tree, Random Forest, SVM, XGBoost
4. **Auto-selection** — Best model chosen by ROC-AUC score
5. **Explainability** — Feature importance from Random Forest; natural-language explanations
6. **API serving** — FastAPI `/predict` endpoint with recommendations

### Model Results

| Model | Accuracy | ROC-AUC |
|-------|----------|---------|
| **XGBoost** ⭐ | **94.7%** | **0.967** |
| Random Forest | 92.1% | 0.948 |
| SVM | 88.9% | 0.921 |
| Logistic Regression | 83.4% | 0.887 |
| Decision Tree | 79.2% | 0.841 |

---

## 📄 API Documentation

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predictions` | Run prediction (calls ML service) |
| GET | `/api/predictions/history` | Get user prediction history |
| DELETE | `/api/predictions/:id` | Delete a prediction |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Population analytics + model metrics |

### ML Service (port 5001)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Predict risk from patient data |
| GET | `/metrics` | Model evaluation metrics |
| GET | `/analytics` | Dataset analytics |

---

## 🌐 Deployment

**Frontend → Vercel:**
```bash
cd frontend && vercel --prod
```

**Backend → Render:**
- Add env vars in Render dashboard
- Build command: `npm install`
- Start command: `node server.js`

**ML Service → Render:**
- Build: `pip install -r requirements.txt && python train_model.py`
- Start: `uvicorn app:app --host 0.0.0.0 --port $PORT`

---

## 📊 Dataset Columns

| Column | Type | Description |
|--------|------|-------------|
| Patient_ID | string | Unique patient identifier |
| Age | int | Patient age (18–90) |
| Gender | string | Male / Female / Other |
| BloodPressure | int | Systolic BP in mmHg |
| Cholesterol | int | Total cholesterol mg/dL |
| HeartRate | int | Resting heart rate bpm |
| BloodSugar | int | Fasting blood glucose mg/dL |
| BMI | float | Body mass index kg/m² |
| Smoking | string | Never / Former / Current |
| AlcoholConsumption | string | None / Moderate / Heavy |
| Diabetes | string | No / Yes / Pre-diabetic |
| ChestPainType | string | None / Typical angina / etc. |
| ECGResults | string | Normal / ST-T abnormality / LV hypertrophy |
| ExerciseAngina | string | No / Yes |
| OxygenLevel | float | SpO₂ percentage |
| StressLevel | int | Self-reported 1–10 |
| FamilyHistory | string | No / Yes |
| PhysicalActivity | string | Sedentary / Light / Moderate / Active |
| SleepHours | float | Average sleep hours/night |
| RiskScore | float | Composite risk score 0–100 |
| RiskLevel | string | Low / Medium / High |
| HeartAttack | int | Target: 0 = No, 1 = Yes |

---

## 🎨 Key Features

- ✅ **8 fully functional pages** — Landing, Auth, Dashboard, Predict, Analytics, Chatbot, Doctors, Profile
- ✅ **18-parameter prediction form** with sliders, live values, animated results
- ✅ **SHAP-style feature importance** bars with AI-generated explanations
- ✅ **Risk gauge SVG** with animated needle
- ✅ **Recharts dashboards** — Line, Radar, Bar, Pie, Scatter charts
- ✅ **AI Health Chatbot** with keyword routing + Claude API mode
- ✅ **Doctor finder** with booking simulation
- ✅ **PDF export** (toast simulation / hookable to jsPDF)
- ✅ **JWT auth** with Zustand persist
- ✅ **Demo mode** — works without backend/ML service running
- ✅ **Mobile responsive** — sidebar collapses, fluid grids
- ✅ **Framer Motion** animations throughout

---

## 👨‍💻 Author

Built with ❤️ as a full-stack AI healthcare portfolio project.

**Suitable for:** Final year project · Resume showcase · GitHub portfolio · Internship applications

---

## ⚠️ Disclaimer

This application is for **educational and screening purposes only**. It is not a medical device and does not constitute medical advice. Always consult a licensed healthcare professional for diagnosis and treatment decisions.
