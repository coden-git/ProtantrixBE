const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const compression = require('compression');
const helmet = require('helmet');
const dbCon = require('./connection');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ProtantrixBE simple server',
  });
});

app.get('/health', (req, res) => {
  res.send('healthy');
});
// mount API router and swagger
const apiRouter = require('./api/router');
app.use('/api/v1', apiRouter);

// swagger-ui: use programmatic OpenAPI builder (no YAML file required)
try {
  const swaggerUi = require('swagger-ui-express');
  const openapiBuilder = require('./api/openapi.builder');
  // the router or other modules can call openapiBuilder.attachDoc() to add
  // route docs at startup time. Here we simply expose the generated spec.
  const swaggerDocument = openapiBuilder.getSpec();
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.warn('swagger-ui not available (dev only)');
}

dbCon.connect();
const server = app.listen(PORT, () => {
  const boundPort = server.address() && server.address().port;
  console.log(`Server listening on port ${boundPort}`);
});

// Graceful shutdown
function shutdown() {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forcing shutdown');
    process.exit(1);
  }, 5000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = server;
