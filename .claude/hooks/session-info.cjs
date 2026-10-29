const { readInput } = require('./lib/input.cjs')
const { addContext } = require('./lib/output.cjs')
const { run } = require('./lib/run-command.cjs')

const wait = process.argv.includes('--wait')

/** One status snapshot: { docker: bool, items: [[label, up]] }. */
const snapshot = () => {
  const ps = run('docker', ['ps', '-a', '--format', '{{.Names}}\t{{.Status}}'], 3000)
  const dev = run('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '1', 'http://localhost:4200'], 2000)
  const dockerUp = !ps.error && ps.status === 0
  const status = Object.fromEntries((ps.stdout || '').split('\n').filter(Boolean).map((l) => l.split('\t')))
  const has = (name, pattern) => pattern.test(status[name] ?? '')
  return {
    dockerUp,
    items: [
      ['Angular dev server', /^[23]/.test(dev.stdout || '')],
      ['Backend', has('dataportal-backend', /\(healthy\)/)],
      ['Keycloak', has('keycloak-auth', /^Up/)],
      ['PostgreSQL', has('dataportal-postgres', /^Up/)],
      ['Elasticsearch', has('dataportal-elastic', /\(healthy\)/)],
      ['Elasticsearch init', has('elastic-search-init', /^Exited \(0\)/)],
    ],
  }
}

const report = ({ dockerUp, items }) => {
  if (!dockerUp) {
    return 'Docker unavailable, backend-dependent work will fail'
  }
  if (items.every(([, up]) => up)) {
    return 'Local stack: all up'
  }
  return [
    'Local environment:',
    ...items.map(([label, up]) => `- ${label}: ${up ? 'up' : 'unavailable'}`),
    'Frontend-only work can proceed. Backend-dependent tests may fail.',
    'Before backend, e2e or browser work run `node .claude/hooks/session-info.cjs --wait`',
  ].join('\n')
}

if (wait) {
  let state = snapshot()
  for (let i = 1; i < 10 && (!state.dockerUp || !state.items.every(([, up]) => up)); i++) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000)
    state = snapshot()
  }
  console.log(report(state))
} else {
  readInput()
  addContext('SessionStart', report(snapshot()))
}
