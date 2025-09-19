// filepath: c:\Users\intre\Desktop\76\backend\models\Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit (kg, quintal, piece, etc.)'],
    enum: ['kg', 'quintal', 'piece', 'dozen', 'liter', 'gram', 'ton']
  },
  category: {
    type: String,
    required: [true, 'Please specify product category'],
    enum: ['grains', 'vegetables', 'fruits', 'spices', 'dairy', 'seeds', 'fertilizers', 'tools', 'other']
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify available quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  images: [{
    type: String,
    default: 'default-product.jpg'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  harvestDate: {
    type: Date
  },
  organic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);