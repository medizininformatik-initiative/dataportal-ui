/**
 * Side panel (`mat-drawer.details-drawer` + `num-list-item-details-generic`) opening on search
 * result row click. Tabs, tab bodies and drawer are Material own DOM: match by class or text,
 * not `data-cy`.
 * */
const DRAWER = 'mat-drawer.details-drawer'

/**
 * Query and interaction helper for details panel.
 * */
export class NumDetailsPanel {
  /**
   * Assert panel open.
   * */
  public shouldBeOpen() {
    cy.get(DRAWER).should('have.class', 'mat-drawer-opened')
  }

  /**
   * Assert panel closed.
   * */
  public shouldBeClosed() {
    cy.get(DRAWER).should('not.have.class', 'mat-drawer-opened')
  }

  /**
   * Click panel close button.
   * */
  public close() {
    cy.get(DRAWER).contains('button', 'Close').click()
  }

  /**
   * Open panel tab by label.
   * */
  public openTab(label: string) {
    cy.get(DRAWER).contains('[role="tab"]', label).click()
  }

  /**
   * Assert panel offers tab.
   * */
  public shouldOfferTab(label: string) {
    cy.get(DRAWER).contains('[role="tab"]', label).should('be.visible')
  }

  /**
   * Assert panel title.
   * */
  public shouldShowTitle(title: string) {
    cy.get(DRAWER).find('.original-item').should('contain.text', title)
  }

  /**
   * Find related criterium entry by name.
   * */
  public relative(name: string) {
    return cy
      .get(`${DRAWER} .mat-mdc-tab-body-active .num-list-entry`)
      .contains(name)
      .closest('.num-list-entry')
  }
}

export const numDetailsPanel = new NumDetailsPanel()
