import testData from './test-data/concepts.json'

/**
 * Named test data for feature files. A step argument may contain `{{path.to.value}}`
 * (e.g. `{{concepts.second}}`), which `resolve()` replaces with the value from
 * `test-data/*.json`. Changing a code there changes every scenario that uses the
 * placeholder; text without a placeholder passes through untouched.
 */
const TEST_DATA: Record<string, unknown> = testData

export function resolve(text: string): string {
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    const value = path
      .split('.')
      .reduce<unknown>(
        (node, key) => (node as Record<string, unknown> | undefined)?.[key],
        TEST_DATA
      )
    if (typeof value !== 'string') {
      throw new Error(`No test data for placeholder "{{${path}}}"`)
    }
    return value
  })
}
