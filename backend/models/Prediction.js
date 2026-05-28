const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inputData: {
    Age: Number, Gender: String, BloodPressure: Number, Cholesterol: Number,
    HeartRate: Number, BloodSugar: Number, BMI: Number, Smoking: String,
    AlcoholConsumption: String, Diabetes: String, ChestPainType: String,
    ECGResults: String, ExerciseAngina: String, OxygenLevel: Number,
    StressLevel: Number, FamilyHistory: String, PhysicalActivity: String, SleepHours: Number,
  },
  result: {
    prediction: Number,
    probability: Number,
    riskPercentage: Number,
    riskLevel: String,
    confidence: Number,
    explanation: String,
    recommendations: [String],
    featureImportance: mongoose.Schema.Types.Mixed,
    modelUsed: String,
  },
  type: { type: String, enum: ['full', 'quick'], default: 'full' },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
