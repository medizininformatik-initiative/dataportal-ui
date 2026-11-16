import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'
import { numButton } from '../component-objects/NumButton'

const TILE = '.saved-query-tile'
const SAVED_QUERIES_API = 'http://localhost:8090/api/v6/query/data'

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

  /**
   * Delete every saved query titled `title` via backend API. Scenario that fails before its own
   * delete step leaves its query behind; next run then sees two tiles with same title.
   * Needs logged-in app: reuses its access token from session storage.
   * */
  public deleteLeftovers(title: string) {
    cy.window().then((win) => {
      const headers = { Authorization: `Bearer ${win.sessionStorage.getItem('access_token')}` }
      cy.request({ url: SAVED_QUERIES_API, headers }).then(({ body }) => {
        body
          .filter((query: { label: string }) => query.label === title)
          .forEach((query: { id: number }) =>
            cy.request({ method: 'DELETE', url: `${SAVED_QUERIES_API}/${query.id}`, headers })
          )
      })
    })
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
defineStep('no saved query {string} exists', (title: string) => savedQueries.deleteLeftovers(title))
