const express = require('express');
const router = express.Router();

// Controller
const schemaController = require('./config/schema.contoller');
const projectController = require('./project/project.controller');
const uploadFormController = require('./project/uploadForm.controller');
const downloadController = require('./project/download.controller');
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
// PUT /projects/:id - update project by UUID
router.put('/projects/:id', [middlewares.paramsValidator(projectValidator.projectIdParamsSchema)], projectController.updateProject);

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

openapiBuilder.attachDoc('/projects/{id}', 'put', {
	summary: 'Update project by UUID',
	tags: ['project'],
	parameters: [
		{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Project UUID' },
	],
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						name: { type: 'string', description: 'Project name' },
						description: { type: 'string', nullable: true, description: 'Project description' },
						status: { type: 'string', enum: ['READY', 'IN_PROGRESS', 'COMPLETED', 'DELETED'], description: 'Project status' },
					},
				},
				example: {
					name: 'Updated Project Name',
					description: 'Updated project description',
					status: 'IN_PROGRESS',
				},
			},
		},
	},
	responses: {
		'200': { description: 'Project updated successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectCreateResponse' } } } },
		'400': { description: 'Bad request' },
		'404': { description: 'Project not found' },
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


// POST /project/upload-form - accept multipart/form-data (field 'file') and upload to S3
router.post('/project/upload-form', uploadFormController.singleUpload, uploadFormController.handleUploadForm);

openapiBuilder.attachDoc('/project/upload-form', 'post', {
	summary: 'Upload a single file (multipart/form-data) to S3',
	tags: ['project'],
	requestBody: {
		required: true,
		content: {
			'multipart/form-data': {
				schema: {
					type: 'object',
					properties: {
						file: { type: 'string', format: 'binary' },
						path: { type: 'string', description: 'Optional destination path/prefix inside the bucket' },
					},
					required: ['file'],
				},
			},
		},
	},
	responses: {
		'200': { description: 'Upload result' },
		'400': { description: 'Bad request (missing file)' },
		'500': { description: 'Server error' },
	},
});

// GET /project/download/:path - return a presigned URL for a file
router.get('/project/download/:path', downloadController.getPresignedDownload);

openapiBuilder.attachDoc('/project/download/{path}', 'get', {
	summary: 'Get a presigned S3 GET URL for a stored file. Path must be URL-encoded',
	tags: ['project'],
	parameters: [
		{ name: 'path', in: 'path', required: true, schema: { type: 'string' }, description: 'URL-encoded path/key relative to ENV prefix, e.g. activities%2Fmyfile.jpg' },
		{ name: 'expires', in: 'query', required: false, schema: { type: 'integer', default: 1800 }, description: 'Expiry in seconds for the presigned URL' },
	],
	responses: {
		'200': { description: 'Presigned URL returned', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, url: { type: 'string' } } } } } },
		'400': { description: 'Bad request (missing path)' },
		'500': { description: 'Server error' },
	},
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
