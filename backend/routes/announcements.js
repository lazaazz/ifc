const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all announcements with filtering and pagination
// @route   GET /api/announcements
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['subsidy', 'insurance', 'training', 'scheme', 'weather', 'market', 'general']).withMessage('Invalid category'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
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
    const filter = { isActive: true };

    // Only show currently valid announcements unless specifically requested
    if (req.query.includeExpired !== 'true') {
      const now = new Date();
      filter.validFrom = { $lte: now };
      filter.$or = [
        { validUntil: { $exists: false } },
        { validUntil: { $gte: now } }
      ];
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.isGovernment !== undefined) {
      filter.isGovernment = req.query.isGovernment === 'true';
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    if (req.query.targetAudience) {
      filter.targetAudience = { $in: [req.query.targetAudience, 'all'] };
    }

    // Build sort object
    let sort = { priority: -1, createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'date_new':
          sort = { createdAt: -1 };
          break;
        case 'date_old':
          sort = { createdAt: 1 };
          break;
        case 'priority':
          sort = { priority: -1, createdAt: -1 };
          break;
        case 'deadline':
          sort = { applicationDeadline: 1 };
          break;
      }
    }

    // Execute query
    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Announcement.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      announcements,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        category: req.query.category,
        priority: req.query.priority,
        isGovernment: req.query.isGovernment,
        search: req.query.search,
        targetAudience: req.query.targetAudience,
        sortBy: req.query.sortBy
      }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error while fetching announcements' });
  }
});

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name')
      .populate('likes.user', 'name');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (!announcement.isActive) {
      return res.status(410).json({ message: 'Announcement is no longer active' });
    }

    // Increment view count
    announcement.views += 1;
    await announcement.save();

    res.json({ announcement });
  } catch (error) {
    console.error('Get announcement error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(500).json({ message: 'Server error while fetching announcement' });
  }
});

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Admin or authorized users)
router.post('/', [
  protect,
  body('title').notEmpty().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').notEmpty().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['subsidy', 'insurance', 'training', 'scheme', 'weather', 'market', 'general']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('targetAudience').optional().isArray().withMessage('Target audience must be an array'),
  body('link').optional().isURL().withMessage('Please provide a valid URL'),
  body('validUntil').optional().isISO8601().withMessage('Please provide a valid date'),
  body('applicationDeadline').optional().isISO8601().withMessage('Please provide a valid date'),
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

    const announcementData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Set default author if not provided
    if (!announcementData.author) {
      announcementData.author = {
        name: req.user.name,
        contact: {
          email: req.user.email,
          phone: req.user.phone
        }
      };
    }

    const announcement = await Announcement.create(announcementData);
    await announcement.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error while creating announcement' });
  }
});

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Creator only or Admin)
router.put('/:id', [
  protect,
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').optional().isIn(['subsidy', 'insurance', 'training', 'scheme', 'weather', 'market', 'general']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('link').optional().isURL().withMessage('Please provide a valid URL'),
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

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is authorized to update (creator or admin)
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this announcement' });
    }

    const allowedUpdates = ['title', 'description', 'category', 'priority', 'targetAudience', 'link', 'validUntil', 'applicationDeadline', 'isActive'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      message: 'Announcement updated successfully',
      announcement: updatedAnnouncement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Server error while updating announcement' });
  }
});

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Creator only or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is authorized to delete (creator or admin)
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error while deleting announcement' });
  }
});

// @desc    Like/Unlike announcement
// @route   POST /api/announcements/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user already liked
    const likeIndex = announcement.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      // Unlike
      announcement.likes.splice(likeIndex, 1);
      await announcement.save();
      res.json({ message: 'Announcement unliked', liked: false, likesCount: announcement.likes.length });
    } else {
      // Like
      announcement.likes.push({ user: req.user._id });
      await announcement.save();
      res.json({ message: 'Announcement liked', liked: true, likesCount: announcement.likes.length });
    }
  } catch (error) {
    console.error('Like announcement error:', error);
    res.status(500).json({ message: 'Server error while processing like' });
  }
});

// @desc    Add comment to announcement
// @route   POST /api/announcements/:id/comments
// @access  Private
router.post('/:id/comments', [
  protect,
  body('text').notEmpty().trim().isLength({ min: 1, max: 300 }).withMessage('Comment must be between 1 and 300 characters'),
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

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text
    };

    announcement.comments.push(comment);
    await announcement.save();
    await announcement.populate('comments.user', 'name');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: announcement.comments[announcement.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

// @desc    Get announcement statistics
// @route   GET /api/announcements/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Announcement.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          government: { $sum: { $cond: ['$isGovernment', 1, 0] } },
          private: { $sum: { $cond: ['$isGovernment', 0, 1] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: { $size: '$likes' } }
        }
      }
    ]);

    const categoryStats = await Announcement.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || {
        total: 0,
        government: 0,
        private: 0,
        urgent: 0,
        totalViews: 0,
        totalLikes: 0
      },
      categories: categoryStats
    });
  } catch (error) {
    console.error('Get announcement stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

module.exports = router;