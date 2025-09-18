const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please specify product category'],
    enum: ['grains', 'vegetables', 'fruits', 'dairy', 'spices', 'other'],
    lowercase: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify available quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit'],
    enum: ['kg', 'tons', 'pieces', 'liters', 'bags'],
    default: 'kg'
  },
  images: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  harvestedDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  location: {
    district: String,
    state: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  qualityCertification: {
    isOrganic: {
      type: Boolean,
      default: false
    },
    certificationBody: String,
    certificationNumber: String
  },
  views: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
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
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(1);
  }
  return this.save();
};

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ owner: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);