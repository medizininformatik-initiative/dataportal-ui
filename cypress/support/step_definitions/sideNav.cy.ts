import { defineStep } from '../defineStep'
import { NavItemValue, NavItemPaths, NavItemBaseRoutes } from '../../e2e/Utilities/NavItems'
import { Page } from '../../e2e/Utilities/pages'
import { getUrlPathByPage } from '../../e2e/Utilities/pathResolver'

/**
 * Class for side navigation component tests.
 * @see NavItemValue
 */
export class SideNavTests {
  public navigateTo(navItemSelector: NavItemValue) {
    cy.get(`[data-cy="nav-${NavItemBaseRoutes[navItemSelector]}"]`).click()
    cy.url().should('include', NavItemPaths[navItemSelector])
  }

  public visitUrl(url: Page) {
    const resolvedUrl: string = getUrlPathByPage(url)
    cy.url().then((currentUrl) => {
      if (!currentUrl.includes(resolvedUrl)) {
        cy.visit(resolvedUrl)
      }
    })
    cy.url().should('include', resolvedUrl)
  }

  // The toggle is matched inside the nav list rather than by its aria-label, because that
  // label is translated and follows the app's current language, not the language the suite
  // runs in.
  public toggle() {
    cy.get('mat-nav-list .num-logo-row button').click()
  }

  public shouldBeCollapsed() {
    cy.get('mat-nav-list').should('have.class', 'collapsed')
  }

  public shouldBeExpanded() {
    cy.get('mat-nav-list').should('not.have.class', 'collapsed')
  }

  public shouldListAreas(count: number) {
    cy.get('mat-nav-list a.num-mat-list-item').should('have.length', count)
  }

  public shouldShowLabel(label: string) {
    cy.get('mat-nav-list .navItem-font').should('contain', label)
  }

  public shouldShowNoLabels() {
    cy.get('mat-nav-list .navItem-font').should('not.exist')
  }

  // Unlike `visitUrl`, this never navigates: that does a hard cy.visit() when the URL does
  // not match, so used after a click it can hide a navigation that never happened. This
  // one only asserts.
  public shouldArriveOn(page: Page) {
    cy.url().should('include', getUrlPathByPage(page))
  }
}
export const sideNavTests = new SideNavTests()

defineStep('I navigate to the {string} page', (navItem: NavItemValue) =>
  sideNavTests.navigateTo(navItem)
)
defineStep('I am on the {string} page', (page: Page) => sideNavTests.visitUrl(page))
defineStep('I toggle the side navigation', () => sideNavTests.toggle())
defineStep('the side navigation should be collapsed', () => sideNavTests.shouldBeCollapsed())
defineStep('the side navigation should be expanded', () => sideNavTests.shouldBeExpanded())
defineStep('the side navigation should list {int} areas', (count: number) =>
  sideNavTests.shouldListAreas(count)
)
defineStep('the side navigation should show the label {string}', (label: string) =>
  sideNavTests.shouldShowLabel(label)
)
defineStep('the side navigation should show no labels', () => sideNavTests.shouldShowNoLabels())
defineStep('I should arrive on the {string} page', (page: Page) =>
  sideNavTests.shouldArriveOn(page)
)
