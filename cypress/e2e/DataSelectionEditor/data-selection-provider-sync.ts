import { dataCyOf } from '../../support/dataCy'
import { defineStep } from '../../support/defineStep'
import { t } from '../../support/i18n'

const APPLY_TIME_RESTRICTION = '.apply-time-restriction'

/**
 * Data selection editor steps for profile store sync: box presence, move arrows, apply time
 * restriction to all features.
 * */
export class DataSelectionProviderSync {
  /**
   * Assert box of profile not rendered.
   * */
  public boxShouldNotExist(name: string) {
    cy.get(dataCyOf(name, '.selection-box')).should('not.exist')
  }

  /**
   * Assert move down button of box enabled or disabled.
   * */
  public moveDownShouldBe(name: string, state: string) {
    cy.get(dataCyOf(name, '.selection-box'))
      .find(`[aria-label="${t('DATASELECTION.EDITOR.DISPLAY.MOVE_DOWN')}"]`)
      .should(state === 'enabled' ? 'not.be.disabled' : 'be.disabled')
  }

  /**
   * Open "Apply time period to all", pick "no filter", apply.
   * */
  public applyNoTimeRestrictionToAll() {
    cy.contains(
      `${APPLY_TIME_RESTRICTION}__toggle`,
      t('FEASIBILITY.EDITOR.CRITERIA_STAGE.APPLY_TIME_RESTRICTION')
    ).click()
    cy.get(`${APPLY_TIME_RESTRICTION}__controls`).within(() => {
      cy.get('select').select('NONE')
      cy.get('num-button button').should('not.be.disabled').click()
    })
  }
}

export const dataSelectionProviderSync = new DataSelectionProviderSync()

defineStep('the data selection box {string} is not shown', (name: string) =>
  dataSelectionProviderSync.boxShouldNotExist(name)
)
defineStep(
  'the move down button of the data selection box {string} is {word}',
  (name: string, state: string) => dataSelectionProviderSync.moveDownShouldBe(name, state)
)
defineStep('I apply no time restriction to all features', () =>
  dataSelectionProviderSync.applyNoTimeRestrictionToAll()
)
