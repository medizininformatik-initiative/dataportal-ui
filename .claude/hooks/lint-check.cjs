const { spawnSync } = require('node:child_process')
const { readFileSync } = require('node:fs')

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
if (input.stop_hook_active) process.exit(0)

const run = (cmd, args) => spawnSync(cmd, args, { encoding: 'utf8', timeout: 50000, maxBuffer: 10 * 1024 * 1024 })
const lines = (r) => r.stdout.split('\n').filter((f) => f.endsWith('.ts'))

const changed = [
  ...lines(run('git', ['diff', '--name-only', '--diff-filter=d', 'HEAD'])),
  ...lines(run('git', ['ls-files', '-o', '--exclude-standard'])),
]
if (changed.length === 0) process.exit(0)

const result = run('npx', ['eslint', '--quiet', ...changed])

if (result.status !== 0 || result.error) {
  const errors = [result.stdout, result.stderr, result.error?.message].filter(Boolean).join('\n').slice(-12000)

  console.log(JSON.stringify({ decision: 'block', reason: `Lint failed. Fix these errors before finishing:\n\n${errors}` }))
}
/**
 *   "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/lint-check.cjs\"",
            "timeout": 60,
            "type": "command"
          }
        ]
      }
    ]
  },
 */
