import criteria from '../test-data/criteria.json'
import bulkSearch from '../test-data/bulk-search.json'
import dataSelection from '../test-data/data-selection.json'
import featureData from '../test-data/feature-data.json'
import files from '../test-data/files.json'
import pages from '../test-data/pages.json'
import uiLabels from '../test-data/ui-labels.json'

/**
 * Named test data for feature files. Step argument may hold `{{path.to.value}}` (e.g.
 * `{{concepts.second}}`): `resolve()` replaces it with value from `cypress/test-data/*.json`.
 * Changing code there changes every scenario using placeholder. Text without placeholder
 * passes through untouched.
 * */
/**
 * Each file holds top-level groups. Group name = first segment of placeholder.
 * */
const TEST_DATA: Record<string, unknown> = {
  ...criteria,
  ...bulkSearch,
  ...dataSelection,
  ...featureData,
  ...files,
  ...pages,
  ...uiLabels,
}

/**
 * Replace every `{{path}}` placeholder in text with test data value.
 * */
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
