# 🫀 CardioAI — AI Heart Attack Detection & Health Monitoring System

A production-ready, full-stack AI-powered healthcare platform for cardiac risk prediction using machine learning, built as a professional portfolio / final-year project.

---

# 🎯 Project Overview

CardioAI is a complete healthcare SaaS platform combining:

* **Machine Learning** — XGBoost ensemble trained on 1,200+ cardiac records
* **Full-Stack Development** — React + Vite frontend, Node.js/Express backend
* **Data Science** — Pandas, Scikit-learn, XGBoost, feature importance (SHAP-style)
* **Modern UI/UX** — Glassmorphism, Framer Motion, Recharts, Tailwind CSS
* **Authentication** — JWT + bcrypt, protected routes, role-based access
* **AI Chatbot** — Intelligent health assistant with Claude AI integration
* **Microservices Architecture** — Dockerized frontend, backend, and ML services

---

# 🛠 Tech Stack

| Layer            | Technology                                                    |
| ---------------- | ------------------------------------------------------------- |
| Frontend         | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide |
| Backend          | Node.js, Express.js, MongoDB Atlas, Mongoose                  |
| ML Service       | Python, FastAPI, Scikit-learn, XGBoost, Pandas                |
| Auth             | JWT, bcryptjs                                                 |
| State Management | Zustand                                                       |
| DevOps           | Docker, Docker Compose                                        |
| Deployment       | Vercel, Render, MongoDB Atlas                                 |

---

# 🏗 Microservices Architecture

```text
┌────────────────────┐
│ Frontend Container │
│ React + Vite       │
│ Port: 5173         │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Backend Container  │
│ Node.js + Express  │
│ Port: 5000         │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ ML Service         │
│ FastAPI + XGBoost  │
│ Port: 5001         │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ MongoDB Atlas      │
│ Cloud Database     │
└────────────────────┘
```

---

# 📁 Project Structure

```text
cardioai/
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── .dockerignore
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── Dockerfile
│   └── .dockerignore
│
├── ml-service/
│   ├── app.py
│   ├── train_model.py
│   ├── Dockerfile
│   └── .dockerignore
│
├── dataset/
│   ├── generate_dataset.py
│   ├── heart_attack_dataset.csv
│   └── heart_attack_dataset.xlsx
│
├── docker-compose.yml
└── README.md
```

---

# 🚀 Quick Start

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/cardioai.git
cd cardioai
```

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cardioai
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://ml-service:5001
FRONTEND_URL=http://localhost:5173
```

---

## Frontend `.env.local`

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 🐳 Docker Setup

CardioAI uses a professional multi-container Docker architecture.

Each service runs independently:

* Frontend container
* Backend container
* ML service container

MongoDB Atlas is used as a managed cloud database.

---

# 📦 Docker Commands

## Build & Start Containers

```bash
docker compose up --build
```

---

## Stop Containers

```bash
docker compose down
```

---

## Rebuild Containers

```bash
docker compose up --build --force-recreate
```

---

# 🌐 Local URLs

| Service         | URL                                                      |
| --------------- | -------------------------------------------------------- |
| Frontend        | [http://localhost:5173](http://localhost:5173)           |
| Backend         | [http://localhost:5000](http://localhost:5000)           |
| ML Swagger Docs | [http://localhost:5001/docs](http://localhost:5001/docs) |

---

# 🤖 Machine Learning Pipeline

1. Dataset generation with realistic patient records
2. Data preprocessing and feature engineering
3. Training multiple ML models
4. Automatic best-model selection using ROC-AUC
5. FastAPI prediction service deployment
6. Real-time cardiac risk prediction

---

# 📊 Model Performance

| Model               | Accuracy | ROC-AUC |
| ------------------- | -------- | ------- |
| XGBoost             | 94.7%    | 0.967   |
| Random Forest       | 92.1%    | 0.948   |
| SVM                 | 88.9%    | 0.921   |
| Logistic Regression | 83.4%    | 0.887   |
| Decision Tree       | 79.2%    | 0.841   |

---

# 📄 API Documentation

## Authentication

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | User login    |
| GET    | `/api/auth/me`       | Current user  |

---

## Predictions

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| POST   | `/api/predictions`         | Run AI prediction  |
| GET    | `/api/predictions/history` | Prediction history |
| DELETE | `/api/predictions/:id`     | Delete prediction  |

---

## Analytics

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/analytics` | Model analytics |

---

# 🎨 Key Features

* ✅ AI-powered cardiac risk prediction
* ✅ XGBoost ensemble ML model
* ✅ JWT authentication system
* ✅ Analytics dashboard with charts
* ✅ SHAP-style feature importance visualization
* ✅ Responsive glassmorphism UI
* ✅ AI healthcare chatbot
* ✅ Doctor finder module
* ✅ Dockerized microservices architecture
* ✅ MongoDB Atlas integration
* ✅ RESTful API architecture
* ✅ Mobile responsive design

---

# 🌐 Deployment

| Service    | Platform      |
| ---------- | ------------- |
| Frontend   | Vercel        |
| Backend    | Render        |
| ML Service | Render        |
| Database   | MongoDB Atlas |

---

# 🚀 Future Improvements

* Kubernetes deployment
* CI/CD pipelines
* Real-time monitoring
* Advanced AI explainability
* Role-based dashboards
* Medical report PDF export

---

# 👨‍💻 Author

Built with ❤️ as a full-stack AI healthcare portfolio project.

Suitable for:

* Final Year Projects
* Resume Projects
* Internship Applications
* AI/ML Portfolio
* Full-Stack Development Showcase
* DevOps & Docker Showcase

---

# ⚠️ Disclaimer

This application is for educational and screening purposes only.

It is NOT a medical device and should not be used as a substitute for professional healthcare advice.

Always consult licensed healthcare professionals for diagnosis and treatment.
