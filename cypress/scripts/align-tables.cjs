// Aligns the columns of every Gherkin table in cypress/e2e/**/*.feature.
// `node cypress/scripts/align-tables.cjs [files...]` rewrites (all features when no file is given);
// with `--check` it only lists files that need it.
const fs = require('node:fs')
const path = require('node:path')

const args = process.argv.slice(2)
const check = args.includes('--check')
const given = args.filter((a) => a.endsWith('.feature'))
const root = path.join(__dirname, '..', 'e2e')

const features = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? features(p) : p.endsWith('.feature') ? [p] : []
  })

const cells = (line) => line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim())

function align(lines) {
  const out = [...lines]
  for (let i = 0; i < lines.length; ) {
    if (!lines[i].trim().startsWith('|')) { i++; continue }
    let j = i
    while (j < lines.length && lines[j].trim().startsWith('|')) j++
    const rows = lines.slice(i, j).map(cells)
    const indent = lines[i].match(/^\s*/)[0]
    const width = rows[0].map((_, c) => Math.max(...rows.map((r) => (r[c] ?? '').length)))
    rows.forEach((r, k) => {
      out[i + k] = indent + '| ' + width.map((w, c) => (r[c] ?? '').padEnd(w)).join(' | ') + ' |'
    })
    i = j
  }
  return out
}

const stale = []
for (const file of given.length ? given.map((f) => path.resolve(f)) : features(root)) {
  const before = fs.readFileSync(file, 'utf8')
  const after = align(before.split('\n')).join('\n')
  if (after === before) continue
  stale.push(path.relative(root, file))
  if (!check) fs.writeFileSync(file, after)
}
console.log(stale.length ? `${check ? 'needs alignment' : 'aligned'}: ${stale.join(', ')}` : 'all tables aligned')
process.exit(check && stale.length ? 1 : 0)
