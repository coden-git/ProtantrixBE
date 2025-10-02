const Project = require('./project.model');
const JsonSchema = require('../config/json_schema.model');

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

module.exports = { createProject };

/**
 * GET /projects
 * Query params: page (default 1), limit (default 20, capped at 100)
 * Returns minimal project summaries (excludes activities)
 */
async function listProjects(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    let limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    limit = Math.min(limit, 100);

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Project.find({}, { activities: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({ ok: true, page, limit, total, totalPages, items });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('listProjects error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

module.exports = { createProject, listProjects };

/**
 * GET /projects/:id/activities
 * Returns the activities JSON for a project (may be large)
 */
async function getProjectActivities(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ uuid: id }, { activities: 1, json_schema_version: 1 }).lean();
    if (!project) return res.status(404).json({ ok: false, error: 'Project not found' });

    

    return res.status(200).json({ ok: true, json_schema_version: project.json_schema_version, activities: project.activities });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getProjectActivities error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

module.exports = { createProject, listProjects, getProjectActivities };

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

module.exports = { createProject, listProjects, getProjectActivities, updateActivity };
