import { defineStep } from '../defineStep'
import { t } from '../i18n'

defineStep('the cohort definition should show the empty message', () => {
  cy.get('num-placeholder-box').should('contain', t('DATAQUERY.COHORT.EMPTY'))
})
