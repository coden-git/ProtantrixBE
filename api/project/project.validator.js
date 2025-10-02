const Joi = require('joi');

const PROJECT_STATUSES = ['READY', 'IN_PROGRESS', 'COMPLETED', 'DELETED'];

const createProjectSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow(null, '').optional(),
  status: Joi.string().valid(...PROJECT_STATUSES).optional(),
});

const projectIdParamsSchema = Joi.object({
  id: Joi.string().required(),
});


module.exports = {
  createProjectSchema,
  projectIdParamsSchema,
};
