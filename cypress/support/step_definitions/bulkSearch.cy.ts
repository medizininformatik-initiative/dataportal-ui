import { defineStep } from '../defineStep'
import { numBulkSearch } from '../component-objects/NumBulkSearch'
import { t } from '../i18n'

export class BulkSearch {
  public enterCodes(codes: string) {
    numBulkSearch.enterCodes(codes)
  }

  public selectTerminology(system: string) {
    numBulkSearch.selectTerminology(system)
  }

  public selectContext(context: string) {
    numBulkSearch.selectContext(context)
  }

  public search() {
    numBulkSearch.search()
  }

  public shouldHaveSearchButtonEnabled() {
    numBulkSearch.shouldHaveSearchButtonEnabled()
  }

  public shouldHaveSearchButtonDisabled() {
    numBulkSearch.shouldHaveSearchButtonDisabled()
  }

  public shouldShowFoundCount(count: number) {
    numBulkSearch.shouldShowFoundCount(count)
  }

  public shouldShowNotFoundCount(count: number) {
    numBulkSearch.shouldShowNotFoundCount(count)
  }

  public shouldListCode(code: string) {
    numBulkSearch.shouldListCode(code)
  }

  public addResultAsOneCriterium() {
    cy.contains('button', t('FEASIBILITY.BULK_SEARCH.ACTION_BAR.ADD_TO_STAGE')).click()
  }

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
