import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'
import { numButton } from '../component-objects/NumButton'

const TILE = '.saved-query-tile'

/**
 * Steps for saved-query tiles.
 * */
export class SavedQueries {
  /**
   * Assert tile titled `title` exists.
   * */
  public shouldSeeInList(title: string) {
    cy.contains(TILE, title).should('exist')
  }

  /**
   * Assert tile titled `title` absent.
   * */
  public shouldNotSeeInList(title: string) {
    cy.contains(TILE, title).should('not.exist')
  }

  /**
   * Click "Load Data Definition" inside tile.
   * */
  public load(title: string) {
    numButton.clickByText(cy.contains(TILE, title), 'Load Data Definition')
  }

  /**
   * Click delete icon of tile, confirm.
   * */
  public delete(title: string) {
    cy.contains(TILE, title).find(dataCy('saved-query-delete-icon')).click()
    /**
     * `onDelete()` opens `confirm-delete-modal`, MatDialog rendered outside tile DOM via CDK
     * overlay: delete needs confirm click too.
     * */
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
