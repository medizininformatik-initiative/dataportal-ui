// Feature coverage report: which app areas have E2E scenarios, based on @area:<name> tags.
// Features that span the whole app (login, navigation, ...) carry `@cross-cutting` and are not expected to map to one area.
// Areas are the folders in src/app/modules, except shared code (SHARED), which has no area of its own. Tag a Feature or Scenario with e.g. `@area:saved-queries`.
// Scenarios are grouped by their facet tags (see cypress/TESTING.md): area > component > behavior, plus filter/type/comparator.
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

const SHARED = ['query-editor', 'shared-filter']
const areas = readdirSync(join(root, 'src/app/modules')).filter(
  (d) => !SHARED.includes(d) && statSync(join(root, 'src/app/modules', d)).isDirectory()
)

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.feature') ? [p] : []
  })

const FACETS = ['area', 'component', 'behavior', 'filter', 'type', 'comparator']
const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher())
const scenariosByArea = Object.fromEntries(areas.map((a) => [a, []]))
const crossCutting = []
const untagged = []
const incomplete = []
const unknown = new Set()
const totals = Object.fromEntries(FACETS.map((f) => [f, {}]))

for (const file of walk(join(root, 'cypress/e2e'))) {
  const { feature } = parser.parse(readFileSync(file, 'utf8'))
  if (!feature) continue
  const featureTags = feature.tags.map((t) => t.name)
  const scenarios = feature.children.filter((c) => c.scenario).map((c) => c.scenario)
  for (const sc of scenarios) {
    const exampleTags = sc.examples.flatMap((e) => e.tags.map((t) => t.name))
    const tags = [...featureTags, ...sc.tags.map((t) => t.name), ...exampleTags]
    const facet = Object.fromEntries(
      FACETS.map((f) => [f, [...new Set(tags.filter((t) => t.startsWith(`@${f}:`)).map((t) => t.slice(f.length + 2)))]])
    )
    const label = `${relative(root, file)}: ${sc.name}`
    const isCrossCutting = tags.includes('@cross-cutting')
    if (!facet.area.length) (isCrossCutting ? crossCutting.push({ label, ...facet }) : untagged.push(label))
    if (!facet.component.length || !facet.behavior.length) incomplete.push(label)
    for (const f of FACETS) for (const v of facet[f]) totals[f][v] = (totals[f][v] ?? 0) + 1
    for (const a of facet.area) {
      if (scenariosByArea[a]) scenariosByArea[a].push({ label, ...facet })
      else unknown.add(a)
    }
  }
}

const count = (items, key) =>
  items.flatMap((i) => (i[key].length ? i[key] : ['(none)'])).reduce((m, v) => ({ ...m, [v]: (m[v] ?? 0) + 1 }), {})
const fmt = (m) => Object.entries(m).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).map(([k, n]) => `${k} (${n})`).join(', ')

const coveredCount = areas.filter((a) => scenariosByArea[a].length).length
const percent = Math.round((coveredCount / areas.length) * 100)

if (asJson) {
  console.log(JSON.stringify({ percent, areas: scenariosByArea, crossCutting, totals, untagged, incomplete, unknown: [...unknown] }, null, 2))
} else {
  console.log(`Area coverage: ${coveredCount}/${areas.length} (${percent}%)`)
  const printGroup = (name, items) => {
    console.log(`\n${items.length ? '✓' : '✗'} ${name} (${items.length} scenario(s))`)
    for (const c of Object.keys(count(items, 'component')).sort()) {
      const inC = items.filter((i) => (i.component.length ? i.component : ['(none)']).includes(c))
      console.log(`    ${c} (${inC.length})`)
      for (const b of Object.keys(count(inC, 'behavior')).sort()) {
        const inB = inC.filter((i) => (i.behavior.length ? i.behavior : ['(none)']).includes(b))
        const extra = ['filter', 'type', 'comparator']
          .map((f) => [f, Object.fromEntries(Object.entries(count(inB, f)).filter(([k]) => k !== '(none)'))])
          .filter(([, m]) => Object.keys(m).length)
          .map(([f, m]) => `${f}: ${fmt(m)}`)
        console.log(`        @behavior:${b} (${inB.length})${extra.length ? '  ' + extra.join(' | ') : ''}`)
        if (list) inB.forEach((i) => console.log(`            - ${i.label}`))
      }
    }
  }
  areas.forEach((a) => printGroup(a, scenariosByArea[a]))
  printGroup('cross-cutting', crossCutting)
  console.log('\nTotals per tag')
  for (const f of FACETS.slice(1)) console.log(`  ${f.padEnd(10)} ${fmt(totals[f])}`)
  if (unknown.size) console.log(`\nUnknown @area tags: ${[...unknown].join(', ')}`)
  console.log(`\nUntagged scenarios (no @area, not @cross-cutting): ${untagged.length}`)
  untagged.forEach((u) => console.log(`  - ${u}`))
  console.log(`Scenarios without @component or @behavior: ${incomplete.length}`)
  incomplete.forEach((u) => console.log(`  - ${u}`))
}
process.exit(percent < min ? 1 : 0)
