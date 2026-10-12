// Lints .feature files. Rule `tags`: only the tag vocabulary below, on the right level, in order (TAGS).
// Rule `no-hardcoded-values`: a step in a Scenario may quote only a UI label
// (button, tab, list, page name - see UI_LABELS) or a <placeholder>. Test data - criteria, codes,
// concepts, dates, chip texts - belongs in an Examples cell (cypress/TESTING.md, "Data lives in Examples").
// Usage: node cypress/scripts/lint-features.mjs [files...]   (all features when no file is given)
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin'
import { IdGenerator } from '@cucumber/messages'

const root = new URL('../..', import.meta.url).pathname
const pages = [...readFileSync(join(root, 'cypress/e2e/Utilities/pages.ts'), 'utf8').matchAll(/= '([^']+)'/g)].map((m) => m[1])
const UI_LABELS = new Set([
  ...pages,
  'Close', 'Configure', 'Feasibility', 'Inclusion', 'Exclusion', 'Stage', 'Save cohort',
  'Edit cohort selection', 'Add to cohort selection', 'Add to Selection', 'Show Selection',
  'To Feature Selection', 'Data Definition', 'Selected Concepts', 'Single Search',
  'Selected Reference', 'Selected Filters', 'References', 'Part of', 'Only if referenced',
  'Details', 'Use as search term', 'Terminology Codes', 'Time restriction',
  // File name the roundtrip steps download to and read back: an artifact name, not test data.
  'roundtrip',
])

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
const scenariosOf = (children) => children.flatMap((c) => (c.rule ? scenariosOf(c.rule.children) : c.scenario ? [c.scenario] : []))

for (const file of files.length ? files : walk(join(root, 'cypress/e2e'))) {
  const { feature } = parser.parse(readFileSync(file, 'utf8'))
  if (!feature) continue
  const featureTags = checkTags(file, 'feature', feature.tags)
  const area = featureTags.find(([f]) => f === 'area' || f === 'cross-cutting')
  if (!area) report(file, feature.location.line, 'Feature needs one @area:<name> or @cross-cutting')
  const areaName = area?.[0] === 'cross-cutting' ? 'cross-cutting' : area?.[1]
  // A Background cannot use <placeholders>, so only scenarios are checked.
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
    for (const examples of scenario.examples) checkTags(file, 'examples', examples.tags)
    for (const step of scenario.steps) {
      for (const [, value] of step.text.matchAll(/"([^"]*)"/g)) {
        if (/^<[^>]+>$/.test(value) || UI_LABELS.has(value)) continue
        report(file, step.location.line, `hard-coded value "${value}" - move it to an Examples cell`)
      }
    }
  }
}
console.log(problems ? `\n${problems} problem(s)` : 'no problems')
process.exit(problems ? 1 : 0)
