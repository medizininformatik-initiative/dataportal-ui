import { numButton } from '../../support/component-objects/NumButton'
import { numTable } from '../../support/component-objects/NumTable'
import { Table } from '../../support/step_definitions/table.cy'

export class CriterionSearch {
  public searchInput(text: string) {
    cy.get('num-searchbar input').should('be.visible')
    cy.get('num-searchbar input').clear().type(text)
    cy.get('num-searchbar input').should('have.value', text)
  }

  public findCriterion(text: string) {
    const table = new Table()
    table.assertRowItemExits(text)
  }

  public selectCriterion(text: string) {
    numTable.selectCheckboxInRow(text)
  }

  public selectActioBarButton(buttonName: string) {
    numButton.clickByText('num-action-bar', buttonName, false)
  }
}
