const Alert = require('./alerts.model');

/**
 * POST /alert/create/activity-unlock
 * Body: { activityId, activityName, projectId, projectName }
 * Auth: role 'user'
 * Creates an alert of type ACTIVITY_UNLOCK (pending approval scenario)
 */
async function createActivityUnlock(req, res) {
	try {
			// Body already validated by middleware; directly use req.body
			const value = req.body;

			if (!req.user || !req.user.user) {
			return res.status(401).json({ ok: false, error: 'Unauthorized' });
		}

		const userPayload = req.user.user; // assuming structure { user: { name, role, ... } }

		const alertDoc = await Alert.create({
			type: 'ACTIVITY_UNLOCK',
			createdBy: {
				name: userPayload.name,
				userId: userPayload._id ,
			},
			project: {
				projectId: value.projectId,
				projectName: value.projectName,
			},
			activity: {
				activityId: value.activityId,
				activityName: value.activityName,
			},
			alertText: `Request to unlock activity '${value.activityName}' in project '${value.projectName}'`,
			requestedOn: new Date(),
            status: 'PENDING',
		});

		return res.status(201).json({ ok: true, alert: alertDoc });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Failed to create activity unlock alert', err);
		return res.status(500).json({ ok: false, error: 'Server error creating alert' });
	}
}

// GET /alerts/list?page=1&type=...&status=...&projectId=...
// Auth: admin or user
// Pagination: fixed page size 100 (no client override). Returns { ok, page, pageSize, totalPages, total, alerts }
async function listAlerts(req, res) {
	try {
		const { page = 1, type, status, projectId } = req.query;
		const pageSize = 100;
		const filters = {};
		if (type) filters.type = type;
		if (status) filters.status = status;
		if (projectId) filters['project.projectId'] = projectId;

		const skip = (page - 1) * pageSize;
		const [alerts, total] = await Promise.all([
			Alert.find(filters)
				.sort({ requestedOn: -1, createdAt: -1 })
				.skip(skip)
				.limit(pageSize)
				.lean({ virtuals: false }),
			Alert.countDocuments(filters),
		]);

		const totalPages = Math.ceil(total / pageSize) || 1;
		return res.status(200).json({ ok: true, page, pageSize, totalPages, total, count: alerts.length, alerts });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Failed to list alerts', err);
		return res.status(500).json({ ok: false, error: 'Server error listing alerts' });
	}
}

// POST /alerts/approve-reject/:uuid?status=COMPLETED|REJECTED
// Auth: admin only
// Action: update a single PENDING alert by uuid
async function approveRejectAlert(req, res) {
  try {
    const { uuid } = req.params;
    const { status } = req.query;
    if (!uuid || !status) {
      return res.status(400).json({ ok: false, error: 'uuid and status are required' });
    }
    if (!req.user || !req.user.user || req.user.user.role !== 'admin') {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
    const user = req.user.user;

    const alert = await Alert.findOne({ uuid });
    if (!alert) {
      return res.status(404).json({ ok: false, error: 'Alert not found' });
    }
    if (alert.status !== 'PENDING') {
      return res.status(409).json({ ok: false, error: `Cannot change status from ${alert.status}` });
    }

    alert.status = status;
    alert.approvedOn = new Date();
    alert.approvedBy = { name: user.name, userId: user._id };
    await alert.save();

    return res.status(200).json({ ok: true, alert });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to approve/reject alert', err);
    return res.status(500).json({ ok: false, error: 'Server error approving/rejecting alert' });
  }
}

module.exports = { createActivityUnlock, listAlerts, approveRejectAlert };

