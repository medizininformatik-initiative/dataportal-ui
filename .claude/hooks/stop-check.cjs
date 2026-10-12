const { existsSync, readFileSync, rmSync, writeFileSync } = require('node:fs')
const path = require('node:path')
const { classify, reportLine, trimOutput } = require('./lib/diagnostics.cjs')
const { collectMessages, summarize } = require('./lib/eslint-results.cjs')
const { getChangedFiles, isNewFile } = require('./lib/git-changes.cjs')
const { readInput } = require('./lib/input.cjs')
const { allow, blockStop, notify } = require('./lib/output.cjs')
const { ROOT } = require('./lib/paths.cjs')
const { runTool } = require('./lib/run-command.cjs')
const { checkHard } = require('./lib/rules/file-size.cjs')
const { fingerprint, loadState, saveState } = require('./lib/state.cjs')

const MAX_ATTEMPTS = 3
const SCOPE_LINE = 'Fix only violations on lines you changed. Do not touch old warnings or refactor old code.'

// Soft value is the warning in .eslintrc.json, the hard value is set here (IDEAS.md post-edit 5.8).
const HARD_RULES = { 'max-lines-per-function': ['error', { max: 22, skipBlankLines: true, skipComments: true }] }
const eslintTsArgs = ['--format', 'json', '--rule', JSON.stringify(HARD_RULES)]

const input = readInput()
const sessionId = input.session_id || 'unknown'
const state = loadState(sessionId)
saveState(sessionId, state) // pins `base` at the first Stop of the session

// 2/3. Changed files, gate
const changed = getChangedFiles(state.base)
const changedFiles = changed.filter((f) => /\.(ts|html|scss)$/.test(f) || /^tsconfig.*\.json$/.test(f))
if (changedFiles.length === 0) {
  allow()
}
const hash = fingerprint(changedFiles)
if (hash === state.lastPassHash) {
  allow()
}

const tsFiles = changedFiles.filter((f) => f.endsWith('.ts'))
const htmlFiles = changedFiles.filter((f) => f.endsWith('.html'))
const results = [] // { label, tool, status, output, hints }
const record = (label, tool, result, output, hints = []) =>
  results.push({ label, tool, status: classify(tool, result), output: output ?? `${result.stdout}\n${result.stderr}`.trim(), hints })

// 4.2 eslint (type-aware promotion rules only for .ts; the template parser cannot run them)
if (tsFiles.length + htmlFiles.length > 0) {
  const runs = [
    tsFiles.length > 0 && runTool('eslint', eslintTsArgs, tsFiles, 150000),
    htmlFiles.length > 0 && runTool('eslint', ['--format', 'json'], htmlFiles, 60000),
  ].filter(Boolean)
  let json = []
  let crashed
  for (const r of runs) {
    try {
      json = json.concat(JSON.parse(r.stdout))
    } catch {
      crashed = r
    }
  }
  // Warnings count too, but only on lines this session added (CLAUDE.md: 0 warnings on own code).
  const messages = collectMessages(json)
  const failing = { status: crashed ? crashed.status || 2 : messages.length > 0 ? 1 : 0, error: crashed?.error, stdout: '', stderr: '' }
  record('ESLint', 'eslint', failing, crashed ? `${crashed.stdout}\n${crashed.stderr}`.trim() : summarize(messages, 10).join('\n'))
}

// 4.3 prettier
const prettier = runTool('prettier', ['--check'], changedFiles.filter((f) => !f.startsWith('tsconfig')), 60000)
record('Prettier', 'prettier', prettier)

