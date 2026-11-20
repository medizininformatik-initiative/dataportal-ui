import { numButton } from '../../support/component-objects/NumButton'
import { numTable } from '../../support/component-objects/NumTable'
import { Table } from '../../support/step_definitions/table.cy'

const NUM_SEARCHBAR_INPUT = 'num-searchbar input'
const SEARCH_PAGE = 'num-feasibility-query-search'

/**
 * Criterion search page object: search input, result select, action bar.
 * */
export class CriterionSearch {
  /**
   * Type text into search input.
   * */
  public searchInput(text: string) {
    cy.get(NUM_SEARCHBAR_INPUT).should('be.visible')
    cy.get(NUM_SEARCHBAR_INPUT).clear().type(text)
    cy.get(NUM_SEARCHBAR_INPUT).should('have.value', text)
  }

  /**
   * Find criterium row by text.
   * */
  public findCriterion(text: string) {
    const table = new Table()
    table.assertRowItemExits(text)
  }

  /**
   * Tick criterium row checkbox.
   * */
  public selectCriterion(text: string) {
    numTable.selectCheckboxInRow(text)
  }

  /**
   * Click action bar button by name.
   * */
  public selectActioBarButton(buttonName: string) {
    numButton.clickByText('num-action-bar', buttonName, false)
  }

  /**
   * Wait until search page left DOM. Route animation keeps leaving search page and entering
   * editor in DOM together, so editor elements like `num-action-bar` match twice until then.
   * */
  public shouldHaveLeftSearchPage() {
    cy.get(SEARCH_PAGE).should('not.exist')
  }
}
