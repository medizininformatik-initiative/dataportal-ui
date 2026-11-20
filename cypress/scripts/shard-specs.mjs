// Splits the .feature files into CI shards of about equal run time and prints one shard as a
// comma-separated `--spec` list. Greedy: longest spec first, into the shard with the least time so far.
// Times (seconds) come from spec-durations.json, taken from a CI run; a spec without an entry counts
// DEFAULT_SECONDS. Refresh the file when a spec gets much slower or faster.
// Usage: node cypress/scripts/shard-specs.mjs <shard 1..total> <total>
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const DEFAULT_SECONDS = 30
const root = new URL('../..', import.meta.url).pathname
const durations = JSON.parse(readFileSync(new URL('spec-durations.json', import.meta.url), 'utf8'))
const [shard, total] = process.argv.slice(2).map(Number)
if (!(shard >= 1 && shard <= total)) {
  console.error('Usage: node cypress/scripts/shard-specs.mjs <shard 1..total> <total>')
  process.exit(1)
}

const specs = readdirSync(join(root, 'cypress/e2e'), { recursive: true })
  .filter((file) => file.endsWith('.feature'))
  .map((file) => relative(root, join(root, 'cypress/e2e', file)))
  .sort()
const seconds = (spec) => durations[spec] ?? DEFAULT_SECONDS

const shards = Array.from({ length: total }, () => ({ seconds: 0, specs: [] }))
for (const spec of [...specs].sort((a, b) => seconds(b) - seconds(a))) {
  const target = shards.reduce((min, s) => (s.seconds < min.seconds ? s : min))
  target.seconds += seconds(spec)
  target.specs.push(spec)
}
console.log(shards[shard - 1].specs.join(','))
