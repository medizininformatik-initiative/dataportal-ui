import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { t } from '../i18n'

/** Steps for what a search shows when it finds nothing, or answers slowly. */
defineStep('I should see the no-results message for {string}', (term: string) => {
  cy.get('num-placeholder-box')
    .should('be.visible')
    .and('contain.text', t('FEASIBILITY.EDITOR.EMPTY').trim())
    .and('contain.text', term)
})

defineStep('the table should show results within {int} seconds', (seconds: number) => {
  cy.get('num-table tbody > tr', { timeout: seconds * 1000 }).should('have.length.greaterThan', 0)
})
