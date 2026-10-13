import { defineStep } from '../defineStep'

/**
 * Steps for session loss and sign-in.
 * */
export class Session {
  /**
   * Lost session, unlike `my session has expired` (API answers 401). Clearing cookies and
   * storage removes app OAuth tokens (sessionStorage) and Keycloak SSO cookie: next navigation
   * cannot silently sign in again.
   * */
  public lose() {
    cy.clearAllCookies()
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
  }

  /**
   * Visit portal path.
   * */
  public openPage(path: string) {
    cy.visit(path)
  }

  /**
   * Assert Keycloak login form visible.
   * */
  public shouldBeAskedToSignIn() {
    cy.origin(Cypress.expose('redirectUrl'), () => {
      cy.get('#kc-login').should('be.visible')
    })
  }
}

export const session = new Session()

defineStep('my session is lost', () => session.lose())
defineStep('I open the {string} page of the portal', (path: string) => session.openPage(path))
defineStep('I am asked to sign in', () => session.shouldBeAskedToSignIn())
