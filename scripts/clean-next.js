/**
 * Removes Next.js build output and bundler caches that often cause
 * "Cannot find module './NNN.js'" in dev when chunks get out of sync.
 */
const fs = require('fs');
const path = require('path');

function rmSyncSafe(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Removed:', dir);
  } catch (e) {
    if (e && e.code !== 'ENOENT') console.warn('Skip:', dir, e.message);
  }
}

const root = path.join(__dirname, '..');
rmSyncSafe(path.join(root, '.next'));
rmSyncSafe(path.join(root, 'node_modules', '.cache'));
console.log('Done. Run: npx next dev -p 3000');
