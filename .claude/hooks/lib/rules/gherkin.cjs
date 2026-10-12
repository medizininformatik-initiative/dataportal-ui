const { existsSync, readdirSync } = require('node:fs')
const path = require('node:path')
const { ROOT } = require('../paths.cjs')

const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = temp
    }
  }
  return row[b.length]
}

/** Needs @area:<module> or @cross-cutting; warns on a near-match step file name. */
const check = ({ relPath, type, content }) => {
  if (type !== 'feature') {
    return []
  }
  const warnings = []
  if (!/@area:\S+|@cross-cutting/.test(content)) {
    warnings.push(`${relPath}: missing @area:<module> or @cross-cutting tag`)
  }
  const dir = path.join(ROOT, path.dirname(relPath))
  const stem = path.basename(relPath, '.feature')
  if (existsSync(dir) && !existsSync(path.join(dir, `${stem}.ts`))) {
    const near = readdirSync(dir).find((f) => f.endsWith('.ts') && distance(normalize(f.slice(0, -3)), normalize(stem)) <= 2)
    if (near) {
      warnings.push(`${relPath}: step file '${near}' is a near-match of '${stem}.ts', it will not be loaded`)
    }
  }
  return warnings
}

module.exports = { check }
