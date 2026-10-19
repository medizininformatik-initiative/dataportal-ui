// Checks styles-next for silent failures. Usage: node scripts/check-styles.cjs [check-name ...]
// Add a check: push { name, run(ctx) } to CHECKS; run returns a list of problem strings.
const { spawnSync } = require('node:child_process');
const { readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');

const STYLES = 'src/styles-next';
const SCAN = ['src/app', `${STYLES}/custom-material`]; // where reads happen
const VAR_PREFIXES = ['--font-']; // add '--color-', '--num-color--' when their reads are clean

const files = (dir, ext) => readdirSync(dir, { recursive: true, withFileTypes: true })
  .filter((f) => f.isFile() && ext.test(f.name))
  .map((f) => path.join(f.parentPath, f.name));

// every match of re (group 1) in every file: [{ file, line, name }]
const grep = (dirs, ext, re) => dirs.flatMap((d) => files(d, ext)).flatMap((file) =>
  readFileSync(file, 'utf8').split('\n').flatMap((text, i) =>
    [...text.matchAll(re)].map((m) => ({ file, line: i + 1, name: m[1] }))));

const CHECKS = [
  { // var(--x) is read but no CSS writes --x: the browser ignores it and the text inherits silently
    name: 'vars-read-but-not-written',
    run: ({ css }) => {
      const written = new Set([...css.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1]));
      return grep(SCAN, /\.(scss|css|html|ts)$/, /var\((--[\w-]+)/g)
        .filter((r) => VAR_PREFIXES.some((p) => r.name.startsWith(p)) && !written.has(r.name))
        .map((r) => `${r.file}:${r.line}  ${r.name} is read, never written`);
    },
  },
  { // a *_themed mixin exists but _index.scss never includes it: its variables are never emitted
    name: 'mixins-defined-but-not-included',
    run: () => {
      const index = readFileSync(`${STYLES}/custom-material/_index.scss`, 'utf8');
      return grep([`${STYLES}/custom-material`], /\.scss$/, /@mixin\s+([\w-]+_themed)\b/g)
        .filter((r) => r.name !== 'custom-material_themed' && !index.includes(`@include ${r.name}(`))
        .map((r) => `${r.file}:${r.line}  @mixin ${r.name} is never included in _index.scss`);
    },
  },
];

const wanted = process.argv.slice(2);
const sass = spawnSync('npx', ['sass', '--load-path=.', '--load-path=node_modules', `${STYLES}/styles.scss`], { encoding: 'utf8', maxBuffer: 1 << 26 });
if (sass.status !== 0) { console.error(sass.stderr); process.exit(2); }
const ctx = { css: sass.stdout };

let failed = 0;
for (const c of CHECKS.filter((c) => !wanted.length || wanted.includes(c.name))) {
  const problems = c.run(ctx);
  console.log(`${problems.length ? 'FAIL' : 'ok  '} ${c.name}`);
  problems.forEach((p) => console.log(`       ${p}`));
  failed += problems.length;
}
process.exit(failed ? 1 : 0);
