const express = require('express');
const router = express.Router();
const axios = require('axios');
const Prediction = require('../models/Prediction');
const { protect } = require('../middleware/auth');

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Create prediction
router.post('/', protect, async (req, res) => {
  try {
    const mlRes = await axios.post(`${ML_URL}/predict`, req.body, { timeout: 10000 });
    const result = mlRes.data;

    const prediction = await Prediction.create({
      user: req.user._id,
      inputData: req.body,
      result: {
        prediction: result.prediction,
        probability: result.probability,
        riskPercentage: result.risk_percentage,
        riskLevel: result.risk_level,
        confidence: result.confidence,
        explanation: result.explanation,
        recommendations: result.recommendations,
        featureImportance: result.feature_importance,
        modelUsed: result.model_used,
      },
      type: req.body.type || 'full',
    });

    res.status(201).json({ success: true, prediction, mlResult: result });
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      // Demo mode: return mock prediction if ML service not running
      const mockResult = {
        prediction: 1, probability: 0.62, risk_percentage: 62.0,
        risk_level: 'Medium', confidence: 87.3,
        explanation: 'Demo mode: Elevated blood pressure and cholesterol are primary risk factors.',
        recommendations: ['Consult a cardiologist', 'Reduce sodium intake', 'Exercise regularly'],
        feature_importance: { BloodPressure: 0.88, Age: 0.82, Cholesterol: 0.74 },
        model_used: 'XGBoost (Demo)',
      };
      return res.json({ success: true, mlResult: mockResult, demo: true });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user's prediction history
router.get('/history', protect, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id })
      .sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, predictions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single prediction
router.get('/:id', protect, async (req, res) => {
  try {
    const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id });
    if (!prediction) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, prediction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete prediction
router.delete('/:id', protect, async (req, res) => {
  try {
    await Prediction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
