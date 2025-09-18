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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^[0-9+\-\s()]+$/, 'Please provide a valid phone number']
  },
  role: {
    type: String,
    enum: ['owner', 'worker'],
    required: [true, 'Please specify role'],
    default: 'owner'
  },
  // Owner specific fields
  landSize: {
    type: String,
    required: function() {
      return this.role === 'owner';
    }
  },
  cropsGrown: {
    type: String,
    required: function() {
      return this.role === 'owner';
    }
  },
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loam', 'silt', 'chalky', 'peaty'],
    required: function() {
      return this.role === 'owner';
    }
  },
  // Worker specific fields
  age: {
    type: Number,
    min: [18, 'Age must be at least 18'],
    max: [65, 'Age cannot be more than 65'],
    required: function() {
      return this.role === 'worker';
    }
  },
  // Common fields
  profileImage: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user without password
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);