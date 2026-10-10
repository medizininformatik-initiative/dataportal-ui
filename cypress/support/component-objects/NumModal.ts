/**
 * Generic open/closed assertions for any `num-*-modal` component — replaces
 * the same `.should('be.visible')`/`.should('not.exist')` pair duplicated per
 * specific modal tag across several step-definition files.
 */
export class NumModal {
  public shouldBeOpen(tag: string) {
    // `exist`, not `be.visible` — a CDK MatDialog host (e.g.
    // num-save-dataquery-modal) renders with `display: contents`, which
    // Cypress can't compute a bounding box for, so `be.visible` reports it
    // as not visible even though its content genuinely is. Every modal this
    // helper targets (dialogs and num-spinner alike) is added/removed from
    // the DOM structurally, not CSS-hidden, so existence is an equally valid
    // "is open" signal and isn't subject to this false negative.
    cy.get(tag).should('exist')
  }

  public shouldBeClosed(tag: string) {
    cy.get(tag).should('not.exist')
  }
}

export const numModal = new NumModal()
