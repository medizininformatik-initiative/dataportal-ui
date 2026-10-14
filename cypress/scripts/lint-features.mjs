// Lints .feature files. Rule `tags`: only the tag vocabulary below, on the right level, in order (TAGS).
// Rule `no-hardcoded-values`: a step in a Scenario or Background may quote only a <placeholder> or a
// {{group.key}} test-data placeholder (page names: {{pages.*}}, UI labels: {{labels.*}}) that exists in
// cypress/test-data/*.json. Every `pages` value must be a Page enum value (pages.ts).
// Single- and double-quoted strings, DocStrings and data-table cells are checked. Test data - criteria, codes,
// concepts, dates, chip texts - belongs in an Examples cell (cypress/TESTING.md, "Data lives in Examples").
// Rule `examples-data`: an Examples cell is a number, a `case`/`comparator`/`block` token or a {{placeholder}}.
// Rule `area-module`: `@area:<x>` must name a folder src/app/modules/<x>.
// Usage: node cypress/scripts/lint-features.mjs [files...]   (all features when no file is given)
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin'
import { IdGenerator } from '@cucumber/messages'

const root = new URL('../..', import.meta.url).pathname
const dataDir = join(root, 'cypress/test-data')
const testData = Object.assign(
  {},
  ...readdirSync(dataDir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(dataDir, f), 'utf8')))
)
const pageEnum = [...readFileSync(join(root, 'cypress/e2e/Utilities/pages.ts'), 'utf8').matchAll(/= '([^']+)'/g)].map((m) => m[1])
const lookup = (path) => path.split('.').reduce((node, key) => node?.[key], testData)

// Tag vocabulary (cypress/TESTING.md, "Tags"). A new value is added here and to that table, in the
// same change. `@component:` is the screen under test (a page), not a UI widget: it must belong to
// the Feature's `@area:`; the cross-cutting ones sit under `@cross-cutting`.
const COMPONENTS = {
  'feasibility-query': ['criteria-search', 'criteria-bulk-search', 'feasibility-editor', 'criterion-editor', 'feasibility-result'],
  'data-selection': ['data-selection-search', 'data-selection-editor', 'data-selection-feature-editor'],
  'data-query': ['cohort-definition', 'crtdl', 'upload'],
  'saved-queries': ['saved-queries'],
  'cross-cutting': ['action-bar', 'language', 'navigation', 'login', 'session', 'user-menu'],
}
const VALUES = {
  area: Object.keys(COMPONENTS).filter((a) => a !== 'cross-cutting'),
  component: Object.values(COMPONENTS).flat(),
  behavior: [
    'add', 'advance', 'apply', 'close', 'collapse', 'create-cohort', 'delete', 'display', 'download', 'duplicate',
    'edit-filter', 'edit-termcodes', 'exclude', 'expand', 'hide-file-actions', 'isolate', 'load', 'login', 'logout',
    'mandatory-filter', 'move', 'navigate', 'offer-comparators', 'open', 'open-about', 'open-log', 'open-menu',
    'parse', 'persist', 'redirect-to-login', 'reject-invalid-dates', 'reject-invalid-file', 'reject-invalid-range',
    'remove', 'report-backend-error', 'report-not-found', 'roundtrip', 'save', 'scroll', 'search', 'select',
    'select-all', 'show', 'show-chips', 'show-empty-state', 'show-file-actions', 'switch', 'sync-ui',
    'toggle-only-if-referenced', 'tolerate-slow-backend', 'update-chip', 'upload', 'use-as-search-term', 'validate',
  ],
  filter: ['value-filter', 'attribute-filter', 'time-restriction', 'none'],
  type: ['concept', 'quantity-comparator', 'quantity-range', 'reference', 'date', 'token'],
  comparator: ['gt', 'ge', 'lt', 'le', 'eq', 'ne', 'before', 'after', 'at', 'between'],
}
// Where each facet may sit; the scenario facets must also appear in this order.
const LEVELS = {
  feature: ['area', 'cross-cutting', 'pending'],
  scenario: ['component', 'behavior', 'filter', 'type', 'comparator', 'pending'],
  examples: ['comparator', 'pending', 'doc-collapse'],
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.feature') ? [join(dir, e.name)] : []
  )
const files = process.argv.slice(2).filter((a) => a.endsWith('.feature'))
const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher())

