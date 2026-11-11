import { dataCy } from '../dataCy'
/**
 * Query and interaction helper for `num-checkbox` shared component: native
 * `<input type="checkbox">` carrying `data-cy="checkbox"`. Read state with `be.checked`.
 * See checkbox.component.html and cypress/CLAUDE.md registry.
 * */
export class NumCheckbox {
  /**
   * Toggle checkbox in current scope. Call inside `.within()` scoped to right container (e.g.
   * table row). Takes no scope selector on purpose: `cy.get('body')` as scope inside active
   * `.within()` breaks OUT to whole document, so selector-based scope would silently toggle
   * wrong checkbox.
   * */
  public toggle() {
    cy.get(dataCy('checkbox')).click()
  }
}

export const numCheckbox = new NumCheckbox()
