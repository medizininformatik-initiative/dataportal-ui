import { t } from '../i18n'
import { numTable } from './NumTable'

const INPUT = 'num-bulk-search-input'

/**
 * Escape regex special characters in text.
 * */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Query and interaction helper for bulk search page (`num-bulk-search-input` +
 * `num-bulk-search-results`). Its "Search" button is not part of `num-action-bar`: generic
 * button-state steps cannot reach it. Code box is empty `<textarea>`,
 * matched by tag inside host component, no new `data-cy`, keeping change inside `cypress/`.
 * Terminology dropdown is Material `mat-select`, found by placeholder text. Options match
 * system name plus `(count)` app appends: "ICD-10-GM" cannot match longer system name.
 * */
export class NumBulkSearch {
  /**
   * Type codes into code textarea.
   * */
  public enterCodes(codes: string) {
    cy.get(`${INPUT} textarea`)
      .clear()
      .type(codes, { parseSpecialCharSequences: false })
      .should('have.value', codes)
  }

  /**
   * Pick terminology system in dropdown.
   * */
  public selectTerminology(system: string) {
    this.selectFilterOption(t('SHARED_COMPONENTS.FILTER.TERMINOLOGY'), system)
  }

  /**
   * Pick context in dropdown.
   * */
  public selectContext(context: string) {
    this.selectFilterOption(t('SHARED_COMPONENTS.FILTER.CONTEXT'), context)
  }

  /**
   * Open filter dropdown by placeholder, click option by name.
   * */
  private selectFilterOption(placeholder: string, optionName: string) {
    cy.get(INPUT).contains('mat-select', placeholder).click()
    cy.get('.mat-mdc-option')
      .contains(new RegExp(`^\\s*${escapeRegex(optionName)}\\s*\\(`))
      .click()
  }

  /**
   * Find bulk search "Search" button.
   * */
  private searchButton() {
    return cy.get(INPUT).contains('button', t('FEASIBILITY.SEARCH.SEARCH_BUTTON'))
  }

  /**
   * Assert search button enabled.
   * */
  public shouldHaveSearchButtonEnabled() {
    this.searchButton().should('not.be.disabled')
  }

  /**
   * Assert search button disabled.
   * */
  public shouldHaveSearchButtonDisabled() {
    this.searchButton().should('be.disabled')
  }

  /**
   * Click search button.
   * */
  public search() {
    this.searchButton().click()
  }

  /**
   * Assert found-codes count.
   * */
  public shouldShowFoundCount(count: number) {
    cy.contains('[role="tab"]', t('SHARED_FILTER.CONCEPT_FILTER.BULK.FOUND', { count })).should(
      'exist'
    )
  }

  /**
   * Assert not-found-codes count.
   * */
  public shouldShowNotFoundCount(count: number) {
    cy.contains('[role="tab"]', t('SHARED_FILTER.CONCEPT_FILTER.BULK.NOTFOUND', { count })).should(
      'exist'
    )
  }

  /**
   * Assert result table lists `code`.
   * */
  public shouldListCode(code: string) {
    numTable.shouldContainRow(code)
  }
}

export const numBulkSearch = new NumBulkSearch()
