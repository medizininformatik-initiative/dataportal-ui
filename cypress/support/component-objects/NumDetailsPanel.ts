/**
 * Side panel (`mat-drawer.details-drawer` + `num-list-item-details-generic`) that
 * opens when a search result row is clicked. Tabs, tab bodies and the drawer are
 * Angular Material's own DOM, so they are matched by class/text, not `data-cy`.
 */
const DRAWER = 'mat-drawer.details-drawer'

export class NumDetailsPanel {
  public shouldBeOpen() {
    cy.get(DRAWER).should('have.class', 'mat-drawer-opened')
  }

  public shouldBeClosed() {
    cy.get(DRAWER).should('not.have.class', 'mat-drawer-opened')
  }

  public close() {
    cy.get(DRAWER).contains('button', 'Close').click()
  }

  public openTab(label: string) {
    cy.get(DRAWER).contains('[role="tab"]', label).click()
  }

  public shouldOfferTab(label: string) {
    cy.get(DRAWER).contains('[role="tab"]', label).should('be.visible')
  }

  public shouldShowTitle(title: string) {
    cy.get(DRAWER).find('.original-item').should('contain.text', title)
  }

  public relative(name: string) {
    return cy
      .get(`${DRAWER} .mat-mdc-tab-body-active .num-list-entry`)
      .contains(name)
      .closest('.num-list-entry')
  }
}

export const numDetailsPanel = new NumDetailsPanel()
