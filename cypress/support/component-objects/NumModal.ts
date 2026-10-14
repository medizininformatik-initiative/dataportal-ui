/**
 * Generic open and closed assertions for any `num-*-modal` component. Replaces same
 * `.should('be.visible')` / `.should('not.exist')` pair duplicated per modal tag across step
 * files.
 * */
export class NumModal {
  /**
   * Assert modal open.
   * */
  public shouldBeOpen(tag: string) {
    /**
     * `exist`, not `be.visible`: CDK MatDialog host (e.g. `num-save-dataquery-modal`) renders with
     * `display: contents`, Cypress cannot compute bounding box, so `be.visible` reports not
     * visible though content is. Every modal targeted here (dialogs and `num-spinner`) is added or
     * removed from DOM structurally, not CSS-hidden: existence is equally valid "is open" signal,
     * no false negative.
     * */
    cy.get(tag).should('exist')
  }

  /**
   * Assert modal closed.
   * */
  public shouldBeClosed(tag: string) {
    cy.get(tag).should('not.exist')
  }
}

export const numModal = new NumModal()
