import { dataCyOf } from '../dataCy'
import { resolve } from '../testData'
import { defineStep } from '../defineStep'
import { numConceptFilter } from '../component-objects/NumConceptFilter'
import { t } from '../i18n'
import { label } from '../labels'
import { numMenu } from '../component-objects/NumMenu'

const CHIP_CONTAINER = '.chip-container'
const CONCEPT_ITEM = '.concept-item'
const TAB = '.tab'

/**
 * Open editor of criterium added last. Switch top-level filter tabs, mirroring Criterion data
 * model: "Time restriction" (`timeRestriction`), "Attribute Filter" (`attributeFilters`),
 * "Value Filter" (`valueFilters`), "References".
 * */
export class CriterionEditor {
  /**
   * Open menu of added criterium, click Edit.
   * */
  public openEditorOfAddedCriterium() {
    numMenu.open()
    numMenu.clickItem(t('SHARED_COMPONENTS.MENU.EDIT') as never)
  }

  /**
   * Tabs are named after filter itself (English display of attribute or value, e.g.
   * "ICD-10-WHO", "Gender", "Type of encounter", "Time restriction"), upper-cased by CSS: match
   * case-insensitively. No generic "Attribute Filter" / "Value Filter" tab exists.
   * */
  public openTab(tab: string) {
    numConceptFilter.openEditorTab(resolve(tab))
  }

  /**
   * Criterium without timeRestriction, attribute or value filter renders no tab bar at all.
   * */
  public shouldHaveNoFilterTabs() {
    cy.get('num-filter-tabs, .tabs-container, .header-col-chips').should('exist')
    cy.get(TAB).should('not.exist')
  }

  /**
   * Assert criterium box shows no filter chips.
   * */
  public shouldShowNoFilterChips(criterium: string) {
    cy.get(dataCyOf(criterium, '.container')).find(CHIP_CONTAINER).should('not.exist')
  }

  /**
   * Concept filter chip shows concept DISPLAY text, not code, under block named after filter,
   * e.g. "ICD-10-WHO". Display text is ontology original: can be German in English UI when no
   * English translation exists.
   * */
  public shouldShowFilterChip(criterium: string, chipText: string) {
    cy.get(dataCyOf(resolve(criterium), '.container'))
      .find(CHIP_CONTAINER)
      .should('contain', resolve(chipText))
  }

  /**
   * Termcode editor (criterium with several termcodes, e.g. from bulk search) lists one
   * CONCEPT_ITEM per code, each with "Remove" button. Tab disappears at one code.
   * */
  public shouldListTermcodes(codes: string) {
    const list = resolve(codes)
      .split(',')
      .map((code) => code.trim())
    cy.get(CONCEPT_ITEM).should('have.length', list.length)
    list.forEach((code) => cy.get(CONCEPT_ITEM).contains(code))
  }

  /**
   * Remove termcode via its "Remove" button.
   * */
  public removeTermcode(code: string) {
    cy.contains(CONCEPT_ITEM, resolve(code))
      .contains('button', t('FEASIBILITY.EDITOR.MODAL.REMOVE'))
      .click()
  }

  /**
   * Assert editor has tab, case-insensitive.
   * */
  public shouldHaveTab(tab: string) {
    cy.contains(TAB, new RegExp(`^\\s*${label(tab)}\\s*$`, 'i')).should('exist')
  }

  /**
   * Assert editor lacks tab.
   * */
  public shouldHaveNoTab(tab: string) {
    cy.get(TAB).should('exist').and('not.contain.text', label(tab))
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
