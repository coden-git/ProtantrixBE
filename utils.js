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

