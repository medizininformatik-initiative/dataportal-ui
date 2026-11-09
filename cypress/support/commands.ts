/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<void>
  }
}

Cypress.Commands.add('login', () => {
  cy.visit('home')
  /**
   * Deliberately left as fixed wait, unlike all others in suite (see cypress/CLAUDE.md).
   * Highest-blast-radius step: every scenario Background runs it. `cy.url()` before crossing
   * into `cy.origin()` risks stricter cross-origin handling of Cypress if redirect already
   * landed on different origin. Not confident enough in that behavior to risk it over style win.
   * */
  cy.wait(1000)
  cy.origin(Cypress.expose('redirectUrl'), () => {
    cy.env(['username', 'password']).then(({ username, password }) => {
      cy.get('input[name=username]').type(username)
      cy.get('input[name=password]').type(password)
    })
    cy.get('#kc-login').click()
  })

  cy.url({ timeout: 250000 }).should('include', Cypress.expose('homeUrl'))
})
