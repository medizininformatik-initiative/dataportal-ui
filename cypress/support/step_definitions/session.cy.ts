import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

/**
 * A lost session, as opposed to `my session has expired` (an API answering 401). Dropping the
 * browser's cookies and storage removes both the app's OAuth tokens (sessionStorage) and the
 * Keycloak SSO cookie, so the next navigation cannot silently sign in again.
 */
defineStep('my session is lost', () => {
  cy.clearAllCookies()
  cy.clearAllSessionStorage()
  cy.clearAllLocalStorage()
})

defineStep('I open the {string} page of the portal', (path: string) => {
  cy.visit(path)
})

defineStep('I am asked to sign in', () => {
  cy.origin(Cypress.expose('redirectUrl'), () => {
    cy.get('#kc-login').should('be.visible')
  })
})
