import { t } from '../i18n'
import { numTable } from './NumTable'

const INPUT = 'num-bulk-search-input'

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Query/interaction helper for the bulk search page (`num-bulk-search-input` +
 * `num-bulk-search-results`). Its "Search" button is not part of `num-action-bar`,
 * so the generic `the button {string} should be ...` steps cannot reach it.
 *
 * The code box is an empty `<textarea>` and is matched by tag within its host
 * component rather than by a new `data-cy` attribute, to keep this change inside
 * `cypress/`. The terminology dropdown is Angular Material's `mat-select`, found
 * by its placeholder text; its options are matched by system name followed by the
 * `(count)` the app appends, so "ICD-10-GM" cannot match a longer system name.
 */
export class NumBulkSearch {
  public enterCodes(codes: string) {
    cy.get(`${INPUT} textarea`)
      .clear()
      .type(codes, { parseSpecialCharSequences: false })
      .should('have.value', codes)
  }

  public selectTerminology(system: string) {
    this.selectFilterOption(t('SHARED_COMPONENTS.FILTER.TERMINOLOGY'), system)
  }

  public selectContext(context: string) {
    this.selectFilterOption(t('SHARED_COMPONENTS.FILTER.CONTEXT'), context)
  }

  private selectFilterOption(placeholder: string, optionName: string) {
    cy.get(INPUT).contains('mat-select', placeholder).click()
    cy.get('.mat-mdc-option')
      .contains(new RegExp(`^\\s*${escapeRegex(optionName)}\\s*\\(`))
      .click()
  }

  private searchButton() {
    return cy.get(INPUT).contains('button', t('FEASIBILITY.SEARCH.SEARCH_BUTTON'))
  }

  public shouldHaveSearchButtonEnabled() {
    this.searchButton().should('not.be.disabled')
  }

  public shouldHaveSearchButtonDisabled() {
    this.searchButton().should('be.disabled')
  }

  public search() {
    this.searchButton().click()
  }

  public shouldShowFoundCount(count: number) {
    cy.contains('[role="tab"]', t('SHARED_FILTER.CONCEPT_FILTER.BULK.FOUND', { count })).should(
      'exist'
    )
  }

  public shouldShowNotFoundCount(count: number) {
    cy.contains('[role="tab"]', t('SHARED_FILTER.CONCEPT_FILTER.BULK.NOTFOUND', { count })).should(
      'exist'
    )
  }

  public shouldListCode(code: string) {
    numTable.shouldContainRow(code)
  }
}

export const numBulkSearch = new NumBulkSearch()
