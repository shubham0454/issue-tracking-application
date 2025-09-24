const Joi = require('joi');

const createIssueSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).max(2000).required(),
  status: Joi.string().valid('open', 'in-progress', 'resolved', 'closed'),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
  assignee: Joi.string().max(100).allow(''),
  reporter: Joi.string().max(100).required(),
  tags: Joi.array().items(Joi.string().max(50))
});

const updateIssueSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().min(1).max(2000),
  status: Joi.string().valid('open', 'in-progress', 'resolved', 'closed'),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
  assignee: Joi.string().max(100).allow(''),
  reporter: Joi.string().max(100),
  tags: Joi.array().items(Joi.string().max(50))
});

const validateCreateIssue = (req, res, next) => {
  const { error } = createIssueSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateIssue = (req, res, next) => {
  const { error } = updateIssueSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateCreateIssue, validateUpdateIssue };