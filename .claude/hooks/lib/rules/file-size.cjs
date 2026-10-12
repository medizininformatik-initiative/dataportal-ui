// Size and complexity limits (IDEAS.md post-edit 5.8). ESLint owns lines/function, depth, params.
// ponytail: regex heuristics, no AST. Upgrade to typescript-eslint custom rules if they misfire.

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])

const countLines = (content) => content.replace(/\n$/, '').split('\n').length

const templateDepth = (html) => {
  let depth = 0
  let max = 0
  for (const [, closing, name, selfClosing] of html.matchAll(/<(\/?)([a-zA-Z][\w-]*)[^>]*?(\/?)>/g)) {
    if (VOID.has(name.toLowerCase()) || selfClosing) {
      continue
    }
    depth += closing ? -1 : 1
    max = Math.max(max, depth)
  }
  return max
}

const constructorDeps = (content) => {
  const params = content.match(/constructor\s*\(([^)]*)\)/)?.[1].split(',').filter((p) => p.trim()).length ?? 0
  return params + (content.match(/\binject\(/g)?.length ?? 0)
}

const publicMethods = (content) => (content.match(/^\s+public\s+(?:static\s+)?(?:async\s+)?[A-Za-z_]\w*\s*[(<]/gm) ?? []).length

const inlineLines = (content) =>
  Math.max(0, ...[...content.matchAll(/\b(?:template|styles)\s*:\s*\[?\s*`([^`]*)`/g)].map((m) => m[1].split('\n').length))

/** Returns { soft: string[], hard: string[] } for one file. */
const measure = ({ relPath, content }) => {
  const soft = []
  const hard = []
  const isComponent = relPath.endsWith('.component.ts')
  const isService = relPath.endsWith('.service.ts')
  const lines = countLines(content)
  const band = (label, value, red, tolerance) => {
    if (value > red + tolerance) {
      hard.push(`${relPath}: ${label} ${value} > ${red + tolerance}`)
    } else if (value >= red - tolerance) {
      soft.push(`${relPath}: ${label} ${value} near limit ${red}`)
    }
  }
  if (isComponent || isService) {
    band('lines', lines, 200, 10)
  }
  if (relPath.endsWith('.component.html')) {
    band('template lines', lines, 50, 10)
  }
  if (relPath.endsWith('.html')) {
    const depth = templateDepth(content)
    if (depth > 5) {
      hard.push(`${relPath}: template nesting depth ${depth} > 5`)
    }
  }
  if (isService) {
    const deps = constructorDeps(content)
    if (deps > 3) {
      hard.push(`${relPath}: ${deps} constructor/inject() dependencies > 3`)
    }
    band('public methods', publicMethods(content), 10, 1)
  }
  if (isComponent) {
    const inline = inlineLines(content)
    if (inline > 5) {
      hard.push(`${relPath}: inline template/styles ${inline} lines > 5`)
    }
  }
  return { soft, hard }
}

const check = (file) => (file.type === 'ts' || file.type === 'html' ? measure(file).soft : [])
const checkHard = (file) => measure(file).hard

module.exports = { check, checkHard }
