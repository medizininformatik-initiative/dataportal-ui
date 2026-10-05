import { resolve } from '../testData'
import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numConceptFilter } from '../component-objects/NumConceptFilter'
import { t } from '../i18n'
import { numMenu } from '../component-objects/NumMenu'

/**
 * Opening the editor of the criterium that was just added, and switching
 * between the criterion editor's top-level filter tabs. Those tabs mirror the
 * Criterion data model: "Time restriction" (timeRestriction), "Attribute
 * Filter" (attributeFilters), "Value Filter" (valueFilters), "References".
 */
defineStep('I open the editor of the added criterium', () => {
  numMenu.open()
  numMenu.clickItem(t('SHARED_COMPONENTS.MENU.EDIT') as never)
})

// Filter tabs are named after the filter itself (the attribute's / value's English
// display, e.g. "ICD-10-WHO", "Gender", "Type of encounter", "Time restriction") and
// rendered upper-case by CSS - match case-insensitively. There is no generic
// "Attribute Filter" / "Value Filter" tab.
defineStep('I open the editor tab {string}', (tab: string) => {
  numConceptFilter.openEditorTab(resolve(tab))
})

// A criterium with no timeRestriction/attribute/value filter renders no tab bar at all.
defineStep('the editor has no filter tabs', () => {
  cy.get('num-filter-tabs, .tabs-container, .header-col-chips').should('exist')
  cy.get('.tab').should('not.exist')
})

defineStep('the criterium {string} shows no filter chips', (criterium: string) => {
  cy.get(`.container[data-cy="${criterium}"]`).find('.chip-container').should('not.exist')
})

// A concept filter chip shows the concept's DISPLAY text (not its code) under a block with
// the filter's name, e.g. "ICD-10-WHO". The display text is the ontology's original, so
// it can be German in the English UI when no English translation exists.
defineStep(
  'the criterium {string} shows a filter chip for {string}',
  (criterium: string, chipText: string) => {
    cy.get(`.container[data-cy="${resolve(criterium)}"]`)
      .find('.chip-container')
      .should('contain', resolve(chipText))
  }
)
