import { resolve } from '../testData'
import { defineStep } from '../defineStep'
import { numConceptFilter } from '../component-objects/NumConceptFilter'
import { t } from '../i18n'
import { label } from '../labels'
import { numMenu } from '../component-objects/NumMenu'

/**
 * Opening the editor of the criterium that was just added, and switching
 * between the criterion editor's top-level filter tabs. Those tabs mirror the
 * Criterion data model: "Time restriction" (timeRestriction), "Attribute
 * Filter" (attributeFilters), "Value Filter" (valueFilters), "References".
 */
export class CriterionEditor {
  public openEditorOfAddedCriterium() {
    numMenu.open()
    numMenu.clickItem(t('SHARED_COMPONENTS.MENU.EDIT') as never)
  }

  // Filter tabs are named after the filter itself (the attribute's / value's English
  // display, e.g. "ICD-10-WHO", "Gender", "Type of encounter", "Time restriction") and
  // rendered upper-case by CSS - match case-insensitively. There is no generic
  // "Attribute Filter" / "Value Filter" tab.
  public openTab(tab: string) {
    numConceptFilter.openEditorTab(resolve(tab))
  }

  // A criterium with no timeRestriction/attribute/value filter renders no tab bar at all.
  public shouldHaveNoFilterTabs() {
    cy.get('num-filter-tabs, .tabs-container, .header-col-chips').should('exist')
    cy.get('.tab').should('not.exist')
  }

  public shouldShowNoFilterChips(criterium: string) {
    cy.get(`.container[data-cy="${criterium}"]`).find('.chip-container').should('not.exist')
  }

  // A concept filter chip shows the concept's DISPLAY text (not its code) under a block with
  // the filter's name, e.g. "ICD-10-WHO". The display text is the ontology's original, so
  // it can be German in the English UI when no English translation exists.
  public shouldShowFilterChip(criterium: string, chipText: string) {
    cy.get(`.container[data-cy="${resolve(criterium)}"]`)
      .find('.chip-container')
      .should('contain', resolve(chipText))
  }

  // The termcode editor (a criterium with several termcodes, e.g. from the bulk search) lists
  // one `.concept-item` per code, each with a "Remove" button; its tab disappears at one code.
  public shouldListTermcodes(codes: string) {
    const list = resolve(codes)
      .split(',')
      .map((code) => code.trim())
    cy.get('.concept-item').should('have.length', list.length)
    list.forEach((code) => cy.get('.concept-item').contains(code))
  }

  public removeTermcode(code: string) {
    cy.contains('.concept-item', resolve(code))
      .contains('button', t('FEASIBILITY.EDITOR.MODAL.REMOVE'))
      .click()
  }

  public shouldHaveTab(tab: string) {
    cy.contains('.tab', new RegExp(`^\\s*${label(tab)}\\s*$`, 'i')).should('exist')
  }

  public shouldHaveNoTab(tab: string) {
    cy.get('.tab').should('exist').and('not.contain.text', label(tab))
  }
}

export const criterionEditor = new CriterionEditor()

defineStep('I open the editor of the added criterium', () =>
  criterionEditor.openEditorOfAddedCriterium()
)
defineStep('I open the editor tab {string}', (tab: string) => criterionEditor.openTab(tab))
defineStep('the editor has no filter tabs', () => criterionEditor.shouldHaveNoFilterTabs())
defineStep('the criterium {string} shows no filter chips', (criterium: string) =>
  criterionEditor.shouldShowNoFilterChips(criterium)
)
defineStep(
  'the criterium {string} shows a filter chip for {string}',
  (criterium: string, chipText: string) => criterionEditor.shouldShowFilterChip(criterium, chipText)
)
defineStep('the editor lists the termcodes {string}', (codes: string) =>
  criterionEditor.shouldListTermcodes(codes)
)
defineStep('I remove the termcode {string} in the editor', (code: string) =>
  criterionEditor.removeTermcode(code)
)
defineStep('the editor has the tab {string}', (tab: string) => criterionEditor.shouldHaveTab(tab))
defineStep('the editor has no tab {string}', (tab: string) => criterionEditor.shouldHaveNoTab(tab))
