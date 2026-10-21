import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'
import { NavItemValue, NavItemPaths, NavItemBaseRoutes } from '../../e2e/Utilities/NavItems'
import { Page } from '../../e2e/Utilities/pages'
import { getUrlPathByPage } from '../../e2e/Utilities/pathResolver'

const NAV_LIST = 'num-side-menu'
const NAV_ITEM_FONT = `${NAV_LIST} .navItem-font`

/**
 * Class for side navigation component tests.
 * @see NavItemValue
 * */
export class SideNavTests {
  /**
   * Click nav item, assert URL.
   * */
  public navigateTo(navItemSelector: NavItemValue) {
    cy.get(dataCy(`nav-${NavItemBaseRoutes[navItemSelector]}`)).click()
    cy.url().should('include', NavItemPaths[navItemSelector])
  }

  /**
   * Visit page URL only when not already there.
   * */
  public visitUrl(url: Page) {
    const resolvedUrl: string = getUrlPathByPage(url)
    cy.url().then((currentUrl) => {
      if (!currentUrl.includes(resolvedUrl)) {
        cy.visit(resolvedUrl)
      }
    })
    cy.url().should('include', resolvedUrl)
  }

  /**
   * Match toggle inside nav list, not by `aria-label`: label is translated, follows app
   * language, not suite language.
   * */
  public toggle() {
    cy.get(`${NAV_LIST} .num-toggle-button`).click()
  }

  /**
   * Assert nav collapsed.
   * */
  public shouldBeCollapsed() {
    cy.get(NAV_LIST).should('have.class', 'collapsed')
  }

  /**
   * Assert nav expanded.
   * */
  public shouldBeExpanded() {
    cy.get(NAV_LIST).should('not.have.class', 'collapsed')
  }

  /**
   * Assert nav lists `count` areas.
   * */
  public shouldListAreas(count: number) {
    cy.get(`${NAV_LIST} .num-nav-group > a.num-nav-link`).should('have.length', count)
  }

  /**
   * Assert nav shows label.
   * */
  public shouldShowLabel(label: string) {
    cy.get(NAV_ITEM_FONT).should('contain', label)
  }

  /**
   * Assert nav shows no labels.
   * */
  public shouldShowNoLabels() {
    cy.get(NAV_ITEM_FONT).should('not.exist')
  }

  /**
   * Unlike `visitUrl`, never navigates. `visitUrl` does hard `cy.visit()` on URL mismatch: after
   * click it can hide navigation that never happened. This only asserts.
   * */
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
