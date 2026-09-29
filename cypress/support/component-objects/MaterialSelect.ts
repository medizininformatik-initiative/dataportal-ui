/**
 * Generic helper for Angular Material's own `mat-select`/`.mat-mdc-option`
 * interaction pattern — not one of our shared components (no template of
 * ours to attach `data-cy` to), just a common third-party interaction this
 * codebase needed in 3 independent copies (cohort-edit.ts x2,
 * timeRestriction.cy.ts) before this helper existed.
 */
export class MaterialSelect {
  public selectOptionByText(triggerSelector: string, text: string) {
    cy.get(triggerSelector).click()
    cy.get('.mat-mdc-option').contains(text).click()
  }
}

export const materialSelect = new MaterialSelect()
