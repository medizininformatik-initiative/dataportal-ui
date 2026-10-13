import { DataTable } from '@badeball/cypress-cucumber-preprocessor'
import { defineStep } from '../defineStep'
import { numConceptFilter } from '../component-objects/NumConceptFilter'
import { resolve } from '../testData'

/**
 * The concept editor (attribute filter / value filter). Assertions on
 * "the selected concepts" go through the Selected tab's list only; "checked in
 * the search results" assertions go through the search table. Keeping those two
 * apart is what lets a failing scenario say whether the selection state or its
 * rendering is wrong.
 *
 * Tables: a one-column table lists codes; a table with a header row
 * (`| code | system |`) is asserted column by column. Unscoped methods act on the
 * only concept editor on screen; the `filter` variants scope to one named concept
 * attribute (criteria with several concept filters).
 */
export class ConceptFilter {
  private codesOf(table: DataTable): string[] {
    const rows = table.raw()
    const hasHeader = rows[0]?.[0] === 'code'
    return (hasHeader ? rows.slice(1) : rows).map((row) => resolve(row[0]))
  }

  public openTab(tab: string, filter?: string) {
    numConceptFilter.openTab(tab, filter)
  }

  public tabShouldBeDisabled(tab: string) {
    numConceptFilter.tabShouldBeDisabled(tab)
  }

  public tabShouldShowCount(tab: string, count: number) {
    numConceptFilter.tabShouldShowCount(tab, count)
  }

  public search(term: string) {
    numConceptFilter.search(term)
  }

  public clearSearch() {
    numConceptFilter.clearSearch()
  }

  public toggleInSystem(code: string, system: string) {
    numConceptFilter.toggleResultInSystem(resolve(code), system)
  }

  public selectViaSearch(code: string, system: string) {
    numConceptFilter.openTab('Single Search')
    numConceptFilter.search(resolve(code))
    numConceptFilter.toggleResultInSystem(resolve(code), system)
  }

  public shouldBeCheckedInSystem(code: string, system: string, checked: boolean) {
    numConceptFilter.resultInSystemShouldBeChecked(resolve(code), system, checked)
  }

  public toggle(code: string) {
    numConceptFilter.toggleResult(resolve(code))
  }

  public shouldBeChecked(code: string, checked: boolean) {
    numConceptFilter.resultShouldBeChecked(resolve(code), checked)
  }

  public selectCodes(table: DataTable, filter?: string) {
    numConceptFilter.selectCodes(this.codesOf(table), filter)
  }

  public removeSelected(code: string) {
    numConceptFilter.removeSelected(resolve(code))
  }

  public removeSelectedInFilter(code: string, filter: string) {
    numConceptFilter.openTab('Selected Concepts', filter)
    numConceptFilter.removeSelected(resolve(code), filter)
  }

  public selectedShouldHaveCount(count: number, filter?: string) {
    numConceptFilter.selectedShouldHaveCount(count, filter)
  }

  public selectedShouldContain(code: string, contained: boolean) {
    numConceptFilter.selectedShouldContain(resolve(code), contained)
  }

  // Asserts the exact set of selected concepts (order-independent) via the Selected tab.
  public selectedShouldBe(table: DataTable, filter?: string) {
    const codes = this.codesOf(table)
    numConceptFilter.openTab('Selected Concepts', filter)
    numConceptFilter.selectedShouldHaveCount(codes.length, filter)
    codes.forEach((code) => numConceptFilter.selectedShouldContain(code, true, filter))
  }

  public resultsTableShouldScroll() {
    cy.get('num-concept-filter-table').should(($el) => {
      const overflowY = getComputedStyle($el[0]).overflowY
      expect(['auto', 'scroll']).to.include(overflowY)
    })
  }

  // Multi-attribute helpers (criteria with several concept filters, e.g. the "Fall" profile,
  // see cypress/TEST_DATA.md). The filters and codes come from the scenario's data table,
  // so they can be swapped in an Examples block; nothing is hard-coded here.
  // Each attribute filter picks its concept from its own value set.
  //   | attribute filter  | concept |
  //   | Type of encounter | konsil  |
  public selectOneConceptPerAttributeFilter(table: DataTable) {
    table
      .hashes()
      .forEach((row) =>
        numConceptFilter.selectCodes([resolve(row.concept)], resolve(row['attribute filter']))
      )
  }

