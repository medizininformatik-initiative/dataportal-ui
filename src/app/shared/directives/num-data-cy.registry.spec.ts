import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { FIXED_HOOKS } from '../../../../cypress/support/dataCy'

const htmlFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []
  )

const html = htmlFiles(join(__dirname, '../..'))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')
const used = new Set(
  [...html.matchAll(/(?<!\[)numDataCy="([^"]+)"/g), ...html.matchAll(/\[(?:numDataCy|attr\.data-cy)\]="'([^']+)'"/g)].map((m) => m[1])
)

describe('data-cy registry (cypress/support/dataCy.ts)', () => {
  it('lists every fixed hook used in templates', () => {
    expect([...used].filter((v) => !(FIXED_HOOKS as readonly string[]).includes(v))).toEqual([])
  })

  it('lists no hook that no template uses', () => {
    expect(FIXED_HOOKS.filter((h) => !used.has(h))).toEqual([])
  })
})
