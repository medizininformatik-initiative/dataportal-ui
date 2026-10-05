import { DataTable, defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numConceptFilter } from '../component-objects/NumConceptFilter'
import { resolve } from '../testData'

/**
 * Steps for the concept editor (attribute filter / value filter). Assertions on
 * "the selected concepts" go through the Selected tab's list only; "checked in
 * the search results" assertions go through the search table. Keeping those two
 * apart is what lets a failing scenario say whether the selection state or its
 * rendering is wrong.
 *
 * Tables: a one-column table lists codes; a table with a header row
 * (`| code | system |`) is asserted column by column. Unscoped steps act on the
 * only concept editor on screen; the `of/in the filter {string}` variants scope
 * to one named concept attribute (criteria with several concept filters).
 */
const codesOf = (table: DataTable): string[] => {
  const rows = table.raw()
  const hasHeader = rows[0]?.[0] === 'code'
  return (hasHeader ? rows.slice(1) : rows).map((row) => resolve(row[0]))
}

defineStep('I open the concept filter tab {string}', (tab: string) => numConceptFilter.openTab(tab))
defineStep(
  'I open the concept filter tab {string} of the filter {string}',
  (tab: string, filter: string) => numConceptFilter.openTab(tab, filter)
)
defineStep('the concept filter tab {string} is disabled', (tab: string) =>
  numConceptFilter.tabShouldBeDisabled(tab)
)
defineStep('the concept filter tab {string} shows the count {int}', (tab: string, count: number) =>
  numConceptFilter.tabShouldShowCount(tab, count)
)

defineStep('I search for the concept {string}', (term: string) => numConceptFilter.search(term))
defineStep('I clear the concept search', () => numConceptFilter.clearSearch())
defineStep('I select the concept {string}', (code: string) =>
  numConceptFilter.toggleResult(resolve(code))
)
defineStep('I deselect the concept {string}', (code: string) =>
  numConceptFilter.toggleResult(resolve(code))
)

defineStep('I have selected the concepts:', (table: DataTable) =>
  numConceptFilter.selectCodes(codesOf(table))
)
defineStep(
  'I have selected the concepts in the filter {string}:',
  (filter: string, table: DataTable) => numConceptFilter.selectCodes(codesOf(table), filter)
)

defineStep('the concept {string} is checked in the search results', (code: string) =>
  numConceptFilter.resultShouldBeChecked(resolve(code), true)
)
defineStep('the concept {string} is not checked in the search results', (code: string) =>
  numConceptFilter.resultShouldBeChecked(resolve(code), false)
)

defineStep('I remove the concept {string} from the selected concepts list', (code: string) =>
  numConceptFilter.removeSelected(resolve(code))
)
defineStep(
  'I remove the concept {string} from the selected concepts of the filter {string}',
  (code: string, filter: string) => {
    numConceptFilter.openTab('Selected Concepts', filter)
    numConceptFilter.removeSelected(resolve(code), filter)
  }
)

defineStep('the selected concepts list has {int} entr(y)(ies)', (count: number) =>
  numConceptFilter.selectedShouldHaveCount(count)
)
defineStep('the selected concepts list is empty', () => numConceptFilter.selectedShouldHaveCount(0))
defineStep('the selected concepts list contains {string}', (code: string) =>
  numConceptFilter.selectedShouldContain(resolve(code), true)
)
defineStep('the selected concepts list does not contain {string}', (code: string) =>
  numConceptFilter.selectedShouldContain(resolve(code), false)
)

// Asserts the exact set of selected concepts (order-independent) via the Selected tab.
defineStep('the selected concepts are:', (table: DataTable) => {
  const codes = codesOf(table)
  numConceptFilter.openTab('Selected Concepts')
  numConceptFilter.selectedShouldHaveCount(codes.length)
  codes.forEach((code) => numConceptFilter.selectedShouldContain(code, true))
})
defineStep(
  'the selected concepts in the filter {string} are:',
  (filter: string, table: DataTable) => {
    const codes = codesOf(table)
    numConceptFilter.openTab('Selected Concepts', filter)
    numConceptFilter.selectedShouldHaveCount(codes.length, filter)
    codes.forEach((code) => numConceptFilter.selectedShouldContain(code, true, filter))
  }
)
defineStep('the filter {string} has no selected concepts', (filter: string) =>
  numConceptFilter.selectedShouldHaveCount(0, filter)
)

defineStep('the concept results table is scrollable within the editor', () => {
  cy.get('num-concept-filter-table').should(($el) => {
    const overflowY = getComputedStyle($el[0]).overflowY
    expect(['auto', 'scroll']).to.include(overflowY)
  })
})

// Multi-attribute helpers (criteria with several concept filters, e.g. the "Fall" profile,
// see cypress/TEST_DATA.md). The filters and codes come from the scenario's data table,
// so they can be swapped in an Examples block; nothing is hard-coded here.
//   | filter            | code   |
//   | Type of encounter | konsil |
defineStep(
  'I have selected one concept in each of these concept filters:',
  (table: DataTable) => {
    table
      .hashes()
      .forEach((row) => numConceptFilter.selectCodes([resolve(row.code)], resolve(row.filter)))
  }
)
defineStep(
  'each of these concept filters has {int} selected concept:',
  (count: number, table: DataTable) => {
    table.hashes().forEach((row) => {
      numConceptFilter.openTab('Selected Concepts', resolve(row.filter))
      numConceptFilter.selectedShouldHaveCount(count, resolve(row.filter))
    })
  }
)
