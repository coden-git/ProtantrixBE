const fs = require('fs')
exports.uploadFile = async ({ file, path, key }) => {
  const AWS = require("aws-sdk");
  const s3 = new AWS.S3();
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: `${process.env.AWS_BUCKET_NAME}/${process.env.ENV}/${path}`,
    Key: key,
    Body: fileStream,
  };
  try {
    const res = await s3.putObject(uploadParams).promise();
    console.log(JSON.stringify(res));
    return res;
  } catch (error) {
    console.error(error, error.stack);
  } finally {
    fs.unlinkSync(file.path);
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { path } = req.body;
    const AWS = require("aws-sdk");
    const s3 = new AWS.S3();
    const bucket = process.env.AWS_BUCKET_NAME;
    const fileKey = `${process.env.ENV}/${path}`;
    console.log(fileKey);
    const fileStream = s3
      .getObject({ Bucket: bucket, Key: fileKey })
      .createReadStream()
      .on("error", () =>
        res.status(400).send({ error: "Unable to download file" })
      );
    res.attachment(fileKey);
    fileStream.pipe(res);
  } catch (e) {
    res.status(500);
  }
};

/**
 * Generate a presigned S3 GET URL for a file stored under the current ENV prefix.
 * @param {string} path - path (key) relative to the ENV prefix, e.g. "activities/myfile.jpg"
 * @param {number} [expiresSeconds=1800] - expiry in seconds (default 1800 = 30 minutes)
 * @returns {Promise<string>} - presigned URL
 */
exports.getPresignedDownloadUrl = async (path, expiresSeconds = 1800) => {
  if (!path) throw new Error('path is required');
  const AWS = require('aws-sdk');
  const region = "ap-south-1";
  const s3 = new AWS.S3({ signatureVersion: 'v4', region });

  const bucket = process.env.AWS_BUCKET_NAME;
  if (!bucket) throw new Error('AWS_BUCKET_NAME env var not set');

  const fileKey = `${process.env.ENV}/${path}`;

  const params = {
    Bucket: bucket,
    Key: fileKey,
    Expires: Number(expiresSeconds) || 1800,
  };

  // s3.getSignedUrl supports callback; wrap in Promise for async/await
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) return reject(err);
      resolve(url);
    });
  });

};


exports.getProjectAccessList = (user) => {
  const role = user?.role;
  const isAdmin = role === 'admin';
  const userProjects = Array.isArray(user?.projects) ? user.projects : [];
  const uuids = isAdmin
    ? [] // Admin treated specially by callers (no restriction if isAdmin)
    : userProjects
        .map(p => (p && typeof p === 'object' ? p.uuid : null))
        .filter(Boolean);
  return { uuids, isAdmin };
};

/**
 * Delete a file from S3 under the current ENV prefix.
 * Path should be relative to the ENV prefix (e.g. "activities/myfile.jpg").
 * @param {string} path Relative key (without leading slash) inside the ENV namespace
 * @returns {Promise<{ok: boolean, path: string}>}
 */
exports.deleteFile = async (path) => {
  if (!path) throw new Error('path is required');
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3();
  const bucket = process.env.AWS_BUCKET_NAME;
  if (!bucket) throw new Error('AWS_BUCKET_NAME env var not set');
  const key = `${process.env.ENV}/${path}`;
  try {
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
    return { ok: true, path };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('deleteFile error', err);
    throw err;
  }
};

