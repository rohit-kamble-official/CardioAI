"""
CardioAI — Data Preprocessing Pipeline
Handles encoding, scaling, and feature engineering for the cardiac dataset.
Can be imported by train_model.py or used standalone for EDA.
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import os, json

BASE = os.path.dirname(os.path.abspath(__file__))

CATEGORICAL_COLS = [
    'Gender', 'Smoking', 'AlcoholConsumption', 'Diabetes',
    'ChestPainType', 'ECGResults', 'ExerciseAngina',
    'FamilyHistory', 'PhysicalActivity'
]

NUMERIC_COLS = [
    'Age', 'BloodPressure', 'Cholesterol', 'HeartRate',
    'BloodSugar', 'BMI', 'OxygenLevel', 'StressLevel', 'SleepHours'
]

DROP_COLS = ['Patient_ID', 'RiskScore', 'RiskLevel']
TARGET_COL = 'HeartAttack'


def load_data(csv_path=None):
    if csv_path is None:
        csv_path = os.path.join(BASE, 'heart_attack_dataset.csv')
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} records, {df.shape[1]} columns")
    return df


def basic_stats(df):
    print("\n=== Basic Statistics ===")
    print(f"Shape: {df.shape}")
    print(f"Missing values: {df.isnull().sum().sum()}")
    print(f"\nTarget distribution:\n{df[TARGET_COL].value_counts()}")
    print(f"\nRisk Level distribution:\n{df['RiskLevel'].value_counts()}")
    print(f"\nNumeric summary:")
    print(df[NUMERIC_COLS].describe().round(2))
    return df


def feature_engineering(df):
    """Add derived features."""
    df = df.copy()
    # Pulse Pressure (proxy for arterial stiffness)
    df['PulsePressure'] = (df['BloodPressure'] * 0.7 - df['BloodPressure'] * 0.4).clip(20, 80)
    # Metabolic risk score
    df['MetabolicRisk'] = (
        (df['BMI'] > 25).astype(int) +
        (df['BloodSugar'] > 100).astype(int) +
        (df['Diabetes'] == 'Yes').astype(int)
    )
    # Lifestyle score (higher = worse)
    df['LifestyleRisk'] = (
        (df['Smoking'] == 'Current').astype(int) * 2 +
        (df['AlcoholConsumption'] == 'Heavy').astype(int) +
        (df['PhysicalActivity'] == 'Sedentary').astype(int) +
        (df['SleepHours'] < 6).astype(int)
    )
    print("Feature engineering: added PulsePressure, MetabolicRisk, LifestyleRisk")
    return df


def encode_and_scale(df, encoders=None, scaler=None, fit=True):
    """Encode categoricals and scale numerics."""
    df = df.copy()
    df.drop(columns=[c for c in DROP_COLS if c in df.columns], inplace=True, errors='ignore')

    if encoders is None:
        encoders = {}

    for col in CATEGORICAL_COLS:
        if col not in df.columns:
            continue
        if fit:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            encoders[col] = le
        else:
            le = encoders.get(col)
            if le:
                df[col] = df[col].apply(lambda x: le.transform([str(x)])[0] if str(x) in le.classes_ else 0)

    feature_cols = [c for c in df.columns if c != TARGET_COL]
    X = df[feature_cols].values
    y = df[TARGET_COL].values if TARGET_COL in df.columns else None

    if fit:
        scaler = StandardScaler()
        X = scaler.fit_transform(X)
    else:
        X = scaler.transform(X)

    return X, y, feature_cols, encoders, scaler


def prepare_train_test(df, test_size=0.2, random_state=42):
    """Full pipeline: feature eng → encode → scale → split."""
    df = feature_engineering(df)
    X, y, feature_cols, encoders, scaler = encode_and_scale(df, fit=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    print(f"\nTrain: {X_train.shape[0]} samples | Test: {X_test.shape[0]} samples")
    print(f"Features: {len(feature_cols)}: {feature_cols}")
    return X_train, X_test, y_train, y_test, feature_cols, encoders, scaler


def encode_single_patient(patient_dict, encoders, scaler, feature_cols):
    """Encode a single patient dict for inference."""
    row = {}
    for col in CATEGORICAL_COLS:
        val = str(patient_dict.get(col, ''))
        le = encoders.get(col)
        if le and val in le.classes_:
            row[col] = int(le.transform([val])[0])
        else:
            row[col] = 0
    for col in NUMERIC_COLS + ['PulsePressure', 'MetabolicRisk', 'LifestyleRisk']:
        if col in feature_cols:
            row[col] = float(patient_dict.get(col, 0))

    arr = np.array([[row.get(col, 0) for col in feature_cols]])
    return scaler.transform(arr)


if __name__ == '__main__':
    df = load_data()
    basic_stats(df)
    X_train, X_test, y_train, y_test, features, enc, sc = prepare_train_test(df)
    print(f"\n✅ Preprocessing complete. Ready for model training.")
    print(f"Feature list: {features}")
