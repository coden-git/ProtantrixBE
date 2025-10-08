const isEmpty = require('lodash/isEmpty')
const jwt = require('jsonwebtoken');
// Generic Joi-based validator middleware for body, query and params
// Usage: bodyValidator(schema), queryValidator(schema), paramsValidator(schema)
function validateSchema(schema, sourceName = 'body') {
    return (req, res, next) => {
        if (!schema || typeof schema.validate !== 'function') {
            // nothing to validate
            return next();
        }

        const source = req[sourceName] || {};
        const { error, value } = schema.validate(source, { stripUnknown: true, convert: true });
        if (error) {
            const message = error.details.map(d => d.message).join(', ');
            return res.status(422).json({ ok: false, error: message });
        }

        // replace with coerced/validated value
        req[sourceName] = value;
        return next();
    };
}

exports.bodyValidator = (schema) => validateSchema(schema, 'body');
exports.queryValidator = (schema) => validateSchema(schema, 'query');
exports.paramsValidator = (schema) => validateSchema(schema, 'params');

// Parse JSON string embedded in multipart field 'payload' (if present)
// This should run AFTER multer processed fields (i.e. after singleUpload) and BEFORE bodyValidator
exports.parseMultipartPayload = () => (req, res, next) => {
    try {
        console.log('parseMultipartPayload middleware', req.body.payload);
        if (req.body && typeof req.body.payload === 'string') {
            try {
                const parsed = JSON.parse(req.body.payload);
                // merge only plain object keys that are not already set to preserve explicit form fields precedence
                if (parsed && typeof parsed === 'object') {
                    Object.keys(parsed).forEach(k => {
                        if (req.body[k] === undefined) {
                            req.body[k] = parsed[k];
                        }
                    });
                }
            } catch (e) {
                // Invalid JSON - ignore but record note
                req._payloadParseError = 'Invalid payload JSON';
            }
        }
    } catch (err) {
        // swallow parse errors and continue
    }
    next();
};

// Admin auth middleware: checks authtoken against process.env.ADMIN_TOKEN
function stripQuotes(str) {
    if (typeof str !== 'string') return str;
    const s = str.trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        return s.slice(1, -1);
    }
    return s;
}

exports.adminAuth = (req, res, next) => {
    try {
        const expectedRaw = process.env.ADMIN_TOKEN;
        const expected = stripQuotes(expectedRaw || '');
        if (!expected) {
            return res.status(500).json({ ok: false, error: 'ADMIN_TOKEN not configured' });
        }

        // Prefer custom header 'authtoken'; allow Authorization: Bearer <token> and ?authtoken=
        const headerToken = req.headers.authtoken || req.headers['x-admin-token'] || '';
        const authHeader = req.headers.authorization || '';
        const queryToken = req.query && req.query.authtoken ? String(req.query.authtoken) : '';

        let incoming = String(headerToken || queryToken || authHeader).trim();
        if (/^bearer\s+/i.test(incoming)) {
            incoming = incoming.replace(/^bearer\s+/i, '').trim();
        }
        incoming = stripQuotes(incoming);

        if (!incoming || incoming !== expected) {
            return res.status(401).json({ ok: false, error: 'Unauthorized' });
        }
        return next();
    } catch (err) {
        return res.status(500).json({ ok: false, error: 'Auth check failed' });
    }
};

// Role-based JWT auth middleware factory
// Usage: authRole('admin') or authRole(['admin','user'])
exports.authRole = (required) => {
    const requiredRoles = Array.isArray(required) ? required : [required];
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization || '';
            if (!authHeader) {
                return res.status(401).json({ ok: false, error: 'Missing Authorization header' });
            }
            const match = authHeader.match(/^Bearer\s+(.+)/i);
            if (!match) {
                return res.status(401).json({ ok: false, error: 'Invalid Authorization header format' });
            }
            const token = match[1].trim();
            if (!process.env.JWT) {
                return res.status(500).json({ ok: false, error: 'JWT secret not configured' });
            }
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT.trim());
            } catch (err) {
                return res.status(401).json({ ok: false, error: 'Invalid or expired token' });
            }

            if (!decoded || !decoded?.user?.role) {
                return res.status(401).json({ ok: false, error: 'Token missing role' });
            }
            if (!requiredRoles.includes(decoded?.user?.role)) {
                return res.status(401).json({ ok: false, error: 'Unauthorized access' });
            }
            // Attach user payload
            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Auth processing failed' });
        }
    };
};