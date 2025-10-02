const isEmpty = require('lodash/isEmpty')
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