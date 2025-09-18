// filepath: c:\Users\intre\Desktop\76\backend\routes\auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phoneNumber').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['owner', 'worker']).withMessage('Role must be either owner or worker'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      name, 
      email, 
      phoneNumber, 
      password, 
      role, 
      landSize, 
      cropsGrown, 
      soilType, 
      age 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    // Create user data object
    const userData = {
      name,
      email,
      phoneNumber,
      password,
      role
    };

    // Add role-specific fields
    if (role === 'owner') {
      if (!landSize || !cropsGrown || !soilType) {
        return res.status(400).json({
          success: false,
          message: 'Owner registration requires landSize, cropsGrown, and soilType'
        });
      }
      userData.landSize = landSize;
      userData.cropsGrown = Array.isArray(cropsGrown) ? cropsGrown : [cropsGrown];
      userData.soilType = soilType;
    }

    if (role === 'worker') {
      if (!age) {
        return res.status(400).json({
          success: false,
          message: 'Worker registration requires age'
        });
      }
      userData.age = age;
    }

    // Create user
    const user = await User.create(userData);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      ...(user.role === 'owner' && {
        landSize: user.landSize,
        cropsGrown: user.cropsGrown,
        soilType: user.soilType
      }),
      ...(user.role === 'worker' && {
        age: user.age
      }),
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      ...(user.role === 'owner' && {
        landSize: user.landSize,
        cropsGrown: user.cropsGrown,
        soilType: user.soilType
      }),
      ...(user.role === 'worker' && {
        age: user.age
      }),
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (for testing)
// @access  Public
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;