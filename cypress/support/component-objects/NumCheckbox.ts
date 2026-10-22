import { dataCy } from '../dataCy'
/**
 * Query and interaction helper for `num-checkbox` shared component: native
 * `<input type="checkbox">`, state in `checked` property, no `aria-checked`. Assert through
 * `shouldBe`. Wraps element via `data-cy="checkbox"` (see checkbox.component.html,
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
    cy.get(dataCy('checkbox')).click()
  }

  /**
   * Assert checkbox found by `box` is checked or unchecked. Retries like any `.should`.
   * */
  public shouldBe(box: Cypress.Chainable<JQuery<HTMLElement>>, checked: boolean) {
    box.should(checked ? 'be.checked' : 'not.be.checked')
  }
}

export const numCheckbox = new NumCheckbox()
