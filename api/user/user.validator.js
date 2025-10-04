const Joi = require('joi');

const createAdminUserSchema = Joi.object({
  name: Joi.string().trim().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginUserSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(6).max(128).required(),
});

// Admin-created user; can specify role and projects
const projectRefSchema = Joi.object({
  uuid: Joi.string().pattern(/^[0-9a-fA-F-]{8,}$/).required(),
  name: Joi.string().trim().required(),
});

const createUserSchema = Joi.object({
  name: Joi.string().trim().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  projects: Joi.array().items(projectRefSchema).default([]),
});

module.exports = { createAdminUserSchema, loginUserSchema, createUserSchema };
