import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numTable } from '../component-objects/NumTable'

export class Table {
  public assertRowItemExits(text: string) {
    numTable.shouldContainRow(text)
  }

  public selectCheckboxInRow(text: string): void {
    numTable.selectCheckboxInRow(text)
  }

  public assertTableRowCount(rowCount: number): void {
    cy.get('num-table tbody > tr').should('have.length', rowCount)
  }
}

export const tableInstance = new Table()

defineStep('I should see a row containing {string}', (text: string) => {
  tableInstance.assertRowItemExits(text)
})
defineStep('I select the checkbox in the row containing {string}', (text: string) => {
  tableInstance.selectCheckboxInRow(text)
})
defineStep('the table should have {int} rows', (rowCount: number) => {
  tableInstance.assertTableRowCount(rowCount)
})
