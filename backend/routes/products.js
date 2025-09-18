const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['grains', 'vegetables', 'fruits', 'dairy', 'spices', 'other']).withMessage('Invalid category'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be positive'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be positive'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isAvailable: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.owner) {
      filter.owner = req.query.owner;
    }

    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price_low':
          sort = { price: 1 };
          break;
        case 'price_high':
          sort = { price: -1 };
          break;
        case 'name':
          sort = { name: 1 };
          break;
        case 'rating':
          sort = { averageRating: -1 };
          break;
      }
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('owner', 'name phone email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        category: req.query.category,
        search: req.query.search,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        sortBy: req.query.sortBy
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner', 'name phone email landSize soilType')
      .populate('ratings.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Owner only)
router.post('/', [
  protect,
  authorize('owner'),
  body('name').notEmpty().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['grains', 'vegetables', 'fruits', 'dairy', 'spices', 'other']).withMessage('Invalid category'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('unit').isIn(['kg', 'tons', 'pieces', 'liters', 'bags']).withMessage('Invalid unit'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      owner: req.user._id
    };

    const product = await Product.create(productData);
    await product.populate('owner', 'name phone email');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner only)
router.put('/:id', [
  protect,
  authorize('owner'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn(['grains', 'vegetables', 'fruits', 'dairy', 'spices', 'other']).withMessage('Invalid category'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('unit').optional().isIn(['kg', 'tons', 'pieces', 'liters', 'bags']).withMessage('Invalid unit'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
], checkOwnership(Product), async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['name', 'description', 'price', 'category', 'quantity', 'unit', 'isAvailable', 'harvestedDate', 'expiryDate'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('owner', 'name phone email');

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner only)
router.delete('/:id', [
  protect,
  authorize('owner')
], checkOwnership(Product), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// @desc    Get products by owner
// @route   GET /api/products/owner/my
// @access  Private (Owner only)
router.get('/owner/my', [
  protect,
  authorize('owner')
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { owner: req.user._id };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.isAvailable !== undefined) {
      filter.isAvailable = req.query.isAvailable === 'true';
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get owner products error:', error);
    res.status(500).json({ message: 'Server error while fetching your products' });
  }
});

// @desc    Add product rating
// @route   POST /api/products/:id/ratings
// @access  Private
router.post('/:id/ratings', [
  protect,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 300 }).withMessage('Review cannot exceed 300 characters'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already rated this product
    const existingRating = product.ratings.find(
      rating => rating.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this product' });
    }

    // Add rating
    product.ratings.push({
      user: req.user._id,
      rating: req.body.rating,
      review: req.body.review
    });

    await product.calculateAverageRating();

    res.status(201).json({
      message: 'Rating added successfully',
      averageRating: product.averageRating
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ message: 'Server error while adding rating' });
  }
});

// @desc    Get product categories with counts
// @route   GET /api/products/categories/stats
// @access  Public
router.get('/categories/stats', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          totalQuantity: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ categories: stats });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({ message: 'Server error while fetching category statistics' });
  }
});

module.exports = router;