// 4.4 tsc: whole project, then strict on changed src files only, then dependency rules
if (tsFiles.length > 0 || changedFiles.some((f) => f.startsWith('tsconfig'))) {
  record('TypeScript', 'tsc', runTool('tsc', ['--noEmit', '-p', 'tsconfig.app.json'], [], 200000))
}
const strictFiles = tsFiles.filter((f) => f.startsWith('src/') && !f.endsWith('.spec.ts') && existsSync(path.join(ROOT, f)))
if (strictFiles.length > 0) {
  const tmp = path.join(ROOT, 'tsconfig.strict.changed.json')
  writeFileSync(tmp, JSON.stringify({ extends: './tsconfig.strict.json', include: ['src/**/*.d.ts'], files: strictFiles }))
  const strict = runTool('tsc', ['-p', tmp], [], 200000)
  rmSync(tmp, { force: true })
  const ownErrors = (strict.stdout || '').split('\n').filter((l) => strictFiles.some((f) => l.startsWith(f)))
  const status = strict.error ? 'ERROR' : ownErrors.length > 0 ? 'FAIL' : 'PASS'
  results.push({ label: 'Strict TS', tool: 'tsc', status, output: ownErrors.join('\n') || strict.error?.message || '', hints: [] })
}
if (tsFiles.length > 0) {
  record('Dependencies', 'depcruise', runTool('depcruise', ['src', '--config', '.dependency-cruiser.cjs', '--output-type', 'err'], [], 120000))
}

// 5.8 hard size limits (soft band is post-edit's job)
const sizeErrors = tsFiles
  .concat(htmlFiles)
  .filter((f) => !f.endsWith('.spec.ts') && existsSync(path.join(ROOT, f)))
  .flatMap((f) => checkHard({ relPath: f, content: readFileSync(path.join(ROOT, f), 'utf8') }))
results.push({ label: 'Size', tool: 'size', status: sizeErrors.length > 0 ? 'FAIL' : 'PASS', output: sizeErrors.join('\n'), hints: sizeErrors.length ? ['Split the file/function, do not just shorten lines.'] : [] })

// 4.5 jest
const jestFiles = tsFiles.filter((f) => existsSync(path.join(ROOT, f)))
if (jestFiles.length > 0) {
  record('Jest', 'jest', runTool('jest', ['--coverage=false', '--silent', '--passWithNoTests', '--findRelatedTests'], jestFiles, 300000))
}

// 5. Warn only: new logic files without a spec
const warnings = tsFiles
  .filter((f) => /\.(service|pipe|guard|interceptor)\.ts$/.test(f) && !f.endsWith('.spec.ts') && isNewFile(f, state.base))
  .filter((f) => !existsSync(path.join(ROOT, f.replace(/\.ts$/, '.spec.ts'))))
  .map((f) => `Warning: new file ${f} has no ${path.basename(f).replace(/\.ts$/, '.spec.ts')}`)

// 7. Decide and report
const failed = results.filter((r) => r.status === 'FAIL')
const errored = results.filter((r) => r.status === 'ERROR')
const report = results.map((r) => reportLine(r.label, r.status)).join('\n')

if (failed.length > 0) {
  if (state.attempts >= MAX_ATTEMPTS) {
    notify(`dod-check: still failing after ${MAX_ATTEMPTS} blocks: ${state.lastFailures.join(', ')}. Work is NOT verified.`)
  }
  const attempts = state.attempts + 1
  saveState(sessionId, { ...state, attempts, lastFailures: failed.map((r) => r.label) })
  const details = failed.map((r) => [`--- ${r.label} ---`, ...r.hints, trimOutput(r.output)].join('\n')).join('\n\n')
  const last =
    attempts === MAX_ATTEMPTS
      ? `\n\nLast attempt. If you cannot fix it, your final answer MUST say which checks still fail (${failed.map((r) => r.label).join(', ')}) and that the work is NOT verified.`
      : ''
  blockStop([report, details, ...warnings, SCOPE_LINE].join('\n\n') + last)
}
if (errored.length > 0) {
  notify(`dod-check: environment problem, not a code defect: ${errored.map((r) => r.label).join(', ')}. Work is NOT fully verified.`)
}

// 8. All pass
saveState(sessionId, { ...state, attempts: 0, lastPassHash: hash, lastFailures: [] })
if (warnings.length > 0) {
  notify(warnings.join('\n'))
}
allow()
