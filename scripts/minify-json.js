#!/usr/bin/env node
const { minifyJson } = require('../lib/minifyJson');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node scripts/minify-json.js <input.json> [output.min.json] [--gzip]');
    process.exit(1);
  }

  const input = args[0];
  const output = args[1] && !args[1].startsWith('--') ? args[1] : null;
  const gzip = args.includes('--gzip');

  try {
    const res = await minifyJson(input, output, { gzip });
    console.log('Wrote minified JSON to', res.output, 'size:', res.size, 'bytes');
    if (res.gzOutput) console.log('Wrote gzipped file to', res.gzOutput, 'size:', res.gzSize, 'bytes');
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

if (require.main === module) main();
