import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numButton } from '../component-objects/NumButton'

const TILE = '.saved-query-tile'

export class SavedQueries {
  public shouldSeeInList(title: string) {
    cy.contains(TILE, title).should('exist')
  }

  public shouldNotSeeInList(title: string) {
    cy.contains(TILE, title).should('not.exist')
  }

  public load(title: string) {
    numButton.clickByText(cy.contains(TILE, title), 'Load Data Definition')
  }

  public delete(title: string) {
    cy.contains(TILE, title).find('[data-cy="saved-query-delete-icon"]').click()
    // onDelete() opens confirm-delete-modal (a MatDialog, rendered outside
    // the tile's own DOM subtree via CDK overlay) — deleting isn't a single
    // click, it needs confirming too.
    numButton.clickByText('body', 'Delete')
  }
}

export const savedQueries = new SavedQueries()

defineStep('I should see the saved query {string} in the list', (title: string) =>
  savedQueries.shouldSeeInList(title)
)
defineStep('I should not see the saved query {string} in the list', (title: string) =>
  savedQueries.shouldNotSeeInList(title)
)
defineStep('I load the saved query {string}', (title: string) => savedQueries.load(title))
defineStep('I delete the saved query {string}', (title: string) => savedQueries.delete(title))
