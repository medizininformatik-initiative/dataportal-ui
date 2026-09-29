/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<void>
  }
}

Cypress.Commands.add('login', () => {
    cy.visit('home')
    // Deliberately left as a fixed wait, unlike every other one in this suite
    // (see cypress/CLAUDE.md / the refactor plan): this is the single
    // highest-blast-radius step (every scenario's Background runs it), and
    // cy.url() checked before crossing into cy.origin() risks Cypress's
    // stricter pre-cy.origin() cross-origin handling if the redirect has
    // already landed on a different origin by then. Not confident enough in
    // that specific behavior to risk it here over a stylistic win.
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
