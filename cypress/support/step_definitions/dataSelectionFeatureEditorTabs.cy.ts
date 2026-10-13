import { defineStep } from '../defineStep'
import { t } from '../i18n'

const HEADER_SECTIONS: Record<string, string> = {
  'Selected Fields': 'DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS',
  'Selected Filters': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_FILTER',
  'Selected Reference': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_REFERENCES',
}

/**
 * Tabs of profile editor (`query-editor/feature/:id`) opened by data selection: Fields, Code
 * Filter, Time restriction, Information. Opening tab, selecting field or concept and chip
 * assertions reuse steps of `dataSelectionSearch.cy.ts` and `conceptFilter.cy.ts`. Only
 * missing parts live here.
 * */
export class DataSelectionFeatureEditorTabs {
  /**
   * Panel "Mark as required" right of Fields tab (`.selected-fields-box`): one row per selected
   * field, checkbox (required) and X (remove from selection). Header column "Selected fields"
   * groups chips into Required and Optional `.filter-wrapper`.
   * */
  private panelRow(field: string) {
    return cy
      .get('.selected-fields-box .selected-filter-container')
      .filter((_, row) => row.querySelector('.field-name')?.textContent?.trim() === field)
  }

  /**
   * Assert field absent from selected-fields list.
   * */
  public fieldShouldNotBeInSelectedList(field: string) {
    cy.get('.selected-fields-box').should('be.visible')
    cy.get('.selected-fields-box .field-name').should('not.contain', field)
  }

  /**
   * Assert header section has no chip `chipName`.
   * */
  public noChipShouldAppearInSection(chipName: string, section: string) {
    if (!HEADER_SECTIONS[section]) throw new Error(`Unknown section "${section}"`)
    cy.contains('.header-col', t(HEADER_SECTIONS[section]))
      .find(`.header-col-chips [data-cy="${chipName}"]`)
      .should('not.exist')
  }

  /**
   * Assert information tab explains `title`.
   * */
  public informationShouldExplain(title: string) {
    cy.get('.information-templates num-information-section').contains(title).should('be.visible')
  }

  /**
   * Toggle required checkbox of field.
   * */
  public toggleRequired(field: string) {
    this.panelRow(field).find('[data-cy="checkbox"]').click()
  }

  /**
   * Assert required option of field enabled or disabled.
   * */
  public requiredShouldBe(field: string, state: string) {
    this.panelRow(field)
      .find('[data-cy="checkbox"]')
      .should('have.attr', 'aria-checked', String(state === 'enabled'))
  }

  /**
   * Assert selected field sits in group.
   * */
  public selectedFieldShouldBeInGroup(field: string, group: string) {
    cy.contains('.header-col', t('DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS'))
      .find(`.filter-wrapper:has(.block[data-cy="${group}"]) .chip-container[data-cy="${field}"]`)
      .should('be.visible')
  }

  /**
   * Remove field from selected-fields list.
   * */
  public removeSelectedField(field: string) {
    this.panelRow(field).find('.delete-button').click()
  }

  /**
   * Assert field unticked in fields tree.
   * */
  public fieldShouldNotBeTicked(field: string) {
    cy.get(`num-tree [data-cy="${field}"]`)
      .first()
      .find('[data-cy="checkbox"]')
      .first()
      .should('have.attr', 'aria-checked', 'false')
  }

  /**
   * Header column "Selected fields" shows 3 chips per group, rest sits behind "+N" badge
   * tooltip. Newly ticked field usually lands there: look in both places.
   * */
  public headerShouldListSelectedField(field: string) {
    const column = () =>
      cy
        .contains('.header-col', t('DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS'))
        .find('.header-col-chips')
    column().find('.chip-container').should('exist')
    column().then(($chips) => {
      if ($chips.find(`.chip-container[data-cy="${field}"]`).length) return
      cy.wrap($chips.find('.count-badge')).each(($badge) => cy.wrap($badge).trigger('mouseenter'))
      cy.get('.mat-mdc-tooltip').should('contain', field)
    })
  }
}

export const dataSelectionFeatureEditorTabs = new DataSelectionFeatureEditorTabs()

defineStep('the field {string} should not be in the selected fields list', (field: string) =>
  dataSelectionFeatureEditorTabs.fieldShouldNotBeInSelectedList(field)
)
defineStep(
  'no chip labeled {string} should appear in the {string} section',
  (chipName: string, section: string) =>
    dataSelectionFeatureEditorTabs.noChipShouldAppearInSection(chipName, section)
)
defineStep('the information tab explains {string}', (title: string) =>
  dataSelectionFeatureEditorTabs.informationShouldExplain(title)
)
defineStep('I toggle the required option of the field {string}', (field: string) =>
  dataSelectionFeatureEditorTabs.toggleRequired(field)
)
defineStep('the required option of the field {string} is {word}', (field: string, state: string) =>
  dataSelectionFeatureEditorTabs.requiredShouldBe(field, state)
)
defineStep('the selected field {string} is in the {string} group', (field: string, group: string) =>
  dataSelectionFeatureEditorTabs.selectedFieldShouldBeInGroup(field, group)
)
defineStep('I remove the field {string} from the selected fields list', (field: string) =>
  dataSelectionFeatureEditorTabs.removeSelectedField(field)
)
defineStep('the field {string} is not ticked in the fields list', (field: string) =>
  dataSelectionFeatureEditorTabs.fieldShouldNotBeTicked(field)
)
defineStep('the header lists the selected field {string}', (field: string) =>
  dataSelectionFeatureEditorTabs.headerShouldListSelectedField(field)
)
