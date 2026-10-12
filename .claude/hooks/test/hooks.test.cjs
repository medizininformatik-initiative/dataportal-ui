// Run: node --test .claude/hooks/test/hooks.test.cjs
const assert = require('node:assert')
const { spawnSync } = require('node:child_process')
const { mkdirSync, mkdtempSync, writeFileSync } = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

const HOOKS = path.join(__dirname, '..')
const REPO = path.resolve(HOOKS, '..', '..')

const hook = (name, input, env = {}) =>
  spawnSync('node', [path.join(HOOKS, name)], { input: JSON.stringify(input), encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: REPO, ...env } })

const bash = (command) => hook('guard-bash.cjs', { tool_input: { command } })
const write = (file_path) => hook('guard-new-file.cjs', { tool_input: { file_path } })

test('guard-bash denies destructive commands', () => {
  for (const c of ['git commit --no-verify -m x', 'git push --force origin main', 'git push -f', 'git reset --hard HEAD~1', 'git checkout -- .', 'rm -rf node_modules', 'rm -fr x']) {
    assert.strictEqual(bash(c).status, 2, c)
  }
})

test('guard-bash allows safe commands', () => {
  for (const c of ['git status', 'git push --force-with-lease', 'git commit -m "fix"', 'rm file.txt', 'npm test']) {
    assert.strictEqual(bash(c).status, 0, c)
  }
})

test('guard-bash ignores quoted text and heredocs, still catches wrapped commands', () => {
  for (const c of ['git commit -m "no -n here"', 'git commit -m "rm -rf is bad"', "cat <<'E'\nrm -rf x\nE", 'git push --force-with-lease']) {
    assert.strictEqual(bash(c).status, 0, c)
  }
  for (const c of ['bash -c "rm -rf x"', 'git push origin +main', 'rm -r -f x', 'git clean -fdx', 'git restore .']) {
    assert.strictEqual(bash(c).status, 2, c)
  }
})

test('i18n rule: HttpClient.get is not a translation key, translate.get is', () => {
  const { checkReferences } = require('../lib/rules/i18n.cjs')
  const run = (text) => checkReferences({ relPath: 'a.ts', type: 'ts', addedLines: [{ lineNumber: 1, text }] })
  assert.deepStrictEqual(run("this.http.get('/api')"), [])
  assert.strictEqual(run("this.translate.get('NOPE.KEY.X')").length, 2)
})

test('guard-new-file denies kebab-case in service/, allows Pascal, suffixes, index, other folders', () => {
  assert.strictEqual(write('src/app/service/Foo/foo-bar.service.ts').status, 2)
  assert.match(write('src/app/service/Foo/foo-bar.service.ts').stderr, /FooBar\.service\.ts/)
  assert.strictEqual(write('src/app/service/NewFolderX/FooBar.service.ts').status, 0)
  assert.strictEqual(write('src/app/model/Foo.d.ts').status, 0)
  assert.strictEqual(write('src/app/model/index.ts').status, 0)
  assert.strictEqual(write('src/app/shared/components/foo-bar.component.ts').status, 0)
  assert.strictEqual(write('/etc/passwd').status, 0)
})

test('guard-new-file denies a new kebab-case folder under service/', () => {
  assert.strictEqual(write('src/app/service/new-folder/Foo.service.ts').status, 2)
})

test('guard-new-file allows rewriting an existing legacy file', () => {
  assert.strictEqual(write('src/app/app-routing.module.ts').status, 0)
})

test('rules: data-cy, design tokens, file size', () => {
  const lines = (...texts) => texts.map((text, i) => ({ lineNumber: i + 1, text }))
  assert.strictEqual(require('../lib/rules/data-cy.cjs').check({ relPath: 'a.html', type: 'html', addedLines: lines('<div data-cy="x">') }).length, 1)
  const tokens = require('../lib/rules/design-tokens.cjs').check
  assert.strictEqual(tokens({ relPath: 'a.scss', type: 'scss', addedLines: lines('color: #fff;', '--c: #fff;', '// #fff', 'padding: 4px;') }).length, 2)
  const size = require('../lib/rules/file-size.cjs')
  const file = (n) => ({ relPath: 'a.component.ts', type: 'ts', content: 'x\n'.repeat(n) })
  assert.strictEqual(size.checkHard(file(211)).length, 1)
  assert.strictEqual(size.checkHard(file(210)).length, 0)
  assert.strictEqual(size.check(file(195)).length, 1)
  assert.strictEqual(size.check(file(100)).length, 0)
})

test('stop-check: no relevant changed files -> silent allow', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'hook-repo-'))
  const git = (...a) => spawnSync('git', a, { cwd: dir, encoding: 'utf8' })
  git('init', '-q')
  git('-c', 'user.email=a@b', '-c', 'user.name=t', 'commit', '--allow-empty', '-qm', 'init')
  writeFileSync(path.join(dir, 'notes.md'), 'x')
  const r = hook('stop-check.cjs', { session_id: 'test-silent' }, { CLAUDE_PROJECT_DIR: dir })
  assert.strictEqual(r.status, 0)
  assert.strictEqual(r.stdout, '')
})

test('stop-check: broken environment -> notify, never block', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'hook-repo-'))
  const git = (...a) => spawnSync('git', a, { cwd: dir, encoding: 'utf8' })
  git('init', '-q')
  git('-c', 'user.email=a@b', '-c', 'user.name=t', 'commit', '--allow-empty', '-qm', 'init')
  mkdirSync(path.join(dir, 'src'))
  writeFileSync(path.join(dir, 'src', 'A.ts'), 'export const a = 1\n') // no node_modules in this repo -> tools ENOENT
  const r = hook('stop-check.cjs', { session_id: 'test-env' }, { CLAUDE_PROJECT_DIR: dir })
  assert.strictEqual(r.status, 0)
  const out = JSON.parse(r.stdout)
  assert.ok(out.systemMessage && !out.decision, r.stdout)
  assert.match(out.systemMessage, /environment problem/)
})

test('cycle-reset exits silently', () => {
  const r = hook('cycle-reset.cjs', { session_id: 'test-cycle' })
  assert.strictEqual(r.status, 0)
  assert.strictEqual(r.stdout, '')
})
