import { dataCyOf } from '../dataCy'
import { defineStep } from '../defineStep'
import { numMenu } from '../component-objects/NumMenu'
import { Search } from './search.cy'
import { t } from '../i18n'

/**
 * Section is `{string}`, not literal pattern text: Cucumber matches pattern before
 * `{{placeholders}}` resolve. Keys = English section labels (`labels.selected*`).
 * */
const CHIP_SECTIONS: Record<string, string> = {
  'Selected Fields': 'DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS',
  'Selected Filters': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_FILTER',
  'Selected Reference': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_REFERENCES',
}

/**
 * Steps for data selection search: tree, boxes, tabs, chips, reference add list.
 * */
export class DataSelectionSearch {
  /**
   * Expand root category, click feature node.
   * */
  public getTreeNodeByName(name: string, root: string) {
    cy.get(dataCyOf(root, '.divider'))
      .should('be.visible')
      .within(() => {
        cy.get('.tree-node').click()
      })
    cy.get(dataCyOf(name, '.divider')).contains(name).should('be.visible').click()
  }

  /**
   * Assert data selection box visible.
   * */
  public getDataSelectionBoxByName(name: string) {
    cy.get(dataCyOf(name, '.selection-box')).contains(name).should('be.visible')
  }

  /**
   * Open menu of data selection box.
   * */
  public openMenuOnDataSelectionBox(name: string) {
    cy.get(dataCyOf(name, '.selection-box')).within(() => {
      numMenu.open()
    })
  }

  /**
   * Click checkbox by label.
   * */
  public selectCheckboxByLabel(label: string) {
    cy.get(dataCyOf(label, '.divider')).contains(label).should('be.visible').click()
  }

  /**
   * Profile header renders fields, filters, references as three `.header-col` blocks: translated
   * label above `.header-col-chips`. Find section by label (app translation file), not CSS
   * class.
   * */
  public getChip(sectionLabelKey: string, chipName: string) {
    cy.contains('.header-col', t(sectionLabelKey))
      .find('.header-col-chips')
      .within(() => {
        cy.get(dataCyOf(chipName, '.chip-container')).contains(chipName).should('be.visible')
      })
  }

  /**
   * Header chips cap at 3 visible per group (`maxVisible` in num-filter-chips), rest in "+N"
   * tooltip: freshly selected field may lack own chip. Editor selected-fields list always shows
   * every selected field.
   * */
  public fieldShouldBeInSelectedList(field: string) {
    cy.get('.selected-fields-box .field-name').should('contain', field)
  }

  /**
   * Assert chip appears in named section.
   * */
  public chipShouldAppearInSection(chipName: string, section: string) {
    if (!CHIP_SECTIONS[section]) throw new Error(`Unknown section "${section}"`)
    this.getChip(CHIP_SECTIONS[section], chipName)
  }

  /**
   * Click editor tab. Main tabs are `div.tab` in `.tabs-container` (num-filter-tabs). Nested tab
   * groups, e.g. references "Part of", are Material tabs.
   * */
  public selecteTabByName(tabName: string) {
    /**
     * Main editor tabs are `div.tab` in `.tabs-container` (num-filter-tabs). Nested tab groups,
     * e.g. references "Part of", are Material tabs.
     * */
    cy.contains('.tabs-container .tab, .mdc-tab__text-label', tabName, { matchCase: false })
      .should('be.visible')
      .click()
  }

  /**
   * Type concept into profile filter search.
   * */
  public searchForConcept(conceptName: string) {
    const searchInstance = new Search()
    cy.get('num-profile-filter').within(() => {
      searchInstance.typeInInputField(conceptName)
    })
  }

  /**
   * Assert empty text of linked-features panel visible: no feature of data selection fits yet.
   * */
  public placeHolderBeVisible() {
    cy.get('.linked-panel .panel-empty').should('be.visible')
  }

  /**
   * Add feature type as new reference: row of add list (`.add-row`, `data-cy` = type name) is
   * button. One click loads profile, adds it to data selection, links it. No dialog.
   * */
  public addReference(name: string) {
    cy.get(dataCyOf(name, '.add-row')).should('be.visible').click()
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
defineStep('I add a reference named {string}', (name: string) =>
  dataSelectionSearch.addReference(name)
)
defineStep(
  'a chip labeled {string} should appear in the {string} section',
  (chipName: string, section: string) =>
    dataSelectionSearch.chipShouldAppearInSection(chipName, section)
)
