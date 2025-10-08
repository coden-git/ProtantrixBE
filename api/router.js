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
const alertController = require('./alerts/alert.controller');
const { createActivityUnlockSchema, listAlertsQuerySchema, approveRejectParamsSchema, approveRejectQuerySchema, alertSeenParamsSchema } = require('./alerts/alert.validator');
// Comments
const commentsController = require('./comments/comments.controller');
const { commentParamsSchema, commentBodySchema } = require('./comments/comments.validator');

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
router.put('/projects/:id', [middlewares.authRole(['admin']), middlewares.paramsValidator(projectValidator.projectIdParamsSchema)], projectController.updateProject);

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
router.put('/projects/:id/activities/:activityId', [middlewares.authRole(['admin', 'user']), middlewares.paramsValidator(projectValidator.projectUpdateParamsSchema)], projectController.updateActivity);

openapiBuilder.attachDoc('/projects/{id}/activities/{activityId}', 'put', {
	summary: 'Replace an activity in a project by activityId',
	tags: ['project'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'id', in: 'path', required: true, schema: { type: 'string' } },
		{ name: 'activityId', in: 'path', required: true, schema: { type: 'string' } },
	],
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					description: 'Full activity object to replace the existing one',
				},
				
			},
		},
	},
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

// GET /users - list all users (max 1000)
router.get('/users', [middlewares.authRole('admin')], userController.listUsers);

openapiBuilder.attachDoc('/users', 'get', {
	summary: 'List all users (admin only, max 1000)',
	tags: ['user'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'limit', in: 'query', schema: { type: 'integer', default: 1000, maximum: 1000 }, description: 'Max number of users to return (1-1000)' }
	],
	responses: {
		'200': {
			description: 'List of active users',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							ok: { type: 'boolean' },
							count: { type: 'integer' },
							users: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										_id: { type: 'string' },
										name: { type: 'string' },
										phone: { type: 'string' },
										role: { type: 'string', enum: ['admin', 'user'] },
										isActive: { type: 'boolean' },
										projects: { 
											type: 'array',
											items: { type: 'object', properties: { uuid: { type: 'string' }, name: { type: 'string' } } }
										},
										createdAt: { type: 'string', format: 'date-time' },
										updatedAt: { type: 'string', format: 'date-time' },
									}
								}
							}
						}
					}
				}
			}
		},
		'401': { description: 'Unauthorized' },
		'500': { description: 'Server error' }
	}
});

// DELETE /project/delete/:path - delete a file (URL-encoded path) from S3 under ENV prefix
router.delete('/project/delete/:path', [middlewares.authRole(['admin','user'])], downloadController.deleteProjectFile);

openapiBuilder.attachDoc('/project/delete/{path}', 'delete', {
	summary: 'Delete a file from project storage (S3) under the ENV prefix',
	tags: ['project'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'path', in: 'path', required: true, schema: { type: 'string' }, description: 'URL-encoded relative path e.g. activities%2Fmyfile.jpg' }
	],
	responses: {
		'200': { description: 'File deleted', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, path: { type: 'string' } } } } } },
		'400': { description: 'Missing path' },
		'401': { description: 'Unauthorized' },
		'500': { description: 'Server error' }
	}
});

// PATCH /user/{id} - partial update (admin only) name/role/isActive
router.patch('/user/:id', [middlewares.authRole('admin'), middlewares.bodyValidator(userValidator.updateUserSchema)], userController.updateUser);

openapiBuilder.attachDoc('/user/{id}', 'patch', {
	summary: 'Update user (partial: name, role, isActive)',
	tags: ['user'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Mongo _id of user' }
	],
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						role: { type: 'string', enum: ['user', 'admin'] },
						isActive: { type: 'boolean' }
					},
					additionalProperties: false
				},
				example: { name: 'Updated Name', role: 'admin', isActive: true }
			}
		}
	},
	responses: {
		'200': { description: 'User updated' },
		'400': { description: 'Bad request (no fields or validation error)' },
		'401': { description: 'Unauthorized' },
		'404': { description: 'User not found' },
		'500': { description: 'Server error' }
	}
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
// ALERT ROUTES
router.post('/alert/create/activity-unlock', [
	middlewares.authRole('user'),
	middlewares.bodyValidator(createActivityUnlockSchema)
], alertController.createActivityUnlock);

openapiBuilder.attachDoc('/alert/create/activity-unlock', 'post', {
	summary: 'Create an activity unlock alert (user role)',
	tags: ['alert'],
	security: [{ BearerAuth: [] }],
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						activityId: { type: 'string' },
						activityName: { type: 'string' },
						projectId: { type: 'string' },
						projectName: { type: 'string' },
					},
					required: ['activityId', 'activityName', 'projectId', 'projectName']
				},
				example: {
					activityId: 'act-123',
					activityName: 'Excavation',
					projectId: 'proj-999',
					projectName: 'Highway Extension'
				}
			}
		}
	},
	responses: {
		'201': { description: 'Alert created' },
		'401': { description: 'Unauthorized' },
		'422': { description: 'Validation error' },
		'500': { description: 'Server error' }
	}
});

