import { defineStep } from '../defineStep'
import { t } from '../i18n'

/**
 * Steps for cohort definition page.
 * */
export class CohortDefinition {
  /**
   * Assert empty-cohort placeholder shown.
   * */
  public shouldShowEmptyMessage() {
    cy.get('num-placeholder-box').should('contain', t('DATAQUERY.COHORT.EMPTY'))
  }
}

export const cohortDefinition = new CohortDefinition()

defineStep('the cohort definition should show the empty message', () =>
  cohortDefinition.shouldShowEmptyMessage()
)
