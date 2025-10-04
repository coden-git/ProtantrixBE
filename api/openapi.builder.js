// Simple OpenAPI builder to allow attaching docs programmatically
const baseSpec = {
  openapi: '3.1.0',
  info: { title: 'ProtantrixBE API', version: '1.0.0' },
  servers: [{ url: '/api/v1' }],
  paths: {},
  components: { schemas: {}, securitySchemes: {} },
};

function attachDoc(path, method, doc) {
  if (!baseSpec.paths[path]) baseSpec.paths[path] = {};
  baseSpec.paths[path][method.toLowerCase()] = doc;
}

function addSchema(name, schema) {
  baseSpec.components.schemas[name] = schema;
}

function addSecurityScheme(name, scheme) {
  baseSpec.components.securitySchemes[name] = scheme;
}

function setGlobalSecurity(securityArray) {
  baseSpec.security = Array.isArray(securityArray) ? securityArray : undefined;
}

function getSpec() {
  return baseSpec;
}

module.exports = { attachDoc, addSchema, addSecurityScheme, setGlobalSecurity, getSpec };
