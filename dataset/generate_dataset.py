import pandas as pd
import numpy as np
import random
import os

np.random.seed(42)
random.seed(42)
N = 1200

def generate_dataset():
    ages = np.random.normal(52, 14, N).clip(18, 90).astype(int)
    genders = np.random.choice(['Male', 'Female'], N, p=[0.54, 0.46])
    
    # Blood pressure correlated with age
    bp_base = 110 + (ages - 18) * 0.6
    blood_pressure = (bp_base + np.random.normal(0, 12, N)).clip(85, 200).astype(int)
    
    # Cholesterol
    cholesterol = (180 + (ages - 18) * 1.1 + np.random.normal(0, 30, N)).clip(120, 400).astype(int)
    
    heart_rate = np.random.normal(75, 14, N).clip(45, 180).astype(int)
    blood_sugar = np.random.choice(
        np.concatenate([np.random.normal(90, 10, 700), np.random.normal(160, 40, 500)]),
        N, replace=False
    ).clip(60, 400).astype(int)
    
    bmi = np.random.normal(27, 5, N).clip(15, 50).round(1)
    
    smoking = np.random.choice(['Never', 'Former', 'Current'], N, p=[0.45, 0.30, 0.25])
    alcohol = np.random.choice(['None', 'Moderate', 'Heavy'], N, p=[0.40, 0.45, 0.15])
    diabetes = np.random.choice(['No', 'Yes', 'Pre-diabetic'], N, p=[0.60, 0.25, 0.15])
    chest_pain = np.random.choice(
        ['None', 'Atypical angina', 'Typical angina', 'Non-anginal', 'Asymptomatic'],
        N, p=[0.30, 0.20, 0.20, 0.15, 0.15]
    )
    ecg = np.random.choice(['Normal', 'ST-T abnormality', 'LV hypertrophy'], N, p=[0.55, 0.30, 0.15])
    exercise_angina = np.random.choice(['No', 'Yes'], N, p=[0.65, 0.35])
    oxygen_level = np.random.normal(97, 2, N).clip(85, 100).round(1)
    stress_level = np.random.randint(1, 11, N)
    family_history = np.random.choice(['No', 'Yes'], N, p=[0.60, 0.40])
    physical_activity = np.random.choice(
        ['Sedentary', 'Light', 'Moderate', 'Active'], N, p=[0.25, 0.30, 0.30, 0.15]
    )
    sleep_hours = np.random.normal(6.5, 1.3, N).clip(3, 12).round(1)

    # Risk score formula
    risk = np.zeros(N)
    risk += (ages - 18) / 72 * 25
    risk += (blood_pressure - 85) / 115 * 20
    risk += (cholesterol - 120) / 280 * 15
    risk += np.where(smoking == 'Current', 12, np.where(smoking == 'Former', 5, 0))
    risk += np.where(diabetes == 'Yes', 10, np.where(diabetes == 'Pre-diabetic', 5, 0))
    risk += np.where(family_history == 'Yes', 8, 0)
    risk += np.where(chest_pain == 'Typical angina', 10, np.where(chest_pain == 'Atypical angina', 5, 0))
    risk += np.where(ecg == 'ST-T abnormality', 7, np.where(ecg == 'LV hypertrophy', 5, 0))
    risk += np.where(exercise_angina == 'Yes', 8, 0)
    risk += (100 - oxygen_level) * 2
    risk += stress_level * 1.2
    risk += np.where(bmi > 30, 5, np.where(bmi > 25, 2, 0))
    risk += np.where(physical_activity == 'Sedentary', 6, np.where(physical_activity == 'Light', 3, 0))
    risk += np.maximum(0, 7 - sleep_hours) * 1.5
    risk += np.random.normal(0, 5, N)
    risk = risk.clip(0, 100)

    risk_level = np.where(risk < 35, 'Low', np.where(risk < 65, 'Medium', 'High'))
    heart_attack = (risk > 55).astype(int)
    # Add some noise
    flip = np.random.random(N) < 0.05
    heart_attack[flip] = 1 - heart_attack[flip]

    df = pd.DataFrame({
        'Patient_ID': [f'PAT{str(i+1).zfill(5)}' for i in range(N)],
        'Age': ages,
        'Gender': genders,
        'BloodPressure': blood_pressure,
        'Cholesterol': cholesterol,
        'HeartRate': heart_rate,
        'BloodSugar': blood_sugar,
        'BMI': bmi,
        'Smoking': smoking,
        'AlcoholConsumption': alcohol,
        'Diabetes': diabetes,
        'ChestPainType': chest_pain,
        'ECGResults': ecg,
        'ExerciseAngina': exercise_angina,
        'OxygenLevel': oxygen_level,
        'StressLevel': stress_level,
        'FamilyHistory': family_history,
        'PhysicalActivity': physical_activity,
        'SleepHours': sleep_hours,
        'RiskScore': risk.round(1),
        'RiskLevel': risk_level,
        'HeartAttack': heart_attack
    })

    out = os.path.dirname(__file__)
    df.to_csv(os.path.join(out, 'heart_attack_dataset.csv'), index=False)
    df.to_excel(os.path.join(out, 'heart_attack_dataset.xlsx'), index=False)
    print(f"Dataset generated: {N} records")
    print(f"Heart Attack distribution: {df['HeartAttack'].value_counts().to_dict()}")
    print(f"Risk Level distribution: {df['RiskLevel'].value_counts().to_dict()}")
    return df

if __name__ == '__main__':
    generate_dataset()
