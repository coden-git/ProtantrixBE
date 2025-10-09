const Project = require('./project.model');
const JsonSchema = require('../config/json_schema.model');
const { getProjectAccessList } = require('../../utils');
const Alerts = require('../alerts/alerts.model');

/**
 * Express handler to create a new Project.
 * Request body: { name: string, description?: string, status?: 'READY'|'IN_PROGRESS'|'COMPLETED'|'DELETED' }
 */
async function createProject(req, res) {
    try {
        const { name, description = null, status = 'READY' } = req.body || {};

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ ok: false, error: 'name is required and must be a string' });
        }

        // Find the latest json schema by version
        const latest = await JsonSchema.findOne({}).sort({ version: -1 }).lean();

        const activities = latest && latest.schema ? latest.schema : [];
        const json_schema_version = latest && typeof latest.version === 'number' ? latest.version : 0;

        const project = new Project({
            name: name.trim(),
            description: description == null ? null : String(description).trim(),
            status,
            docs: [],
            activities,
            json_schema_version,
        });

        const saved = await project.save();

        // Do not return the full activities JSON in response to avoid sending
        // large payloads. Return a minimal project summary and Location header.
        const minimal = {
            _id: saved._id,
            uuid: saved.uuid,
            name: saved.name,
            description: saved.description,
            status: saved.status,
            docs: saved.docs,
            json_schema_version: saved.json_schema_version,
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
        };

        return res.status(201).json({ ok: true, project: minimal });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('createProject error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ ok: false, error: err.message || String(err) });
    }
}


/**
 * GET /projects
 * Query params: page (default 1), limit (default 20, capped at 100)
 * Returns minimal project summaries (excludes activities)
 */
