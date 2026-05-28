import pandas as pd
import numpy as np
import pickle, os, json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import xgboost as xgb
import warnings; warnings.filterwarnings('ignore')

BASE = os.path.dirname(os.path.abspath(__file__))

def preprocess(df):
    df = df.copy()
    cat_cols = ['Gender','Smoking','AlcoholConsumption','Diabetes','ChestPainType',
                'ECGResults','ExerciseAngina','FamilyHistory','PhysicalActivity','RiskLevel']
    encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le
    return df, encoders

def train():
    csv_path = os.path.join(BASE, '..', 'dataset', 'heart_attack_dataset.csv')
    df = pd.read_csv(csv_path)
    df.drop(columns=['Patient_ID', 'RiskScore'], inplace=True, errors='ignore')
    
    df, encoders = preprocess(df)
    
    feature_cols = [c for c in df.columns if c not in ['HeartAttack', 'RiskLevel']]
    X = df[feature_cols]
    y = df['HeartAttack']
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Decision Tree': DecisionTreeClassifier(max_depth=8, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        'SVM': SVC(probability=True, random_state=42),
        'XGBoost': xgb.XGBClassifier(n_estimators=100, random_state=42, eval_metric='logloss', verbosity=0)
    }
    
    results = {}
    best_name, best_model, best_auc = None, None, 0
    
    print("\n=== Model Evaluation ===")
    print(f"{'Model':<25} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1':>10} {'ROC-AUC':>10}")
    print("-" * 80)
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        proba = model.predict_proba(X_test)[:, 1]
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds)
        rec = recall_score(y_test, preds)
        f1 = f1_score(y_test, preds)
        auc = roc_auc_score(y_test, proba)
        
        results[name] = {'accuracy': round(acc, 4), 'precision': round(prec, 4),
                         'recall': round(rec, 4), 'f1': round(f1, 4), 'roc_auc': round(auc, 4)}
        print(f"{name:<25} {acc:>10.4f} {prec:>10.4f} {rec:>10.4f} {f1:>10.4f} {auc:>10.4f}")
        
        if auc > best_auc:
            best_auc, best_name, best_model = auc, name, model
    
    print(f"\n✅ Best Model: {best_name} (ROC-AUC: {best_auc:.4f})")
    
    # Feature importance from RF
    rf = models['Random Forest']
    fi = dict(zip(feature_cols, rf.feature_importances_.round(4)))
    fi_sorted = dict(sorted(fi.items(), key=lambda x: x[1], reverse=True))
    
    os.makedirs(os.path.join(BASE, 'models'), exist_ok=True)
    
    with open(os.path.join(BASE, 'models', 'best_model.pkl'), 'wb') as f:
        pickle.dump(best_model, f)
    with open(os.path.join(BASE, 'models', 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    with open(os.path.join(BASE, 'models', 'encoders.pkl'), 'wb') as f:
        pickle.dump(encoders, f)
    with open(os.path.join(BASE, 'models', 'feature_cols.pkl'), 'wb') as f:
        pickle.dump(feature_cols, f)
    with open(os.path.join(BASE, 'models', 'metrics.json'), 'w') as f:
        json.dump({'results': results, 'best_model': best_name,
                   'feature_importance': fi_sorted}, f, indent=2)
    
    print("✅ All models and artifacts saved.")
    return best_model, scaler, encoders, feature_cols, results

if __name__ == '__main__':
    train()
