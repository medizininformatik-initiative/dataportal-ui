// Feature coverage report: which app areas have E2E scenarios, based on @area:<name> tags.
// Features that span the whole app (login, navigation, ...) carry `@cross-cutting` and are not expected to map to one area.
// Areas are the folders in src/app/modules. Tag a Feature or Scenario with e.g. `@area:saved-queries`.
// Usage: node cypress/scripts/feature-coverage.mjs [--json] [--list] [--min=<percent>]
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin'
import { IdGenerator } from '@cucumber/messages'

const root = new URL('../..', import.meta.url).pathname
const args = process.argv.slice(2)
const asJson = args.includes('--json')
const list = args.includes('--list')
const min = Number(args.find((a) => a.startsWith('--min='))?.split('=')[1] ?? 0)

const areas = readdirSync(join(root, 'src/app/modules')).filter((d) =>
  statSync(join(root, 'src/app/modules', d)).isDirectory()
)

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.feature') ? [p] : []
  })

const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher())
const covered = Object.fromEntries(areas.map((a) => [a, []]))
const untagged = []
const unknown = new Set()

for (const file of walk(join(root, 'cypress/e2e'))) {
  const { feature } = parser.parse(readFileSync(file, 'utf8'))
  if (!feature) continue
  const featureTags = feature.tags.map((t) => t.name)
  const scenarios = feature.children.filter((c) => c.scenario).map((c) => c.scenario)
  for (const sc of scenarios) {
    const tags = [...featureTags, ...sc.tags.map((t) => t.name)]
    const tagged = tags.filter((t) => t.startsWith('@area:')).map((t) => t.slice(6))
    const label = `${relative(root, file)}: ${sc.name}`
    if (!tagged.length && !tags.includes('@cross-cutting')) untagged.push(label)
    for (const a of tagged) {
      if (covered[a]) covered[a].push(label)
      else unknown.add(a)
    }
  }
}

const coveredCount = areas.filter((a) => covered[a].length).length
const percent = Math.round((coveredCount / areas.length) * 100)

if (asJson) {
  console.log(JSON.stringify({ percent, covered, untagged, unknown: [...unknown] }, null, 2))
} else {
  console.log(`Area coverage: ${coveredCount}/${areas.length} (${percent}%)\n`)
  for (const a of areas) {
    console.log(`${covered[a].length ? '✓' : '✗'} ${a.padEnd(20)} ${covered[a].length} scenario(s)`)
    if (list) covered[a].forEach((s) => console.log(`    - ${s}`))
  }
  if (unknown.size) console.log(`\nUnknown @area tags: ${[...unknown].join(', ')}`)
  console.log(`\nUntagged scenarios: ${untagged.length}`)
  untagged.forEach((u) => console.log(`  - ${u}`))
}
process.exit(percent < min ? 1 : 0)
