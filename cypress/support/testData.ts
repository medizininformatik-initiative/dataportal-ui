import criteria from '../test-data/criteria.json'
import bulkSearch from '../test-data/bulk-search.json'
import dataSelection from '../test-data/data-selection.json'
import featureData from '../test-data/feature-data.json'
import files from '../test-data/files.json'
import pages from '../test-data/pages.json'
import uiLabels from '../test-data/ui-labels.json'

/**
 * Named test data for feature files. A step argument may contain `{{path.to.value}}`
 * (e.g. `{{concepts.second}}`), which `resolve()` replaces with the value from
 * `cypress/test-data/*.json`. Changing a code there changes every scenario that uses the
 * placeholder; text without a placeholder passes through untouched.
 */
// Each file holds top-level groups; the group name is the first segment of the placeholder.
const TEST_DATA: Record<string, unknown> = {
  ...criteria,
  ...bulkSearch,
  ...dataSelection,
  ...featureData,
  ...files,
  ...pages,
  ...uiLabels,
}

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
