const { existsSync, readFileSync } = require('node:fs')
const path = require('node:path')
const { trimOutput } = require('./lib/diagnostics.cjs')
const { getAddedLines } = require('./lib/git-changes.cjs')
const { collectMessages, summarize } = require('./lib/eslint-results.cjs')
const { readInput } = require('./lib/input.cjs')
const { addContext, allow } = require('./lib/output.cjs')
const { ROOT, isIgnoredPath, toRepoPath } = require('./lib/paths.cjs')
const { runTool } = require('./lib/run-command.cjs')

const rules = (name) => require(`./lib/rules/${name}.cjs`)
const i18n = rules('i18n')

// file type -> [name, check] in call order. New rule = one file + one line.
const RULES = {
  ts: [['routes', rules('routes').check], ['i18n', i18n.checkReferences], ['file-size', rules('file-size').check]],
  html: [
    ['routes', rules('routes').check],
    ['data-cy', rules('data-cy').check],
    ['design-tokens', rules('design-tokens').check],
    ['i18n', i18n.checkReferences],
    ['file-size', rules('file-size').check],
  ],
  scss: [['design-tokens', rules('design-tokens').check]],
  i18n: [['i18n-parity', i18n.checkParity]],
  feature: [['gherkin', rules('gherkin').check]],
}

const detectType = (relPath) => {
  if (/^src\/assets\/i18n\/[^/]+\.json$/.test(relPath)) {
    return 'i18n'
  }
  if (/^cypress\/.*\.feature$/.test(relPath)) {
    return 'feature'
  }
  return { '.ts': 'ts', '.html': 'html', '.scss': 'scss' }[path.extname(relPath)]
}

const filePath = readInput().tool_input?.file_path
const relPath = filePath && toRepoPath(filePath)
if (!relPath || isIgnoredPath(relPath) || !existsSync(path.join(ROOT, relPath))) {
  allow()
}
const type = detectType(relPath)
if (!type) {
  allow()
}

const notes = []
const absolute = path.join(ROOT, relPath)

// 4. Format
const before = readFileSync(absolute, 'utf8')
runTool('prettier', ['--write', '--ignore-unknown'], [relPath], 60000)
const content = readFileSync(absolute, 'utf8')
if (content !== before) {
  notes.push(`prettier reformatted ${relPath}, re-read before next Edit`)
}

// 5.1 eslint, warnings too
if (type === 'ts' || type === 'html') {
  const result = runTool('eslint', ['--format', 'json'], [relPath], 120000)
  try {
    const json = JSON.parse(result.stdout)
    const messages = collectMessages(json)
    notes.push(...(messages.length > 0 ? [`[eslint] ${relPath}`, ...summarize(messages)] : []))
  } catch {
    notes.push(`${relPath} [eslint] could not run: ${trimOutput(`${result.stderr || result.error?.message || ''}`, 300)}`)
  }
}

// 5.2 to 5.8 repo rules, each on the formatted file
const addedLines = getAddedLines(relPath)
for (const [name, check] of RULES[type]) {
  try {
    notes.push(...check({ relPath, type, content, addedLines }).map((w) => `[${name}] ${w}`))
  } catch (e) {
    notes.push(`[${name}] rule crashed: ${e.message}`)
  }
}

if (notes.length > 0) {
  addContext('PostToolUse', trimOutput(notes.join('\n'), 9000))
}
