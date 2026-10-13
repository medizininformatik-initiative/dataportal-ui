import { defineStep } from '../defineStep'
import { t } from '../i18n'

export class CohortDefinition {
  public shouldShowEmptyMessage() {
    cy.get('num-placeholder-box').should('contain', t('DATAQUERY.COHORT.EMPTY'))
  }
}

export const cohortDefinition = new CohortDefinition()

defineStep('the cohort definition should show the empty message', () =>
  cohortDefinition.shouldShowEmptyMessage()
)
