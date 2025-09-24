const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { validateCreateIssue, validateUpdateIssue } = require('../middleware/validation');

// GET /issues - List issues with search, filter, sort, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      status = '',
      priority = '',
      assignee = '',
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      page = 1,
      pageSize = 10
    } = req.query;

    // Build query
    let query = {};

    // Search
    if (search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = new RegExp(assignee, 'i');

    // Pagination
    const limit = Math.min(parseInt(pageSize), 100); // Max 100 items per page
    const skip = (parseInt(page) - 1) * limit;

    // Sort
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries
    const [issues, total] = await Promise.all([
      Issue.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Issue.countDocuments(query)
    ]);

    res.json({
      issues,
      pagination: {
        currentPage: parseInt(page),
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// GET /issues/:id - Get single issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid issue ID format' });
    }
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
});

// POST /issues - Create new issue
router.post('/', validateCreateIssue, async (req, res) => {
  try {
    const issue = new Issue(req.body);
    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// PUT /issues/:id - Update issue
router.put('/:id', validateUpdateIssue, async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    console.error('Error updating issue:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid issue ID format' });
    }
    res.status(500).json({ error: 'Failed to update issue' });
  }
});

module.exports = router;