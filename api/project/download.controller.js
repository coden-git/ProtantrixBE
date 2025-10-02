const utils = require('../../utils');

/**
 * GET /project/download/:path
 * Returns a presigned S3 GET URL for a file stored under the ENV prefix.
 * The route accepts the file path as a URL-encoded path parameter. For example:
 * GET /project/download/activities%2Fmyfile.jpg
 */
async function getPresignedDownload(req, res) {
  try {
    let { path } = req.params;
    // Express will not include slashes in a single path param by default if not encoded;
    // clients should URL-encode the path. Support a fallback where the path is provided
    // via query string `?path=` for convenience.
    if (!path || path === ':path') {
      path = req.query.path;
    }

    if (!path) return res.status(400).json({ ok: false, error: 'path is required (url-encode slashes)'});

    // Optional expires query param (seconds)
    const expires = req.query.expires ? Number(req.query.expires) : undefined;

    const url = await utils.getPresignedDownloadUrl(path, expires);

    return res.status(200).json({ ok: true, url });
  } catch (err) {
    console.error('getPresignedDownload error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}

module.exports = { getPresignedDownload };
