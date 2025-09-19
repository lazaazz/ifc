const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['farmer'],
    default: 'farmer',
    required: [true, 'Please specify user role']
  },
  
  // Farmer-specific fields
  acresOfLand: {
    type: String,
    required: [true, 'Please specify acres of land'],
    enum: ['nil', '0-1', '1-5', '5-10', '10-25', '25-50', '50+'],
    default: 'nil'
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
    min: [18, 'Age must be at least 18 years'],
    max: [100, 'Age cannot be more than 100 years']
  },
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['male', 'female', 'other']
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  cropType: {
    type: String,
    required: function() { return this.acresOfLand !== 'nil'; },
    trim: true,
    maxlength: [100, 'Crop type cannot be more than 100 characters']
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: [0, 'Years of experience cannot be negative'],
    max: [80, 'Years of experience cannot be more than 80']
  },
  preferredLanguage: {
    type: String,
    required: [true, 'Please select preferred language'],
    enum: ['english', 'malayalam', 'hindi'],
    default: 'english'
  },
  
  // Common fields
  isVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);