const { readFileSync } = require('node:fs')
const path = require('node:path')
const { ROOT } = require('../paths.cjs')

let known
/** String values declared in src/app/app-paths.ts (without ''). */
const knownPaths = () => {
  if (!known) {
    const source = readFileSync(path.join(ROOT, 'src/app/app-paths.ts'), 'utf8')
    known = new Set([...source.matchAll(/:\s*['"]([^'"$]+)['"]/g)].map((m) => m[1]))
  }
  return known
}

/** Literal route paths in router.navigate*, routerLink, path: on added lines. */
const check = ({ relPath, type, addedLines }) => {
  if (type !== 'ts' && type !== 'html') {
    return []
  }
  const paths = knownPaths()
  const warnings = []
  for (const { lineNumber, text } of addedLines) {
    if (!/navigate\w*\(|routerLink|\bpath\s*:/.test(text)) {
      continue
    }
    const literals = [...text.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1].replace(/^\//, ''))
    const hit = literals.find((s) => paths.has(s))
    if (hit) {
      warnings.push(`${relPath}:${lineNumber} literal route '${hit}', use app-paths.ts`)
    }
  }
  return warnings
}

module.exports = { check }
