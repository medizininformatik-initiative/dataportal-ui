import { defineStep } from '../defineStep'

export class Session {
  /**
   * A lost session, as opposed to `my session has expired` (an API answering 401). Dropping the
   * browser's cookies and storage removes both the app's OAuth tokens (sessionStorage) and the
   * Keycloak SSO cookie, so the next navigation cannot silently sign in again.
   */
  public lose() {
    cy.clearAllCookies()
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
  }

  public openPage(path: string) {
    cy.visit(path)
  }

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
