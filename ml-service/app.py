"""
CardioAI ML Service — FastAPI
Run: uvicorn app:app --reload --port 5001
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle, json, os
import numpy as np
import pandas as pd

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, 'models')

app = FastAPI(title="CardioAI ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts
with open(os.path.join(MODEL_DIR, 'best_model.pkl'), 'rb') as f:
    model = pickle.load(f)
with open(os.path.join(MODEL_DIR, 'scaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)
with open(os.path.join(MODEL_DIR, 'encoders.pkl'), 'rb') as f:
    encoders = pickle.load(f)
with open(os.path.join(MODEL_DIR, 'feature_cols.pkl'), 'rb') as f:
    feature_cols = pickle.load(f)
with open(os.path.join(MODEL_DIR, 'metrics.json'), 'r') as f:
    metrics_data = json.load(f)


class PatientData(BaseModel):
    Age: int
    Gender: str
    BloodPressure: int
    Cholesterol: int
    HeartRate: int
    BloodSugar: int
    BMI: float
    Smoking: str
    AlcoholConsumption: str
    Diabetes: str
    ChestPainType: str
    ECGResults: str
    ExerciseAngina: str
    OxygenLevel: float
    StressLevel: int
    FamilyHistory: str
    PhysicalActivity: str
    SleepHours: float


def encode_patient(data: dict) -> np.ndarray:
    cat_cols = ['Gender', 'Smoking', 'AlcoholConsumption', 'Diabetes', 'ChestPainType',
                'ECGResults', 'ExerciseAngina', 'FamilyHistory', 'PhysicalActivity']
    for col in cat_cols:
        le = encoders.get(col)
        if le and data[col] in le.classes_:
            data[col] = le.transform([data[col]])[0]
        else:
            data[col] = 0
    row = [data.get(col, 0) for col in feature_cols]
    return np.array(row).reshape(1, -1)


def get_risk_label(prob: float) -> str:
    if prob < 0.35:
        return "Low"
    elif prob < 0.65:
        return "Medium"
    return "High"


def generate_explanation(data: dict, prob: float, fi: dict) -> str:
    top = sorted(fi.items(), key=lambda x: x[1], reverse=True)[:3]
    parts = []
    if data['BloodPressure'] > 130:
        parts.append(f"elevated blood pressure ({data['BloodPressure']} mmHg)")
    if data['Cholesterol'] > 200:
        parts.append(f"high cholesterol ({data['Cholesterol']} mg/dL)")
    if data['Smoking'] == 'Current':
        parts.append("active smoking status")
    if data['Diabetes'] == 'Yes':
        parts.append("diabetes diagnosis")
    if data['Age'] > 55:
        parts.append(f"age-related risk ({data['Age']} years)")
    if not parts:
        parts = ["multiple moderate risk factors"]
    factor_str = ", ".join(parts[:3])
    risk_label = get_risk_label(prob)
    return (f"The model identified {factor_str} as primary contributors to a {risk_label.lower()} "
            f"cardiac risk probability of {prob*100:.1f}%. "
            f"The top predictive feature was '{top[0][0]}' with importance score {top[0][1]:.3f}.")


@app.get("/")
def root():
    return {"service": "CardioAI ML Service", "status": "running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy", "model": metrics_data.get('best_model')}


@app.post("/predict")
def predict(patient: PatientData):
    try:
        data = patient.dict()
        encoded = encode_patient(data.copy())
        scaled = scaler.transform(encoded)
        proba = model.predict_proba(scaled)[0][1]
        prediction = int(proba >= 0.5)
        risk_level = get_risk_label(proba)
        fi = metrics_data.get('feature_importance', {})
        explanation = generate_explanation(data, proba, fi)

        recommendations = []
        if data['BloodPressure'] > 130:
            recommendations.append("Reduce sodium intake to <2g/day and monitor BP daily")
        if data['Cholesterol'] > 200:
            recommendations.append("Begin statin therapy discussion with your cardiologist")
        if data['Smoking'] == 'Current':
            recommendations.append("Enroll in a smoking cessation program immediately")
        if data['BMI'] > 25:
            recommendations.append("Target 5-10% weight reduction through diet and exercise")
        if data['StressLevel'] > 7:
            recommendations.append("Practice mindfulness, yoga, or stress reduction techniques")
        if data['SleepHours'] < 6:
            recommendations.append("Aim for 7-9 hours of quality sleep per night")
        if not recommendations:
            recommendations.append("Maintain healthy lifestyle and annual cardiac checkups")

        return {
            "prediction": prediction,
            "probability": round(float(proba), 4),
            "risk_level": risk_level,
            "risk_percentage": round(float(proba) * 100, 1),
            "confidence": round(max(proba, 1 - proba) * 100, 1),
            "explanation": explanation,
            "recommendations": recommendations,
            "feature_importance": {k: round(v, 4) for k, v in list(fi.items())[:8]},
            "model_used": metrics_data.get('best_model', 'XGBoost'),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics")
def get_metrics():
    return metrics_data


@app.get("/analytics")
def analytics():
    csv_path = os.path.join(BASE, '..', 'dataset', 'heart_attack_dataset.csv')
    df = pd.read_csv(csv_path)
    age_bins = pd.cut(df['Age'], bins=[17, 30, 40, 50, 60, 70, 90],
                      labels=['18-30', '31-40', '41-50', '51-60', '61-70', '71+'])
    age_risk = df.groupby(age_bins, observed=True)['HeartAttack'].mean().round(3)
    
    return {
        "total_patients": len(df),
        "heart_attack_rate": round(df['HeartAttack'].mean(), 3),
        "avg_age": round(df['Age'].mean(), 1),
        "avg_bp": round(df['BloodPressure'].mean(), 1),
        "avg_cholesterol": round(df['Cholesterol'].mean(), 1),
        "risk_distribution": df['RiskLevel'].value_counts().to_dict(),
        "gender_distribution": df['Gender'].value_counts().to_dict(),
        "age_risk": age_risk.to_dict(),
        "smoking_risk": df.groupby('Smoking')['HeartAttack'].mean().round(3).to_dict(),
        "diabetes_risk": df.groupby('Diabetes')['HeartAttack'].mean().round(3).to_dict(),
    }
