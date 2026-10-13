import { defineStep } from '../defineStep'

/**
 * Steps for search bar input.
 * */
export class Search {
  /**
   * Clear search input, then type text.
   * */
  public typeInInputField(text: string) {
    cy.get('num-searchbar input').clear().type(text).should('have.value', text)
  }

  /**
   * Clear search input.
   * */
  public clearInputField() {
    cy.get('num-searchbar input').clear().should('have.value', '')
  }

  /**
   * Assert search input value.
   * */
  public inputShouldKeepText(text: string) {
    cy.get('num-searchbar input').should('have.value', text)
  }
}

export const searchInstance = new Search()
defineStep('I type {string} in the search input field', (text: string) =>
  searchInstance.typeInInputField(text)
)
defineStep('I clear the search input field', () => searchInstance.clearInputField())
defineStep('the search input should keep the text {string}', (text: string) =>
  searchInstance.inputShouldKeepText(text)
)
