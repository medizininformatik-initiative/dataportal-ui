/**
 * Generic query/interaction helper for the `num-button`/`num-action-bar` shared
 * components. Buttons have real, stable, translated labels — per
 * cypress/CLAUDE.md's data-cy principle, they're matched by that text (scoped
 * into a container), not by a retrofitted data-cy attribute.
 */
type Scope = string | Cypress.Chainable<JQuery>

function scoped(scope: Scope): Cypress.Chainable<JQuery> {
  return typeof scope === 'string' ? cy.get(scope) : scope
}

export class NumButton {
  /**
   * @param scope A selector string, or an already-scoped chainable (e.g.
   *   `cy.contains('.saved-query-tile', title)`) — accepting both means a
   *   caller that already narrowed down to a specific instance among several
   *   (multiple tiles sharing one button label) doesn't have to reconstruct
   *   a selector string just to call this.
   */
  public clickByText(scope: Scope, text: string, matchCase = true) {
    scoped(scope).contains('button', text, { matchCase }).click()
  }

  public shouldBeEnabled(scope: Scope, text: string, matchCase = true) {
    scoped(scope).contains('button', text, { matchCase }).should('not.be.disabled')
  }

  public shouldBeDisabled(scope: Scope, text: string, matchCase = true) {
    scoped(scope).contains('button', text, { matchCase }).should('be.disabled')
  }
}

export const numButton = new NumButton()
