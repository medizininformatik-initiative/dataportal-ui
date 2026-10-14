import { defineStep } from '../defineStep'
import { numBulkSearch } from '../component-objects/NumBulkSearch'
import { t } from '../i18n'

/**
 * Steps for bulk search: enter codes, pick terminology and context, run, check counts, add
 * result.
 * */
export class BulkSearch {
  /**
   * Type codes into bulk search input.
   * */
  public enterCodes(codes: string) {
    numBulkSearch.enterCodes(codes)
  }

  /**
   * Select terminology system.
   * */
  public selectTerminology(system: string) {
    numBulkSearch.selectTerminology(system)
  }

  /**
   * Select context.
   * */
  public selectContext(context: string) {
    numBulkSearch.selectContext(context)
  }

  /**
   * Run bulk search.
   * */
  public search() {
    numBulkSearch.search()
  }

  /**
   * Assert search button enabled.
   * */
  public shouldHaveSearchButtonEnabled() {
    numBulkSearch.shouldHaveSearchButtonEnabled()
  }

  /**
   * Assert search button disabled.
   * */
  public shouldHaveSearchButtonDisabled() {
    numBulkSearch.shouldHaveSearchButtonDisabled()
  }

  /**
   * Assert found-codes count.
   * */
  public shouldShowFoundCount(count: number) {
    numBulkSearch.shouldShowFoundCount(count)
  }

  /**
   * Assert not-found-codes count.
   * */
  public shouldShowNotFoundCount(count: number) {
    numBulkSearch.shouldShowNotFoundCount(count)
  }

  /**
   * Assert result lists `code`.
   * */
  public shouldListCode(code: string) {
    numBulkSearch.shouldListCode(code)
  }

  /**
   * Add bulk search result to stage as one criterium.
   * */
  public addResultAsOneCriterium() {
    cy.contains('button', t('FEASIBILITY.BULK_SEARCH.ACTION_BAR.ADD_TO_STAGE')).click()
  }

  /**
   * Open cohort selection (stage) from bulk search.
   * */
  public viewCohortSelection() {
    cy.contains('button', t('FEASIBILITY.BULK_SEARCH.ACTION_BAR.VIEW_STAGE')).click()
  }
}

export const bulkSearch = new BulkSearch()

defineStep('I enter the bulk search codes {string}', (codes: string) =>
  bulkSearch.enterCodes(codes)
)
defineStep('I select the bulk search terminology {string}', (system: string) =>
  bulkSearch.selectTerminology(system)
)
defineStep('I select the bulk search context {string}', (context: string) =>
  bulkSearch.selectContext(context)
)
defineStep('I run the bulk search', () => bulkSearch.search())
defineStep('the bulk search button should be enabled', () =>
  bulkSearch.shouldHaveSearchButtonEnabled()
)
defineStep('the bulk search button should be disabled', () =>
  bulkSearch.shouldHaveSearchButtonDisabled()
)
defineStep('the bulk search should have found {int} codes', (count: number) =>
  bulkSearch.shouldShowFoundCount(count)
)
defineStep('the bulk search should not have found {int} codes', (count: number) =>
  bulkSearch.shouldShowNotFoundCount(count)
)
defineStep('the bulk search result should list the code {string}', (code: string) =>
  bulkSearch.shouldListCode(code)
)
defineStep('I add the bulk search result as one criterium', () =>
  bulkSearch.addResultAsOneCriterium()
)
defineStep('I view the cohort selection', () => bulkSearch.viewCohortSelection())