let problems = 0
const report = (file, line, msg) => {
  problems++
  console.log(`${relative(root, file)}:${line}  ${msg}`)
}
const checkTags = (file, level, tags) => {
  const seen = new Set()
  let last = -1
  for (const { name, location } of tags) {
    const [, facet, value] = name.match(/^@([a-z-]+)(?::(.+))?$/) ?? []
    if (facet === 'area' && value !== undefined && !existsSync(join(root, 'src/app/modules', value))) {
      report(file, location.line, `@area:${value} has no module folder src/app/modules/${value}`)
    }
    if (!LEVELS[level].includes(facet)) {
      report(file, location.line, `tag ${name} not allowed on a ${level} (allowed: ${LEVELS[level].map((f) => '@' + f).join(' ')})`)
    } else if (value !== undefined && !VALUES[facet]?.includes(value)) {
      report(file, location.line, `unknown tag ${name} - reuse one of: ${VALUES[facet]?.join(' ')}; or add it to VALUES and cypress/TESTING.md`)
    } else if (seen.has(name)) {
      report(file, location.line, `duplicate tag ${name}`)
    }
    seen.add(name)
    const rank = LEVELS.scenario.indexOf(facet)
    if (level === 'scenario' && rank >= 0) {
      if (rank < last) report(file, location.line, `tag ${name} out of order (${LEVELS.scenario.map((f) => '@' + f).join(' ')})`)
      last = Math.max(last, rank)
    }
  }
  return [...seen].map((n) => n.slice(1).split(':'))
}
// A data table's first row is its header (column names), not data.
// A value is data unless it is a <placeholder> or a {{group.key}} placeholder found in cypress/test-data/*.json.
const isAllowed = (v) => /^<[^>]+>$/.test(v) || (/^\{\{[\w.]+\}\}$/.test(v) && typeof lookup(v.slice(2, -2)) === 'string')
const checkStep = (file, step) => {
  const values = [...step.text.matchAll(/"([^"]*)"|'([^']*)'/g)].map((m) => m[1] ?? m[2])
  if (step.docString) values.push(step.docString.content)
  for (const row of (step.dataTable?.rows ?? []).slice(1)) values.push(...row.cells.map((c) => c.value))
  for (const value of values) {
    if (!isAllowed(value)) report(file, step.location.line, `hard-coded value "${value}" - move it to an Examples cell or a {{group.key}} placeholder`)
  }
}
// Examples cells: a number, a token of LITERAL_COLUMNS or a {{group.key}} placeholder; no free text.
const LITERAL_COLUMNS = new Set(['case', 'comparator', 'block'])
const checkExamples = (file, examples) => {
  const cols = examples.tableHeader?.cells.map((c) => c.value) ?? []
  for (const row of examples.tableBody) {
    row.cells.forEach(({ value, location }, i) => {
      if (value === '' || LITERAL_COLUMNS.has(cols[i]) || /^-?\d+([.,]\d+)?$/.test(value) || isAllowed(value)) return
      report(file, location.line, `hard-coded Examples value "${value}" (column ${cols[i]}) - move it to cypress/test-data/*.json`)
    })
  }
}
const scenariosOf = (children) => children.flatMap((c) => (c.rule ? scenariosOf(c.rule.children) : c.scenario ? [c.scenario] : []))

for (const file of files.length ? files : walk(join(root, 'cypress/e2e'))) {
  const { feature } = parser.parse(readFileSync(file, 'utf8'))
  if (!feature) continue
  const featureTags = checkTags(file, 'feature', feature.tags)
  const area = featureTags.find(([f]) => f === 'area' || f === 'cross-cutting')
  if (!area) report(file, feature.location.line, 'Feature needs one @area:<name> or @cross-cutting')
  const areaName = area?.[0] === 'cross-cutting' ? 'cross-cutting' : area?.[1]
  const background = feature.children.find((c) => c.background)?.background
  for (const step of background?.steps ?? []) checkStep(file, step)
  for (const scenario of scenariosOf(feature.children)) {
    const tags = checkTags(file, 'scenario', scenario.tags)
    const values = (facet) => tags.filter(([f]) => f === facet).map(([, v]) => v)
    const [component] = values('component')
    if (values('component').length !== 1) report(file, scenario.location.line, 'Scenario needs exactly one @component:<name>')
    else if (areaName && !COMPONENTS[areaName]?.includes(component)) {
      report(file, scenario.location.line, `@component:${component} does not belong to ${area.join(':')} (its components: ${COMPONENTS[areaName]?.join(' ')})`)
    }
    if (!values('behavior').length) report(file, scenario.location.line, 'Scenario needs at least one @behavior:<verb>')
    if (values('type').length && !values('filter').length) report(file, scenario.location.line, '@type needs a @filter')
    for (const examples of scenario.examples) {
      checkTags(file, 'examples', examples.tags)
      checkExamples(file, examples)
    }
    for (const step of scenario.steps) checkStep(file, step)
  }
}
for (const [key, name] of Object.entries(testData.pages ?? {})) {
  if (!pageEnum.includes(name)) report(join(root, 'cypress/test-data/*.json'), 1, `pages.${key} "${name}" is not a Page in cypress/e2e/Utilities/pages.ts`)
}
console.log(problems ? `\n${problems} problem(s)` : 'no problems')
process.exit(problems ? 1 : 0)