// Approve / reject a single alert by uuid
router.post('/alerts/approve-reject/:uuid', [
	middlewares.authRole('admin'),
	middlewares.paramsValidator(approveRejectParamsSchema),
	middlewares.queryValidator(approveRejectQuerySchema)
], alertController.approveRejectAlert);

openapiBuilder.attachDoc('/alerts/approve-reject/{uuid}', 'post', {
	summary: 'Approve or reject a single pending activity unlock alert',
	tags: ['alert'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'uuid', in: 'path', required: true, schema: { type: 'string' } },
		{ name: 'status', in: 'query', required: true, schema: { type: 'string', enum: ['COMPLETED','REJECTED'] } }
	],
	responses: {
		'200': { description: 'Alert updated' },
		'401': { description: 'Unauthorized' },
		'404': { description: 'Alert not found' },
		'409': { description: 'Alert not in pending state' },
		'422': { description: 'Validation error' },
		'500': { description: 'Server error' }
	}
});

// GET /alerts/list - paginated list (page size fixed at 100)
router.get('/alerts/list', [
	middlewares.authRole(['admin','user']),
	middlewares.queryValidator(listAlertsQuerySchema)
], alertController.listAlerts);

openapiBuilder.attachDoc('/alerts/list', 'get', {
	summary: 'Paginated list of alerts (page size 100)',
	tags: ['alert'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'page', in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 1 } },
		{ name: 'type', in: 'query', required: false, schema: { type: 'string', enum: ['ACTIVITY_UNLOCK'] } },
		{ name: 'status', in: 'query', required: false, schema: { type: 'string', enum: ['PENDING','COMPLETED','REJECTED'] } },
		{ name: 'projectId', in: 'query', required: false, schema: { type: 'string' } }
	],
	responses: {
		'200': { description: 'Alerts list returned' },
		'401': { description: 'Unauthorized' },
		'422': { description: 'Validation error' },
		'500': { description: 'Server error' }
	}
});

// Mark alert seen
router.post('/alert/:projectId/activity/:activityId/seen', [
	middlewares.authRole(['admin','user']),
	middlewares.paramsValidator(alertSeenParamsSchema),
], alertController.markAlertSeen);

openapiBuilder.attachDoc('/alert/{projectId}/activity/{activityId}/seen', 'post', {
	summary: 'Mark an alert as seen by the current user (adds userId to seenBy array)',
	tags: ['alert'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'alertId', in: 'path', required: true, schema: { type: 'string' } },
	],
	responses: {
		'200': { description: 'Alert updated (seenBy contains current user)', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, alert: { type: 'object' } } } } } },
		'401': { description: 'Unauthorized' },
		'404': { description: 'Alert not found' },
		'500': { description: 'Server error' }
	}
});

// COMMENT ROUTE (note: path uses provided spelling '/commemt/')
router.post('/comment/:projectId/activity/:activityId', [
	middlewares.authRole(['admin','user']),
	middlewares.paramsValidator(commentParamsSchema),
	// Multer first so we can parse multipart fields
	commentsController.singleUpload,
	middlewares.parseMultipartPayload(),
	middlewares.bodyValidator(commentBodySchema),
	commentsController.createCommentWithFile
]);

openapiBuilder.attachDoc('/comment/{projectId}/activity/{activityId}', 'post', {
	summary: 'Create a comment with a file for a project activity',
	tags: ['comment'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
		{ name: 'activityId', in: 'path', required: true, schema: { type: 'string' } },
	],
	requestBody: {
		required: true,
		content: {
			'multipart/form-data': {
				schema: {
					type: 'object',
					properties: {
						comment: { type: 'string' },
						projectName: { type: 'string', description: 'Optional project name (will fallback if omitted)' },
						activityName: { type: 'string', description: 'Optional activity name (will fallback if omitted)' },
						payload: { type: 'string', description: 'JSON string duplicate containing { comment, projectName?, activityName? }' },
						file: { type: 'string', format: 'binary' }
					},
						required: ['comment']
				}
			}
		}
	},
	responses: {
		'201': { description: 'Comment created (returns stored comment doc)' },
			'400': { description: 'Bad request (invalid upload)' },
		'401': { description: 'Unauthorized' },
		'422': { description: 'Validation error' },
		'500': { description: 'Server error' }
	}
});

// GET list last 100 comments for project/activity
router.get('/comment/:projectId/activity/:activityId/list', [
	middlewares.authRole(['admin','user']),
	middlewares.paramsValidator(commentParamsSchema),
], commentsController.listComments);

openapiBuilder.attachDoc('/comment/{projectId}/activity/{activityId}/list', 'get', {
	summary: 'List recent (max 100) comments for a project activity (newest first)',
	tags: ['comment'],
	security: [{ BearerAuth: [] }],
	parameters: [
		{ name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
		{ name: 'activityId', in: 'path', required: true, schema: { type: 'string' } },
	],
	responses: {
		'200': { description: 'Comments list returned', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, count: { type: 'integer' }, comments: { type: 'array', items: { type: 'object' } } } } } } },
		'401': { description: 'Unauthorized' },
		'422': { description: 'Validation error' },
		'500': { description: 'Server error' }
	}
});
