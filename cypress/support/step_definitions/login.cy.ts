import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

export class Login {
  public visitLoginPage() {
    // cy.visit() already waits for the page's load event (Cypress's own
    // documented behavior) — no separate wait needed after it.
    cy.visit('home')
  }

  public login() {
    cy.login()
  }
}
export const login = new Login()
defineStep('I go to the login page', () => login.visitLoginPage())
defineStep('I fill in the login form with valid credentials', () => login.login())
defineStep('I am logged in as a user', () => {
  // login() already visits 'home' via cy.login() — calling visitLoginPage()
  // first (as this used to) just navigated to the same page a moment before
  // cy.login()'s own cy.visit('home') discarded it and re-navigated anyway.
  login.login()
})
