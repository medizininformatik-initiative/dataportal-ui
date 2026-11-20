/**
 * Angular CDK drag and drop. During drag and its drop animation CDK renders preview, placeholder
 * and `.cdk-drag-animating`; all gone once list order is final.
 * */
export class CdkDragDrop {
  /**
   * Wait until drop finished, instead of fixed wait.
   * */
  public dropShouldBeSettled() {
    cy.get('.cdk-drag-preview, .cdk-drag-placeholder, .cdk-drag-animating').should('not.exist')
  }
}

export const cdkDragDrop = new CdkDragDrop()
