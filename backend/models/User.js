const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  profile: {
    age: Number,
    gender: String,
    bloodType: String,
    height: Number,
    weight: Number,
    phone: String,
    address: String,
  },
  medicalHistory: {
    diabetes: { type: Boolean, default: false },
    hypertension: { type: Boolean, default: false },
    smoking: { type: String, default: 'Never' },
    familyHistory: { type: Boolean, default: false },
  },
  settings: {
    darkMode: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
  },
  lastLogin: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
