type Scope = string | Cypress.Chainable<JQuery>

/**
 * Resolve scope to chainable. Pass chainables through.
 * */
function scoped(scope: Scope): Cypress.Chainable<JQuery> {
  return typeof scope === 'string' ? cy.get(scope) : scope
}

/**
 * Query and interaction helper for `num-button` / `num-action-bar` shared components. Buttons
 * have real, stable, translated labels: match by that text, scoped into container, not by
 * retrofitted `data-cy` (see cypress/CLAUDE.md data-cy principle).
 * */
export class NumButton {
  /**
   * Click button by text. `scope` = selector string or already-scoped chainable (e.g.
   * `cy.contains('.saved-query-tile', title)`). Accepting both lets caller who already narrowed
   * to one instance among several (tiles sharing one button label) skip rebuilding selector
   * string.
   * */
  public clickByText(scope: Scope, text: string, matchCase = true) {
    scoped(scope).contains('button', text, { matchCase }).click()
  }

  /**
   * Assert button enabled.
   * */
  public shouldBeEnabled(scope: Scope, text: string, matchCase = true) {
    scoped(scope).contains('button', text, { matchCase }).should('not.be.disabled')
  }

  /**
   * Assert button disabled.
   * */
  public shouldBeDisabled(scope: Scope, text: string, matchCase = true) {
    scoped(scope).contains('button', text, { matchCase }).should('be.disabled')
  }
}

export const numButton = new NumButton()
