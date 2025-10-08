const Comment = require('./comments.model');
const utils = require('../../utils');
const os = require('os');
const multer = require('multer');
const Alerts = require('../alerts/alerts.model');
const { getProjectAccessList } = require('../../utils');
const upload = multer({ dest: os.tmpdir() });

// Reuse style: field name 'file'
const singleUpload = upload.single('file');

// List recent comments for a project/activity (max 100 newest first)
async function listComments(req, res) {
  try {
    const { projectId, activityId } = req.params;
    if (!projectId || !activityId) {
      return res.status(422).json({ ok: false, error: 'projectId and activityId required' });
    }
    // Access control: verify user can access this project
    const user = req.user?.user || req.user || {};
    const { uuids, isAdmin } = getProjectAccessList(user);
    if (!isAdmin) {
      if (uuids.length === 0 || !uuids.includes(projectId)) {
        return res.status(403).json({ ok: false, error: 'Forbidden: no access to project' });
      }
    }
    const docs = await Comment.find({ 'project.projectId': projectId, 'activity.activityId': activityId })
      .sort({ createdDate: -1 })
      .limit(100)
      .lean({ defaults: true });
    return res.json({ ok: true, count: docs.length, comments: docs });
  } catch (err) {
    console.error('listComments error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

async function createCommentWithFile(req, res) {
  try {
    const { projectId, activityId } = req.params;
  const { comment, projectName, activityName } = req.body; // merged (may include parsed payload fields)
  if (req._payloadParseError) {
    console.warn('payload JSON parse issue:', req._payloadParseError);
  }
    if (!comment || !comment.trim()) {
      return res.status(422).json({ ok: false, error: 'comment is required' });
    }
    // Access control
    const accessUser = req.user?.user || req.user || {};
    const { uuids, isAdmin } = getProjectAccessList(accessUser);
    if (!isAdmin) {
      if (uuids.length === 0 || !uuids.includes(projectId)) {
        return res.status(403).json({ ok: false, error: 'Forbidden: no access to project' });
      }
    }
    
    let fileUri = null;
    if (req.file) {
      // Build destination path (namespace by project/activity)
      const destPath = `protantrix/comments/${projectId}/${activityId}`;
      const key = req.file.originalname;
      const fileObj = { path: req.file.path };
      try {
        await utils.uploadFile({ file: fileObj, path: destPath, key });
        fileUri = `${destPath}/${key}`;
      } catch (e) {
        console.warn('File upload failed, continuing without file', e);
      }
    }

  const user = req.user?.user || req.user || {}; // expecting auth middleware sets req.user
    if (!user || !user._id) {
      // attempt fallback fields if different structure
    }

    const doc = await Comment.create({
      comment: comment.trim(),
      commentedBy: {
        userId: user.uuid || user._id?.toString?.() || 'unknown',
        userName: user.name || 'Unknown'
      },
      fileUri: fileUri || undefined,
        project: { projectId, projectName: projectName || 'Unknown Project' },
        activity: { activityId, activityName: activityName || 'Unknown Activity' },
        });

    Alerts.create({    
        type: 'NEW_COMMENT',
        createdBy: {
            userId: user._id?.toString?.() || 'unknown',
            name: user.name || 'Unknown'
        },
        status:'COMPLETED',
        project: { projectId, projectName: projectName || 'Unknown Project' },
        activity: { activityId, activityName: activityName || 'Unknown Activity' },
        alertText: comment.trim(),
        seenBy: [user._id?.toString?.() || 'unknown'],
    });

    return res.status(201).json({ ok: true, comment: doc });
  } catch (err) {
    console.error('createCommentWithFile error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

module.exports = { singleUpload, createCommentWithFile, listComments };