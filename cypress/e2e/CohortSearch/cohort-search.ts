import { numButton } from '../../support/component-objects/NumButton'
import { numTable } from '../../support/component-objects/NumTable'
import { Table } from '../../support/step_definitions/table.cy'

/**
 * Criterion search page object: search input, result select, action bar.
 * */
export class CriterionSearch {
  /**
   * Type text into search input.
   * */
  public searchInput(text: string) {
    cy.get('num-searchbar input').should('be.visible')
    cy.get('num-searchbar input').clear().type(text)
    cy.get('num-searchbar input').should('have.value', text)
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
}
