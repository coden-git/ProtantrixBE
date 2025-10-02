const express = require('express');
const router = express.Router();

// Controller
const schemaController = require('./config/schema.contoller');
const projectController = require('./project/project.controller');
const projectValidator = require('./project/project.validator');
const middlewares = require('../middlewares/middleware')
const openapiBuilder = require('./openapi.builder');

// POST /create-schema - generate activity JSON and store a new versioned schema
router.get('/create-schema', schemaController.updateConfigWithActivity);

// attach OpenAPI doc for GET /create-schema
openapiBuilder.attachDoc('/create-schema', 'get', {
	summary: 'Generate activity JSON and save as a new versioned json_schema (invoked via GET)',
	tags: ['schema'],
	responses: {
		'200': { description: 'Successfully created a new json_schema version' },
		'500': { description: 'Server error' },
	},
});

// POST /projects - create a new project using latest json_schema as activities
router.post('/projects/create', [middlewares.bodyValidator(projectValidator.createProjectSchema)], projectController.createProject);
// GET /projects - paginated list of projects (minimal summaries)
router.get('/projects/list', projectController.listProjects);

openapiBuilder.attachDoc('/projects/list', 'get', {
	summary: 'List projects (paginated, excludes activities)',
	tags: ['project'],
	parameters: [
		{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
		{ name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
	],
	responses: {
		'200': { description: 'Paginated list of projects' },
		'500': { description: 'Server error' },
	},
});

// GET /projects/:id/activities - return the full activities JSON for a project
router.get('/projects/:id/activities', [middlewares.paramsValidator(projectValidator.projectIdParamsSchema)], projectController.getProjectActivities);

openapiBuilder.attachDoc('/projects/{id}/activities', 'get', {
  summary: 'Get activities JSON for a project',
  tags: ['project'],
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
  responses: { '200': { description: 'Project activities' }, '404': { description: 'Not found' }, '500': { description: 'Server error' } },
});

// PUT /projects/:id/activities/:activityId - replace a single activity in the project
router.put('/projects/:id/activities/:activityId', projectController.updateActivity);

openapiBuilder.attachDoc('/projects/{id}/activities/{activityId}', 'put', {
	summary: 'Replace an activity in a project by activityId',
	tags: ['project'],
	parameters: [
		{ name: 'id', in: 'path', required: true, schema: { type: 'string' } },
		{ name: 'activityId', in: 'path', required: true, schema: { type: 'string' } },
	],
	responses: { '200': { description: 'Activity replaced' }, '404': { description: 'Not found' }, '500': { description: 'Server error' } },
});
// attach OpenAPI doc for POST /projects/create (request/response schemas added to components)
openapiBuilder.addSchema('ProjectCreateRequest', projectValidator.createProjectSchema.describe ? projectValidator.createProjectSchema.describe() : { type: 'object' });
openapiBuilder.addSchema('ProjectCreateResponse', {
	type: 'object',
	properties: {
		ok: { type: 'boolean' },
		project: { type: 'object' },
	},
});

const projectCreateExample = {
	name: 'Sample Project',
	description: 'This is a sample project created via API',
	status: 'READY',
};

openapiBuilder.attachDoc('/projects/create', 'post', {
	summary: 'Create a new project using the latest json_schema as activities',
	tags: ['project'],
	requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectCreateRequest' }, example: projectCreateExample } } },
	responses: {
		'201': { description: 'Project created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectCreateResponse' } } } },
		'400': { description: 'Validation error' },
		'500': { description: 'Server error' },
	},
});

module.exports = router;
