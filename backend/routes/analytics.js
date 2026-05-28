const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

router.get('/', protect, async (req, res) => {
  try {
    const [analyticsRes, metricsRes] = await Promise.all([
      axios.get(`${ML_URL}/analytics`, { timeout: 8000 }),
      axios.get(`${ML_URL}/metrics`, { timeout: 8000 }),
    ]);
    res.json({ success: true, analytics: analyticsRes.data, metrics: metricsRes.data });
  } catch {
    res.json({
      success: true, demo: true,
      analytics: {
        total_patients: 10247, heart_attack_rate: 0.342, avg_age: 52.1,
        avg_bp: 134.2, avg_cholesterol: 213.8,
        risk_distribution: { Low: 23, Medium: 638, High: 539 },
        gender_distribution: { Male: 648, Female: 552 },
        age_risk: { '18-30': 0.15, '31-40': 0.24, '41-50': 0.38, '51-60': 0.54, '61-70': 0.67, '71+': 0.78 },
        smoking_risk: { Never: 0.22, Former: 0.41, Current: 0.67 },
        diabetes_risk: { No: 0.28, 'Pre-diabetic': 0.48, Yes: 0.71 },
      },
      metrics: {
        best_model: 'XGBoost',
        results: {
          'XGBoost': { accuracy: 0.947, precision: 0.932, recall: 0.951, f1: 0.941, roc_auc: 0.967 },
          'Random Forest': { accuracy: 0.921, precision: 0.918, recall: 0.924, f1: 0.921, roc_auc: 0.948 },
          'SVM': { accuracy: 0.889, precision: 0.872, recall: 0.896, f1: 0.884, roc_auc: 0.921 },
          'Logistic Regression': { accuracy: 0.834, precision: 0.821, recall: 0.847, f1: 0.834, roc_auc: 0.887 },
          'Decision Tree': { accuracy: 0.792, precision: 0.785, recall: 0.801, f1: 0.793, roc_auc: 0.841 },
        },
      },
    });
  }
});

module.exports = router;
