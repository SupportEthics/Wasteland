// Builds www/ for the Capacitor shell from the canonical game file.
//  1. copies ../mockup/index.html (inlining the title art like build_artifact.py)
//  2. STRIPS the DEV MODE block (marked in the source) — test builds keep it
//     only if you pass --keep-dev
//  3. bundles src/native.js (Capacitor plugin overrides) and injects it
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const keepDev = process.argv.includes('--keep-dev');
mkdirSync('www', { recursive: true });

let html = readFileSync('../mockup/index.html', 'utf8');

// inline webp assets as data URIs (same as mockup/build_artifact.py)
html = html.replace(/(["'(])assets\/(\w+)\.webp/g, (m, q, name) => {
  const b64 = readFileSync(`../mockup/assets/${name}.webp`).toString('base64');
  return `${q}data:image/webp;base64,${b64}`;
});

// strip the DEV MODE block between its markers
if (!keepDev) {
  const start = html.indexOf('/* ============================================================\n   DEV MODE');
  const end = html.indexOf('/* ==================== end DEV MODE block ==================== */');
  if (start === -1 || end === -1) throw new Error('DEV MODE markers not found');
  html = html.slice(0, start) + html.slice(end + '/* ==================== end DEV MODE block ==================== */'.length);
  html = html.replace('devTopUp();                                        // DEV MODE hook — remove for release\n', '');
  if (/DEV_MODE|devTopUp|dev-badge/.test(html.replace(/#dev-badge[^}]*}/g, ''))) {
    console.warn('WARNING: dev-mode references remain — check the strip markers');
  }
}

// bundle the native bridge overrides and inject before </body>
execSync('npx esbuild src/native.js --bundle --format=iife --outfile=www/native.js', { stdio: 'inherit' });
html = html.replace('</body>', '<script src="./native.js"></script>\n</body>');

writeFileSync('www/index.html', html);
console.log(`www/index.html written (${(html.length / 1024).toFixed(0)}KB, dev mode ${keepDev ? 'KEPT' : 'stripped'})`);
