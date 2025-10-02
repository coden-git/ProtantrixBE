const child = require('child_process');
const fetch = require('node-fetch');
const path = require('path');

const serverProcess = child.spawn(process.execPath, [path.join(__dirname, 'server.js')], {
  env: Object.assign({}, process.env, { PORT: 0 }),
  stdio: ['ignore', 'pipe', 'pipe']
});

let started = false;
serverProcess.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  if (!started && text.match(/Server listening on port (\d+)/)) {
    started = true;
    // server picks default port 3000 unless PORT is set; read from env or assume 3000
    const portMatch = text.match(/Server listening on port (\d+)/);
    const port = portMatch ? Number(portMatch[1]) : 3000;
    setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/`);
        const body = await res.json();
        console.log('Test request response:', body);
      } catch (err) {
        console.error('Request failed:', err.message);
      } finally {
        serverProcess.kill();
      }
    }, 300);
  }
});

serverProcess.stderr.on('data', (chunk) => {
  process.stderr.write(chunk.toString());
});

serverProcess.on('exit', (code, sig) => {
  console.log('Server process exited', code, sig);
});
