const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');
const util = require('util');
const utils = require('../../utils');

const upload = multer({ dest: os.tmpdir() });

// Middleware to handle single file upload field named 'file'
const singleUpload = upload.single('file');

async function handleUploadForm(req, res) {
  try {
    // multer will populate req.file
    if (!req.file) return res.status(400).json({ ok: false, error: 'file is required' });

    const { originalname, path: tmpPath } = req.file;
    // Build file object expected by utils.uploadFile
    const fileObj = { path: tmpPath };

    const destPath = `protantrix/${req.body.path || ''}`
    const key = originalname;

    const result = await utils.uploadFile({ file: fileObj, path: destPath, key });

    return res.status(200).json({ ok: true, result: `${destPath}/${key}`});
  } catch (err) {
    console.error('handleUploadForm error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  } finally {
    // multer stores file in tmp; utils.uploadFile already unlinks in finally, so nothing to do here
  }
}

module.exports = { singleUpload, handleUploadForm };
