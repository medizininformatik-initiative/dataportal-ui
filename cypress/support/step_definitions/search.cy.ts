import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

export class Search {
  /**
   * First clears the input field and the types the specified text into the input field of the search bar.
   * @param text
   */
  public typeInInputField(text: string) {
    cy.get('num-searchbar input').clear().type(text).should('have.value', text)
  }

  public clearInputField() {
    cy.get('num-searchbar input').clear().should('have.value', '')
  }
}

export const searchInstance = new Search()
defineStep('I type {string} in the search input field', (text: string) => {
  searchInstance.typeInInputField(text)
})
defineStep('I clear the search input field', () => {
  searchInstance.clearInputField()
})
defineStep('the search input should keep the text {string}', (text: string) => {
  cy.get('num-searchbar input').should('have.value', text)
})
