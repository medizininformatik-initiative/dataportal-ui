/**
 * Query/interaction helper for the `num-checkbox` shared component — a
 * `<span role="checkbox">` with a click handler, never a real `<input>`.
 * `cy.check()`/`input[type="checkbox"]` cannot work against it; this wraps the
 * actual clickable element via its `data-cy="checkbox"` (see
 * checkbox.component.html / cypress/CLAUDE.md's registry).
 */
export class NumCheckbox {
  /**
   * Toggles the checkbox in the current scope. Call from within a
   * `.within()` block scoped to the right container (e.g. a table row) —
   * deliberately takes no scope selector of its own: `cy.get('body')` used as
   * a "scope" inside an active `.within()` block breaks *out* of it back to
   * the whole document, so composing a selector-based scope here would
   * silently toggle the wrong checkbox when called from within one.
   */
  public toggle() {
    cy.get('[data-cy="checkbox"]').click()
  }
}

export const numCheckbox = new NumCheckbox()
