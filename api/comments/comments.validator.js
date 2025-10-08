const Joi = require('joi');

const commentParamsSchema = Joi.object({
  projectId: Joi.string().trim().required(),
  activityId: Joi.string().trim().required(),
});

const commentBodySchema = Joi.object({
  comment: Joi.string().trim().min(1).max(5000).required(),
  projectName: Joi.string().trim().max(300).optional(),
  activityName: Joi.string().trim().max(300).optional(),
}).unknown(true); // allow other form fields like path if needed

module.exports = { commentParamsSchema, commentBodySchema };