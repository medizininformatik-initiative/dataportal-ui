/**
 * Query and interaction helper for `num-checkbox` shared component: `<span role="checkbox">`
 * with click handler, never real `<input>`. `cy.check()` / `input[type="checkbox"]` cannot
 * work. Wraps real clickable element via `data-cy="checkbox"` (see checkbox.component.html,
 * cypress/CLAUDE.md registry).
 * */
export class NumCheckbox {
  /**
   * Toggle checkbox in current scope. Call inside `.within()` scoped to right container (e.g.
   * table row). Takes no scope selector on purpose: `cy.get('body')` as scope inside active
   * `.within()` breaks OUT to whole document, so selector-based scope would silently toggle
   * wrong checkbox.
   * */
  public toggle() {
    cy.get('[data-cy="checkbox"]').click()
  }
}

export const numCheckbox = new NumCheckbox()
