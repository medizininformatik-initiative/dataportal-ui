const { spawnSync } = require('node:child_process')
const path = require('node:path')
const { ROOT } = require('./paths.cjs')

/** spawnSync without a shell, repo root as cwd. */
const run = (command, args, timeoutMs = 120000) =>
  spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 50 * 1024 * 1024, env: { ...process.env, NODE_NO_WARNINGS: '1' } })

/** Runs node_modules/.bin/<name> with flags first, then files. */
const runTool = (name, options, files = [], timeoutMs) => run(path.join(ROOT, 'node_modules', '.bin', name), [...options, ...files], timeoutMs)

module.exports = { run, runTool }
