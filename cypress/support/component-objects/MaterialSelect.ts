/**
 * Helper for Material own `mat-select` / `.mat-mdc-option` interaction. Not one of our shared
 * components (no template of ours for `data-cy`), only common third-party interaction needed
 * in 3 independent copies (cohort-edit.ts x2, timeRestriction.cy.ts) before this helper
 * existed.
 * */
export class MaterialSelect {
  /**
   * Open select inside trigger selector, click option by text.
   * */
  public selectOptionByText(triggerSelector: string, text: string) {
    cy.get(triggerSelector).click()
    cy.get('.mat-mdc-option').contains(text).click()
  }
}

export const materialSelect = new MaterialSelect()