async function listProjects(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        let limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
        limit = Math.min(limit, 1000);

        const skip = (page - 1) * limit;
        // Determine visibility scope based on user role & assigned projects
        // req.user is the decoded JWT payload; user object lives at req.user.user

        let query = {};
        const { uuids, isAdmin } = getProjectAccessList(req.user?.user);

        if (!isAdmin) {
            // For non-admin users restrict to assigned project UUIDs
            query = { uuid: { $in: uuids } };
            if (uuids.length === 0) {
                // No accessible projects; short‑circuit with empty result set
                return res.status(200).json({ ok: true, page, limit, total: 0, totalPages: 0, items: [] });
            }
        }


        const [items, total] = await Promise.all([
            Project.find(query, { activities: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Project.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({ ok: true, page, limit, total, totalPages, items });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('listProjects error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ ok: false, error: err.message || String(err) });
    }
}


/**
 * GET /projects/:id/activities
 * Returns the activities JSON for a project (may be large)
 */
async function getProjectActivities(req, res) {
    try {
        const { id } = req.params;
        // Access control: only admins or users with explicit project assignment can view
        const { uuids, isAdmin } = getProjectAccessList(req.user?.user);

        if (!isAdmin && (!uuids || !uuids.includes(id))) {
            return res.status(403).json({ ok: false, error: 'Forbidden: no access to this project' });
        }

        const project = await Project.findOne({ uuid: id }, { activities: 1, json_schema_version: 1 }).lean();

        const [alertsActivity, comments] = await Promise.all([
            Alerts.find({ "project.projectId": id, "createdBy.userId": req.user?.user?._id, type: 'ACTIVITY_UNLOCK' }).lean(),
            Alerts.find({ "project.projectId": id, "seenBy": { $nin: [req.user?.user?._id] }, type: 'NEW_COMMENT' }).lean()

        ]);
        if (!project) return res.status(404).json({ ok: false, error: 'Project not found' });

        return res.status(200).json({ ok: true, json_schema_version: project.json_schema_version, activities: formatPayload(project.activities, isAdmin, alertsActivity, comments) });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('getProjectActivities error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ ok: false, error: err.message || String(err) });
    }
}

const formatPayload = (activities, isAdmin, alerts, comments) => {

    const userActivities = []
    for (let i = 0; i < activities.length; i++) {
        const checkLists = activities[i].checkLists
        let checlistCompleted = true
        for (let j = 0; j < checkLists.length; j++) {
            const checkList = checkLists[j]
            if (['checkbox', 'dropdown', 'fileupload'].includes(checkList?.type?.toLowerCase())) {
                const isValue = !!checkList?.value
                if (isValue) {
                    checkList.disabled = true
                } else {
                    checkList.disabled = false
                }

                if (checkList.isRequired) {
                    if (!isValue) {
                        checlistCompleted = false
                    }
                }

                if (isAdmin) {
                    checkList.disabled = false
                }
            }

            if (checkList?.type?.toLowerCase() === 'daterange') {
                const isValue = !!checkList.value?.to && !!checkList.value.from
                if (isValue) {
                    checkList.disabled = true
                } else {
                    checkList.disabled = false
                }
                if (checkList.isRequired) {
                    if (!isValue) {
                        checlistCompleted = false
                    }
                }

                if (isAdmin) {
                    checkList.disabled = false
                }
            }

            if (checkList?.type?.toLowerCase() === 'table') {
                const tableValues = checkList.value
                for (let k = 1; k < tableValues.length; k++) {
                    const tableRows = tableValues[k]
                    for (let l = 0; l < tableRows.length; l++) {
                        const row = tableRows[l]
                        if (['number', 'dropdown', 'text', 'image'].includes(row?.type?.toLowerCase())) {
                            const isValue = !!row?.value
                            if (isValue) {
                                row.disabled = true
                            } else {
                                row.disabled = false
                            }
                            if (checkList.isRequired) {
                                if (!isValue) {
                                    checlistCompleted = false
                                }
                            }
                            if (isAdmin) {
                                row.disabled = false
                            }
                        }
                    }
                }

            }
        }

        const measurement = activities[i].measurement
        let measurementCompleted = true
        if (measurement.type?.toLowerCase() === "lot") {
            if (!measurement.value) {
                measurementCompleted = false
            }

            if (measurement.value) {
                measurement.disabled = true
            }

            if (isAdmin) {
                measurement.disabled = false
            }
        }
        if (measurement?.type?.toLowerCase() === 'table') {
            const tableValues = measurement.data
            for (let k = 1; k < tableValues.length; k++) {
                const tableRows = tableValues[k]
                for (let l = 0; l < tableRows.length; l++) {
                    const row = tableRows[l]
                    if (['number', 'dropdown', 'text', 'image'].includes(row?.type?.toLowerCase())) {
                        const isValue = !!row?.value
                        if (isValue) {
                            row.disabled = true
                        } else {
                            row.disabled = false
                        }

                        if (isAdmin) {
                            row.disabled = false
                        }
                    }
                }
            }

        }
        activities[i].isCompleted = checlistCompleted
        const userRequestForOpeningActivity = alerts.find(a => a.activity?.activityId === activities[i].id)
        const isNewComment = comments.find(c => c.activity?.activityId === activities[i].id)
        if (isNewComment) {
            activities[i].isNewComment = true
        } else {
            activities[i].isNewComment = false
        }
        if (!activities[i].isCompleted && userRequestForOpeningActivity?.status === 'PENDING') {
            activities[i].enableRequest = true
        } else {
            activities[i].enableRequest = false
        }
        if (i > 0) {
            activities[i].disabled = !(activities[i - 1].isCompleted || userRequestForOpeningActivity?.status === 'COMPLETED')
        }

        if (isAdmin) {
            activities[i].disabled = false
            activities[i].enableRequest = false
        }
        userActivities.push(activities[i])
    }
    return userActivities
}


/**
 * PUT /projects/:id
 * Update project by UUID
 * Request body: { name?: string, description?: string, status?: string }
 */
async function updateProject(req, res) {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body || {};

        if (!id) {
            return res.status(400).json({ ok: false, error: 'Project ID (UUID) is required' });
        }

        // Find project by UUID and ensure it's not deleted
        const project = await Project.findOne({ uuid: id, status: { $ne: 'DELETED' } });
        if (!project) {
            return res.status(404).json({ ok: false, error: 'Project not found or deleted' });
        }

        // Update fields if provided
        const updates = {};
        if (name !== undefined && typeof name === 'string') {
            updates.name = name.trim();
        }
        if (description !== undefined) {
            updates.description = description === null ? null : String(description).trim();
        }
        if (status !== undefined && ['READY', 'IN_PROGRESS', 'COMPLETED', 'DELETED'].includes(status)) {
            updates.status = status;
        }

        // Update the project
        const updatedProject = await Project.findOneAndUpdate(
            { uuid: id },
            { $set: updates },
            { new: true, runValidators: true }
        );

        // Return minimal project data (exclude activities)
        const minimal = {
            _id: updatedProject._id,
            uuid: updatedProject.uuid,
            name: updatedProject.name,
            description: updatedProject.description,
            status: updatedProject.status,
            docs: updatedProject.docs,
            json_schema_version: updatedProject.json_schema_version,
            createdAt: updatedProject.createdAt,
            updatedAt: updatedProject.updatedAt,
        };

        return res.status(200).json({ ok: true, project: minimal });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('updateProject error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ ok: false, error: err.message || String(err) });
    }
}

/**
 * PUT /projects/:id/activities/:activityId
 * Replace the matching activity in the project's activities array with req.body
 * Requirements:
 * - find project by uuid (req.params.id) and ensure status !== 'DELETED'
 * - iterate project.activities and replace the first item that matches activityId
 * - save the project and return the replaced activity
 * - do NOT validate request body (per instructions)
 */
async function updateActivity(req, res) {
    try {
        const { id: projectId, activityId } = req.params;

        if (!projectId || !activityId) return res.status(400).json({ ok: false, error: 'project id and activity id are required' });

        // Access control: only admins or users with explicit project assignment can update
        const { uuids, isAdmin } = getProjectAccessList(req.user?.user);
        if (!isAdmin && (!uuids || !uuids.includes(projectId))) {
            return res.status(403).json({ ok: false, error: 'Forbidden: no access to this project' });
        }

        const project = await Project.findOne({ uuid: projectId, status: { $ne: 'DELETED' } });
        if (!project) return res.status(404).json({ ok: false, error: 'Project not found or deleted' });

        if (!Array.isArray(project.activities)) project.activities = [];

        // find index of matching activity. Support common id keys.
        const idx = project.activities.findIndex((a) => {
            if (a == null) return false;
            if (typeof a === 'object') {
                return String(a.id) === String(activityId);
            }
            return false;
        });

        if (idx === -1) return res.status(404).json({ ok: false, error: 'Activity not found' });

        // replace the activity with the request body
        const newActivity = req.body;
        validateActivity(newActivity.measurement, newActivity.poTrigger, newActivity.poValue, newActivity.name, project.name, req.user?.user, project.uuid, activityId); // throws if invalid
        project.activities[idx] = newActivity;

        await project.save();

        return res.status(200).json({ ok: true });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('updateActivity error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ ok: false, error: err.message || String(err) });
    }
}

const validateActivity = (measurement, poTrigger, poValue, activityName, projectName, user, projectId, activityId) => {
    const promises = []
    if (!poTrigger) {
        return null
    }

    if (poTrigger === "id") {
        const poIdValues = poValue.reduce((acc, curr) => {
            if (curr.label) {
                if(acc[curr.label]) {
                    acc[curr.label] = acc[curr.label] + curr.value;
                } else {
                    acc[curr.label] = curr.value;
                }
            }
            return acc;
        }, {})
        console.log('poIdValues', poIdValues)
        const measurementIdValues = {}
        for (let i = 1; i < measurement.data.length; i++) {
            const row = measurement.data[i]
            if(measurementIdValues[row[0].value]){
                measurementIdValues[row[0].value] = measurementIdValues[row[0].value] + parseInt(row[row.length - 1].value)
            } else {
                measurementIdValues[row[0].value] = parseInt(row[row.length - 1].value)
            }
        }


        for (const key in measurementIdValues) {
            const poKeyValue = poIdValues[key] || 0
            if (poKeyValue < measurementIdValues[key]) {
                console.log('Invalid poValue for id', key, poKeyValue, measurementIdValues[key])
                promises.push(createAlert(projectId, projectName, activityId, activityName, user, key))
            }
        }
    }

    if( poTrigger === "value") {
        const poValueNumber = poValue[0]?.value || 0
        let measurementValue = 0
        for (let i = 1; i < measurement.data.length; i++) {
            const row = measurement.data[i]
            measurementValue = measurementValue + parseInt(row[row.length - 1].value)
        }
        if (poValueNumber < measurementValue) {
            console.log('Invalid poValue for value', poValueNumber, measurementValue, activityName)
            promises.push(createAlert(projectId, projectName, activityId, activityName, user))
        }
    }
}

const createAlert = async (projectId, projectName, activityId, activityName, user, poKey) => {
    const existingAlert = await Alerts.findOne({ "project.projectId": projectId, "activity.activityId": activityId, type: 'PO_VALUE_ERROR', status: 'PENDING' }).lean()
    if (!existingAlert) {
        await Alerts.create({
            type: 'PO_VALUE_ERROR',
            createdBy: {
                userId: user?._id?.toString?.() || 'unknown',
                name: user?.name || 'Unknown'
            },
            status: 'PENDING',
            project: { projectId: projectName, projectName: projectName || 'Unknown Project' },
            activity: { activityId: activityName, activityName: activityName || 'Unknown Activity' },
            alertText: `Measurement value ${poKey || ''} for ${activityName} in ${projectName} is more than PO value.`,
        })
    }
}

module.exports = { createProject, listProjects, getProjectActivities, updateProject, updateActivity };
