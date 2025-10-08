const Joi = require('joi');

// Schema: payload for creating an activity unlock alert
// Fields: activityId, activityName, projectId, projectName (all required strings)
const createActivityUnlockSchema = Joi.object({
	activityId: Joi.string().trim().min(1).required(),
	activityName: Joi.string().trim().min(1).required(),
	projectId: Joi.string().trim().min(1).required(),
	projectName: Joi.string().trim().min(1).required(),
}).required();

// Query schema for listing alerts: page (>=1), optional type, status, projectId
const listAlertsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  type: Joi.string().trim().valid('ACTIVITY_UNLOCK').optional(),
  status: Joi.string().trim().valid('PENDING','COMPLETED','REJECTED').optional(),
  projectId: Joi.string().trim().min(1).optional(),
}).required();

// Approve/Reject single alert: path :uuid param + status in query
const approveRejectParamsSchema = Joi.object({
	uuid: Joi.string().trim().min(1).required(),
}).required();

const approveRejectQuerySchema = Joi.object({
	status: Joi.string().trim().valid('COMPLETED','REJECTED').required(),
}).required();

// Params schema for marking an alert as seen
const alertSeenParamsSchema = Joi.object({
  projectId: Joi.string().trim().min(1).required(),
  activityId: Joi.string().trim().min(1).required(),
}).required();

module.exports = {
	createActivityUnlockSchema,
  listAlertsQuerySchema,
	approveRejectParamsSchema,
	approveRejectQuerySchema,
	alertSeenParamsSchema,
};

