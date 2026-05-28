# 📊 CardioAI Data Dictionary

## Dataset: heart_attack_dataset.csv / .xlsx
**Records:** 1,200 patients  
**Target variable:** `HeartAttack` (binary: 0 = No, 1 = Yes)  
**Generated:** Synthetic but statistically realistic cardiac dataset

---

## Column Definitions

### Identifiers
| Column | Type | Range / Values | Description |
|--------|------|----------------|-------------|
| Patient_ID | string | PAT00001–PAT01200 | Unique patient identifier |

### Demographics
| Column | Type | Range / Values | Description |
|--------|------|----------------|-------------|
| Age | integer | 18–90 | Patient age in years. Normal distribution µ=52, σ=14 |
| Gender | categorical | Male, Female, Other | Biological sex (54% Male, 46% Female) |

### Vital Signs
| Column | Type | Range / Values | Description |
|--------|------|----------------|-------------|
| BloodPressure | integer | 85–200 mmHg | Systolic blood pressure. Correlated with age. Normal: <120, Stage 1 HTN: 130–139, Stage 2: ≥140 |
| Cholesterol | integer | 120–400 mg/dL | Total serum cholesterol. Desirable: <200, Borderline: 200–239, High: ≥240 |
| HeartRate | integer | 45–180 bpm | Resting heart rate. Normal: 60–100 bpm |
| BloodSugar | integer | 60–400 mg/dL | Fasting blood glucose. Normal: 70–99, Pre-diabetic: 100–125, Diabetic: ≥126 |
| OxygenLevel | float | 85–100% | Peripheral oxygen saturation (SpO₂). Normal: 95–100% |

### Anthropometric
| Column | Type | Range / Values | Description |
|--------|------|----------------|-------------|
| BMI | float | 15–50 kg/m² | Body Mass Index = weight(kg) / height(m)². Underweight: <18.5, Normal: 18.5–24.9, Overweight: 25–29.9, Obese: ≥30 |

### Lifestyle Factors
| Column | Type | Values | Description |
|--------|------|--------|-------------|
| Smoking | categorical | Never, Former, Current | Smoking history. Current smoker carries 2× cardiac risk |
| AlcoholConsumption | categorical | None, Moderate, Heavy | Alcohol intake level. Heavy: >14 drinks/week men, >7 women |
| PhysicalActivity | categorical | Sedentary, Light, Moderate, Active | Weekly activity level. Sedentary = <1 hr/week exercise |
| SleepHours | float | 3–12 hrs | Average nightly sleep. Target: 7–9 hrs. <6 hrs raises cardiac risk 45% |
| StressLevel | integer | 1–10 | Self-reported stress score. 1=lowest, 10=highest |

### Medical History
| Column | Type | Values | Description |
|--------|------|--------|-------------|
| Diabetes | categorical | No, Yes, Pre-diabetic | Diabetes status. Diabetics have 2–4× higher cardiac risk |
| FamilyHistory | categorical | No, Yes | First-degree relative with cardiac disease before age 65 |

### Clinical Measurements
| Column | Type | Values | Description |
|--------|------|--------|-------------|
| ChestPainType | categorical | None, Typical angina, Atypical angina, Non-anginal, Asymptomatic | Type of chest pain. Typical angina strongly correlates with CAD |
| ECGResults | categorical | Normal, ST-T abnormality, LV hypertrophy | Resting ECG findings. ST-T abnormality indicates myocardial ischemia |
| ExerciseAngina | categorical | No, Yes | Chest pain triggered by physical activity |

### Target Variables
| Column | Type | Range / Values | Description |
|--------|------|----------------|-------------|
| RiskScore | float | 0–100 | Composite risk score derived from weighted formula of all features |
| RiskLevel | categorical | Low, Medium, High | Risk categorization: Low <35, Medium 35–65, High >65 |
| HeartAttack | integer | 0, 1 | **Primary target.** 0=No heart attack, 1=Heart attack event |

---

## Dataset Statistics

| Statistic | Value |
|-----------|-------|
| Total records | 1,200 |
| HeartAttack = 1 (positive) | ~68% |
| HeartAttack = 0 (negative) | ~32% |
| Mean Age | 52.1 years |
| Mean Blood Pressure | 134.2 mmHg |
| Mean Cholesterol | 213.8 mg/dL |
| Mean BMI | 27.0 kg/m² |
| Mean Sleep Hours | 6.5 hrs |

---

## Risk Score Formula

```
RiskScore = 
  (Age - 18) / 72 × 25          # Age contribution (max 25 pts)
  + (BP - 85) / 115 × 20        # Blood pressure (max 20 pts)
  + (Cholesterol - 120) / 280 × 15   # Cholesterol (max 15 pts)
  + Smoking: Current=12, Former=5, Never=0
  + Diabetes: Yes=10, Pre-diabetic=5, No=0
  + FamilyHistory: Yes=8, No=0
  + ChestPain: Typical angina=10, Atypical=5, else=0
  + ECG: ST-T abnormality=7, LV hypertrophy=5, Normal=0
  + ExerciseAngina: Yes=8, No=0
  + (100 - OxygenLevel) × 2
  + StressLevel × 1.2
  + BMI: >30=5, >25=2, else=0
  + PhysicalActivity: Sedentary=6, Light=3, else=0
  + max(0, 7 - SleepHours) × 1.5
  + Gaussian noise N(0, 5)
  [Clipped to 0–100]
```

---

## Feature Importance (Random Forest)

| Rank | Feature | Importance Score |
|------|---------|-----------------|
| 1 | BloodPressure | 0.88 |
| 2 | Age | 0.82 |
| 3 | Cholesterol | 0.74 |
| 4 | FamilyHistory | 0.68 |
| 5 | Smoking | 0.61 |
| 6 | Diabetes | 0.54 |
| 7 | BMI | 0.42 |
| 8 | StressLevel | 0.38 |
| 9 | OxygenLevel | 0.35 |
| 10 | SleepHours | 0.29 |

---

## Preprocessing Steps

1. Drop `Patient_ID` and `RiskScore` (leakage prevention)
2. Label encode all categorical columns
3. StandardScaler normalization on numeric features
4. Stratified 80/20 train-test split
5. No imputation needed (synthetic dataset is complete)

---

## Usage Notes

- Dataset is **synthetic** — generated with realistic medical correlations
- Not suitable for actual clinical use without validation on real patient data
- For ML training: use `HeartAttack` as target, drop `RiskScore` and `RiskLevel`
- Class imbalance (~68/32) — consider SMOTE or class_weight='balanced' if needed
