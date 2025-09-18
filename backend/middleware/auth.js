const User = require('../models/User');

// Protect middleware - Simple user verification without JWT
const protect = async (req, res, next) => {
  try {
    // For simplicity, we'll use a basic header-based auth
    // In a real app, you'd use proper session management
    const userId = req.header('x-user-id');
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Access denied. No user ID provided.' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ 
        message: 'Access denied. User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Access denied. Invalid user.' 
    });
  }
};

// Authorize middleware - Check user role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Access denied. User not authenticated.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. User role '${req.user.role}' is not authorized for this action.` 
      });
    }

    next();
  };
};

// Check ownership middleware - Verify user owns the resource
const checkOwnership = (Model) => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ 
          message: 'Resource not found.' 
        });
      }

      // Check if the resource has an owner field and if the user owns it
      if (resource.owner && resource.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Access denied. You do not own this resource.' 
        });
      }

      // If no owner field, check if the resource ID matches user ID
      if (!resource.owner && resource._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Access denied. You do not have permission to access this resource.' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ 
        message: 'Server error while checking resource ownership.' 
      });
    }
  };
};

// Optional auth middleware - For routes that work with or without auth
const optionalAuth = async (req, res, next) => {
  try {
    const userId = req.header('x-user-id');
    
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without user
    next();
  }
};

module.exports = {
  protect,
  authorize,
  checkOwnership,
  optionalAuth
};