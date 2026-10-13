import { defineStep } from '../defineStep'
import { numCheckbox } from '../component-objects/NumCheckbox'
import { numMenu } from '../component-objects/NumMenu'
import { Search } from './search.cy'
import { t } from '../i18n'

// The section is a {string}, not literal text in the pattern: Cucumber matches the pattern before
// `{{placeholders}}` are resolved. Keys are the English section labels (`labels.selected*`).
const CHIP_SECTIONS: Record<string, string> = {
  'Selected Fields': 'DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS',
  'Selected Filters': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_FILTER',
  'Selected Reference': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_REFERENCES',
}

export class DataSelectionSearch {
  public getTreeNodeByName(name: string, root: string) {
    cy.get(`[data-cy="${root}"]`)
      .should('be.visible')
      .within(() => {
        cy.get('.tree-node').click()
      })
    cy.get(`[data-cy="${name}"]`).contains(name).should('be.visible').click()
  }

  public getDataSelectionBoxByName(name: string) {
    cy.get(`[data-cy="${name}"]`).contains(name).should('be.visible')
  }

  public openMenuOnDataSelectionBox(name: string) {
    cy.get(`[data-cy="${name}"]`).within(() => {
      numMenu.open()
    })
  }

  public selectCheckboxByLabel(label: string) {
    cy.get(`[data-cy="${label}"]`).contains(label).should('be.visible').click()
  }

  // The profile header renders fields, filters and references as three `.header-col`
  // blocks, each a translated label above a `.header-col-chips` block. The section is
  // found by that label (from the app's own translation file), not by a CSS class.
  public getChip(sectionLabelKey: string, chipName: string) {
    cy.contains('.header-col', t(sectionLabelKey))
      .find('.header-col-chips')
      .within(() => {
        cy.get(`[data-cy="${chipName}"]`).contains(chipName).should('be.visible')
      })
  }

  // The header chips cap at 3 visible per group (`maxVisible` in num-filter-chips) and put
  // the rest in a "+N" tooltip, so a freshly selected field may have no chip of its own.
  // The editor's own selected-fields list always shows every selected field.
  public fieldShouldBeInSelectedList(field: string) {
    cy.get('.selected-fields-box .field-name').should('contain', field)
  }

  public chipShouldAppearInSection(chipName: string, section: string) {
    if (!CHIP_SECTIONS[section]) throw new Error(`Unknown section "${section}"`)
    this.getChip(CHIP_SECTIONS[section], chipName)
  }

  public selecteTabByName(tabName: string) {
    // The editor's main tabs are `div.tab` in `.tabs-container` (num-filter-tabs); nested
    // tab groups, such as the references' "Part of", are Material tabs.
    cy.contains('.tabs-container .tab, .mdc-tab__text-label', tabName, { matchCase: false })
      .should('be.visible')
      .click()
  }

  public searchForConcept(conceptName: string) {
    const searchInstance = new Search()
    cy.get('num-profile-filter').within(() => {
      searchInstance.typeInInputField(conceptName)
    })
  }

  public placeHolderBeVisible() {
    cy.get('.placeholder-box').should('be.visible')
  }

  public openReferenceModal() {
    cy.get('num-button').contains(' Add new reference ').should('be.visible').click()
  }

  public getReferenceModal() {
    cy.get('num-modal-window').should('be.visible')
  }

  public addReference(name: string) {
    cy.get('num-modal-window').within(() => {
      cy.get(`[data-cy="${name}"]`)
        .should('be.visible')
        .within(() => {
          numCheckbox.toggle()
        })
    })
  }

  public saveReference() {
    cy.get('num-modal-window').within(() => {
      cy.get('num-button').first().should('be.visible').click()
    })
  }
}

const dataSelectionSearch = new DataSelectionSearch()

defineStep(
  'I select the feature {string} from the root category {string}',
  (feature: string, root: string) => dataSelectionSearch.getTreeNodeByName(feature, root)
)
defineStep('I should see a data selection box labeled {string}', (name: string) =>
  dataSelectionSearch.getDataSelectionBoxByName(name)
)
defineStep('I click the edit button on the data selection box {string}', (name: string) =>
  dataSelectionSearch.openMenuOnDataSelectionBox(name)
)
defineStep('I select the checkbox labeled {string}', (label: string) =>
  dataSelectionSearch.selectCheckboxByLabel(label)
)
defineStep('the field {string} should be in the selected fields list', (field: string) =>
  dataSelectionSearch.fieldShouldBeInSelectedList(field)
)
defineStep('I click the {string} tab', (tabName: string) =>
  dataSelectionSearch.selecteTabByName(tabName)
)
defineStep('I enter {string} into the filter search field', (conceptName: string) =>
  dataSelectionSearch.searchForConcept(conceptName)
)
defineStep('I should see the placeholder', () => dataSelectionSearch.placeHolderBeVisible())
defineStep('I click to add a new reference', () => dataSelectionSearch.openReferenceModal())
defineStep('the reference modal should be displayed', () => dataSelectionSearch.getReferenceModal())
defineStep('I add a reference named {string}', (name: string) =>
  dataSelectionSearch.addReference(name)
)
defineStep('I add the reference', () => dataSelectionSearch.saveReference())
defineStep(
  'a chip labeled {string} should appear in the {string} section',
  (chipName: string, section: string) =>
    dataSelectionSearch.chipShouldAppearInSection(chipName, section)
)