  public eachAttributeFilterShouldHaveSelected(count: number, table: DataTable) {
    table.hashes().forEach((row) => {
      numConceptFilter.openTab('Selected Concepts', resolve(row['attribute filter']))
      numConceptFilter.selectedShouldHaveCount(count, resolve(row['attribute filter']))
    })
  }
}

export const conceptFilter = new ConceptFilter()

defineStep('I open the concept filter tab {string}', (tab: string) => conceptFilter.openTab(tab))
defineStep(
  'I open the concept filter tab {string} of the filter {string}',
  (tab: string, filter: string) => conceptFilter.openTab(tab, filter)
)
defineStep('the concept filter tab {string} is disabled', (tab: string) =>
  conceptFilter.tabShouldBeDisabled(tab)
)
defineStep('the concept filter tab {string} shows the count {int}', (tab: string, count: number) =>
  conceptFilter.tabShouldShowCount(tab, count)
)

defineStep('I search for the concept {string}', (term: string) => conceptFilter.search(term))
defineStep('I select the concept {string} with system {string}', (code: string, system: string) =>
  conceptFilter.toggleInSystem(code, system)
)
defineStep(
  'I have selected the concept {string} with system {string}',
  (code: string, system: string) => conceptFilter.selectViaSearch(code, system)
)
defineStep(
  'the concept {string} with system {string} is checked in the search results',
  (code: string, system: string) => conceptFilter.shouldBeCheckedInSystem(code, system, true)
)
defineStep(
  'the concept {string} with system {string} is not checked in the search results',
  (code: string, system: string) => conceptFilter.shouldBeCheckedInSystem(code, system, false)
)
defineStep('I clear the concept search', () => conceptFilter.clearSearch())
defineStep('I select the concept {string}', (code: string) => conceptFilter.toggle(code))
defineStep('I deselect the concept {string}', (code: string) => conceptFilter.toggle(code))

defineStep('I have selected the concepts:', (table: DataTable) => conceptFilter.selectCodes(table))
defineStep(
  'I have selected the concepts in the filter {string}:',
  (filter: string, table: DataTable) => conceptFilter.selectCodes(table, filter)
)

defineStep('the concept {string} is checked in the search results', (code: string) =>
  conceptFilter.shouldBeChecked(code, true)
)
defineStep('the concept {string} is not checked in the search results', (code: string) =>
  conceptFilter.shouldBeChecked(code, false)
)

defineStep('I remove the concept {string} from the selected concepts list', (code: string) =>
  conceptFilter.removeSelected(code)
)
defineStep(
  'I remove the concept {string} from the selected concepts of the filter {string}',
  (code: string, filter: string) => conceptFilter.removeSelectedInFilter(code, filter)
)

defineStep('the selected concepts list has {int} entr(y)(ies)', (count: number) =>
  conceptFilter.selectedShouldHaveCount(count)
)
defineStep('the selected concepts list is empty', () => conceptFilter.selectedShouldHaveCount(0))
defineStep('the selected concepts list contains {string}', (code: string) =>
  conceptFilter.selectedShouldContain(code, true)
)
defineStep('the selected concepts list does not contain {string}', (code: string) =>
  conceptFilter.selectedShouldContain(code, false)
)

defineStep('the selected concepts are:', (table: DataTable) =>
  conceptFilter.selectedShouldBe(table)
)
defineStep(
  'the selected concepts in the filter {string} are:',
  (filter: string, table: DataTable) => conceptFilter.selectedShouldBe(table, filter)
)
defineStep('the filter {string} has no selected concepts', (filter: string) =>
  conceptFilter.selectedShouldHaveCount(0, filter)
)

defineStep('the concept results table is scrollable within the editor', () =>
  conceptFilter.resultsTableShouldScroll()
)

defineStep(
  'I have selected one concept from the value set of each of these attribute filters:',
  (table: DataTable) => conceptFilter.selectOneConceptPerAttributeFilter(table)
)
defineStep(
  'each of these attribute filters has {int} selected concept:',
  (count: number, table: DataTable) =>
    conceptFilter.eachAttributeFilterShouldHaveSelected(count, table)
)
