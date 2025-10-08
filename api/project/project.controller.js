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
                Alerts.find({ "project.projectId": id, "createdBy.userId": req.user?.user?._id, type:'ACTIVITY_UNLOCK' }).lean(),
                Alerts.find({ "project.projectId": id, "seenBy": {$nin:[req.user?.user?._id]}, type:'NEW_COMMENT' }).lean()

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
    if (isAdmin) {
        for (let i = 0; i < activities.length; i++) {
            const isNewComment = comments.find(c => c.activity?.activityId === activities[i].id)
            if (isNewComment) {
                activities[i].isNewComment = true
            }
        }
    }
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
                }

                if (checkList.isRequired) {
                    if (!isValue) {
                        checlistCompleted = false
                    }
                }
            }

            if (checkList?.type?.toLowerCase() === 'daterange') {
                const isValue = !!checkList.value?.to && !!checkList.value.from
                if (isValue) {
                    checkList.disabled = true
                }
                if (checkList.isRequired) {
                    if (!isValue) {
                        checlistCompleted = false
                    }
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
                            }
                            if (checkList.isRequired) {
                                if (!isValue) {
                                    checlistCompleted = false
                                }
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

            if(measurement.value){
                measurement.disabled = true
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
        }
        if(!activities[i].isCompleted && userRequestForOpeningActivity?.status === 'PENDING'){
            activities[i].enableRequest = true
        }
        if(i > 0){
            activities[i].disabled =  !(activities[i-1].isCompleted || userRequestForOpeningActivity?.status === 'COMPLETED')
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
        console.log('Found project for updateActivity', projectId, activityId);

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
        project.activities[idx] = newActivity;

        await project.save();

        return res.status(200).json({ ok: true });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('updateActivity error:', err && err.stack ? err.stack : err);
        return res.status(500).json({ ok: false, error: err.message || String(err) });
    }
}

module.exports = { createProject, listProjects, getProjectActivities, updateProject, updateActivity };
