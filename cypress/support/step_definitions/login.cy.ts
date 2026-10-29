import { defineStep } from '../defineStep'

/**
 * Steps for login.
 * */
export class Login {
  /**
   * Visit login page.
   * */
  public visitLoginPage() {
    /**
     * `cy.visit()` already waits for page load event (documented Cypress behavior): no extra wait.
     * */
    cy.visit('home')
  }

  /**
   * Log in via `cy.login()`.
   * */
  public login() {
    cy.login()
  }
}
export const login = new Login()
defineStep('I go to the login page', () => login.visitLoginPage())
defineStep('I fill in the login form with valid credentials', () => login.login())
/**
 * `login()` already visits `home` via `cy.login()`. Calling `visitLoginPage()` first would
 * navigate to same page, then `cy.login()` own `cy.visit('home')` discards it and navigates
 * again.
 * */
defineStep('I am logged in as a user', () => login.login())
