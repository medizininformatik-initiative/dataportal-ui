import { dataCy, dataCyOf } from '../dataCy'
import { defineStep } from '../defineStep'

const CRITERION = '.container'
const GROUP = 'num-criteria-group'
const TITLE = '.title-section'

type Edge = 'before' | 'after'

/**
 * Criteria grouped by AND/OR connections in Inclusion and Exclusion lists. List = sequence of
 * groups, group = sequence of criteria. Steps write `x + y | z` for one group of x and y, then
 * one group of z. Fixtures give scenarios known groups.
 * */
export class CriteriaGroups {
  /**
   * Upload fixture, wait until upload finished. Own step, because `UploadFile.uploadFile` waits
   * for text of one fixed criterium. Success message comes last: upload still navigates to cohort
   * definition afterwards, which would cancel earlier route change.
   * */
  public upload(fileName: string) {
    cy.get(dataCy('upload-crtdl')).selectFile(`cypress/fixtures/${fileName}.json`, {
      force: true,
    })
    cy.contains('Data definition uploaded successfully', { timeout: 15000 }).should('be.visible')
    cy.get(CRITERION).should('exist')
  }

  /**
   * Open editor by client-side routing. Hard `cy.visit()` drops uploaded query, and no link
   * leads from cohort definition to editor while query exists (side navigation stays on that
   * page). Angular router listens to `popstate`.
   * */
  public openEditor() {
    cy.window().then((win) => {
      win.history.pushState({}, '', '/feasibility-query/overview')
      win.dispatchEvent(new PopStateEvent('popstate'))
    })
    cy.get('#Stage', { timeout: 10000 }).should('exist')
    cy.get('.lock-div').should('not.exist')
  }

  /**
   * Click switch between two neighbouring criteria. Inside one group it sits below first
   * criterium (inner switch), between two groups it follows group of first criterium (outer
   * switch).
   * */
  public switchBetween(first: string, second: string) {
    cy.get(dataCyOf(first, CRITERION))
      .closest('.group-item')
      .then(($item) => {
        const inner = $item.find('num-bool-logic-switch')
        const outer = $item.closest(GROUP).parent().find('.outer-switch')
        cy.wrap(inner.length ? inner : outer)
          .find('.bool-logic-switch')
          .first()
          .click()
      })
    cy.get(dataCyOf(second, CRITERION)).should('exist')
  }

  /**
   * Drag criterium onto list. Drop lands where pointer is over list.
   * */
  public dragToList(criterium: string, list: string) {
    this.drag(criterium, cy.get(`#${list}`))
  }

  /**
   * Drag criterium below last criterium of list, where no criterium is under pointer: CDK
   * appends.
   * */
  public dragToEnd(criterium: string, list: string) {
    this.drag(criterium, cy.get(`#${list}`), 'bottom')
  }

  /**
   * Drag criterium to upper or lower edge of another criterium, which sets drop index. Pointer
   * stays left of centre: switch between two criteria overlaps centre of box.
   * */
  public dragNextTo(criterium: string, edge: Edge, other: string) {
    cy.get(dataCyOf(criterium, CRITERION)).trigger('mousedown', { button: 0 })
    cy.get(dataCyOf(other, CRITERION)).then(($other) => {
      const y = edge === 'before' ? 6 : ($other.outerHeight() ?? 0) - 6
      cy.wrap($other).trigger('mousemove', 20, y).trigger('mousemove', 20, y)
      cy.wrap($other).trigger('mouseup', 20, y)
    })
    cy.wait(500)
  }

  /**
   * Assert list shows exactly these groups, in this order.
   * */
  public shouldHaveGroups(list: string, groups: string) {
    const expected = groups
      .split('|')
      .map((group) => group.split('+').map((criterium) => criterium.trim()))
    cy.get(`#${list}`).should(($list) => {
      const actual = $list
        .find(GROUP)
        .toArray()
        .map((group) =>
          Cypress.$(group)
            .find(TITLE)
            .toArray()
            .map((title) => title.textContent?.trim())
        )
      expect(actual).to.deep.equal(expected)
    })
  }

  /**
   * CDK starts drag on first move past threshold and sorts on later moves: send two.
   * */
  private drag(
    criterium: string,
    target: Cypress.Chainable<JQuery>,
    position: Cypress.PositionType = 'center'
  ) {
    cy.get(dataCyOf(criterium, CRITERION)).trigger('mousedown', { button: 0 })
    target.trigger('mousemove', position).trigger('mousemove', position)
    target.trigger('mouseup', position)
    cy.wait(500)
  }
}

export const criteriaGroups = new CriteriaGroups()

defineStep('I upload the criteria fixture {string}', (fileName: string) =>
  criteriaGroups.upload(fileName)
)
defineStep('I open the cohort editor', () => criteriaGroups.openEditor())
defineStep('I switch the connection between {string} and {string}', (a: string, b: string) =>
  criteriaGroups.switchBetween(a, b)
)
defineStep('I drag {string} to the {string} list', (criterium: string, list: string) =>
  criteriaGroups.dragToList(criterium, list)
)
defineStep('I drag {string} to the end of the {string} list', (criterium: string, list: string) =>
  criteriaGroups.dragToEnd(criterium, list)
)
defineStep('I drag {string} {word} {string}', (criterium: string, edge: Edge, other: string) =>
  criteriaGroups.dragNextTo(criterium, edge, other)
)
defineStep('the {string} list has the groups {string}', (list: string, groups: string) =>
  criteriaGroups.shouldHaveGroups(list, groups)
)
