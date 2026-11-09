import { defineStep } from '../defineStep'
import { t } from '../i18n'

/**
 * What search shows when it finds nothing or answers slowly.
 * */
export class SearchResults {
  /**
   * Assert no-results placeholder names search term.
   * */
  public shouldShowNoResultsMessage(term: string) {
    cy.get('num-placeholder-box')
      .should('be.visible')
      .and('contain.text', t('FEASIBILITY.EDITOR.EMPTY').trim())
      .and('contain.text', term)
  }

  /**
   * Assert results table gets rows within `seconds`.
   * */
  public tableShouldShowResultsWithin(seconds: number) {
    cy.get('num-table tbody > tr', { timeout: seconds * 1000 }).should('have.length.greaterThan', 0)
  }
}

export const searchResults = new SearchResults()

defineStep('I should see the no-results message for {string}', (term: string) =>
  searchResults.shouldShowNoResultsMessage(term)
)
defineStep('the table should show results within {int} seconds', (seconds: number) =>
  searchResults.tableShouldShowResultsWithin(seconds)
)
