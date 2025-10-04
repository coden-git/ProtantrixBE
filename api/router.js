const express = require('express');
const router = express.Router();

// Controller
const schemaController = require('./config/schema.contoller');
const projectController = require('./project/project.controller');
const uploadFormController = require('./project/uploadForm.controller');
const downloadController = require('./project/download.controller');
const projectValidator = require('./project/project.validator');
const userController = require('./user/user.controller');
const userValidator = require('./user/user.validator');
const middlewares = require('../middlewares/middleware')
const openapiBuilder = require('./openapi.builder');

// POST /create-schema - generate activity JSON and store a new versioned schema
router.get('/create-schema', [middlewares.adminAuth], schemaController.updateConfigWithActivity);

// attach OpenAPI doc for GET /create-schema
openapiBuilder.attachDoc('/create-schema', 'get', {
	summary: 'Generate activity JSON and save as a new versioned json_schema (invoked via GET)',
	tags: ['schema'],
	responses: {
		'200': { description: 'Successfully created a new json_schema version' },
		'500': { description: 'Server error' },
	},
});

// Register security scheme for admin token (header: authtoken)
openapiBuilder.addSecurityScheme('AdminToken', {
	type: 'apiKey',
	in: 'header',
	name: 'authtoken',
	description: 'Admin token. Alternatively, use Authorization: Bearer <token> or x-admin-token header.',
});

// POST /create/user/admin - create an admin user
router.post('/create/user/admin', [middlewares.adminAuth, middlewares.bodyValidator(userValidator.createAdminUserSchema)], userController.createAdminUser);

openapiBuilder.attachDoc('/create/user/admin', 'post', {
	summary: 'Create an admin user',
	tags: ['user'],
	security: [{ AdminToken: [] }],
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						phone: { type: 'string', description: '10 digit phone number' },
						password: { type: 'string', format: 'password' },
					},
					required: ['name', 'phone', 'password'],
				},
				example: {
					name: 'Admin User',
					phone: '9998887777',
					password: 'secret123',
				},
			},
		},
	},
	responses: {
		'201': { description: 'Admin user created' },
		'400': { description: 'Validation error' },
		'409': { description: 'User already exists' },
		'500': { description: 'Server error' },
	},
});

// POST /user/login - user login (public)
router.post('/user/login', [middlewares.bodyValidator(userValidator.loginUserSchema)], userController.loginUser);

openapiBuilder.attachDoc('/user/login', 'post', {
	summary: 'User login (phone + password)',
	tags: ['user'],
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						phone: { type: 'string', description: '10 digit phone number' },
						password: { type: 'string', format: 'password' },
					},
					required: ['phone', 'password'],
				},
				example: { phone: '9998887777', password: 'secret123' },
			},
		},
	},
	responses: {
		'200': { description: 'Login successful (returns token + user)' },
		'401': { description: 'Invalid credentials' },
		'500': { description: 'Server error' },
	},
});

// POST /projects - create a new project using latest json_schema as activities
router.post('/projects/create', [middlewares.authRole('admin'), middlewares.bodyValidator(projectValidator.createProjectSchema)], projectController.createProject);
// GET /projects - paginated list of projects (minimal summaries)
router.get('/projects/list', [middlewares.authRole(['admin', 'user'])], projectController.listProjects);
// PUT /projects/:id - update project by UUID
router.put('/projects/:id', [middlewares.authRole(['admin', 'user']), middlewares.paramsValidator(projectValidator.projectIdParamsSchema)], projectController.updateProject);

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
router.get('/projects/:id/activities', [middlewares.authRole(['admin', 'user']), middlewares.paramsValidator(projectValidator.projectIdParamsSchema)], projectController.getProjectActivities);

openapiBuilder.attachDoc('/projects/{id}/activities', 'get', {
  summary: 'Get activities JSON for a project',
  tags: ['project'],
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
  responses: { '200': { description: 'Project activities' }, '404': { description: 'Not found' }, '500': { description: 'Server error' } },
});

// PUT /projects/:id/activities/:activityId - replace a single activity in the project
router.put('/projects/:id/activities/:activityId', [middlewares.authRole(['admin', 'user']), middlewares.paramsValidator(projectValidator.projectIdParamsSchema)], projectController.updateActivity);

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
router.post('/project/upload-form', [middlewares.authRole(['admin', 'user']), uploadFormController.singleUpload, uploadFormController.handleUploadForm]);

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
router.get('/project/download/:path', [middlewares.authRole(['admin', 'user'])], downloadController.getPresignedDownload);

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


// POST /user/create - admin creates a standard user
router.post('/user/create', [middlewares.authRole('admin'), middlewares.bodyValidator(userValidator.createUserSchema)], userController.createStandardUser);

openapiBuilder.addSecurityScheme('BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Paste JWT obtained from /user/login'
});

openapiBuilder.attachDoc('/user/create', 'post', {
  summary: 'Admin creates a user (optionally specify role & project refs)',
  tags: ['user'],
  security: [{ BearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            phone: { type: 'string', description: '10 digit phone number' },
            password: { type: 'string', format: 'password' },
            role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
            projects: { 
              type: 'array', 
              items: { 
                type: 'object', 
                properties: { uuid: { type: 'string' }, name: { type: 'string' } },
                required: ['uuid', 'name']
              },
              description: 'Array of project reference objects' 
            },
          },
          required: ['name', 'phone', 'password'],
        },
        example: { name: 'Jane Smith', phone: '7776665555', password: 'secret123', role: 'user', projects: [{ uuid: 'a1b2c3d4', name: 'Bridge Build' }] },
      },
    },
  },
  responses: {
    '201': { description: 'User created' },
    '400': { description: 'Validation error' },
    '401': { description: 'Unauthorized' },
    '409': { description: 'User already exists' },
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
