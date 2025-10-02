# ProtantrixBE - Simple Express Server

This folder contains a minimal Node + Express server used for local testing.

Files:
- `server.js` - simple express app with `/` and `/health` endpoints.
- `test_request.js` - starts the server and makes a single request to `/` to verify it's responding.
- `package.json` - project manifest.

Run locally:

1. Install dependencies:

   npm install

2. Start server:

   npm start

3. Run quick smoke test (starts server, requests `/`, then exits):

   npm run test-server
