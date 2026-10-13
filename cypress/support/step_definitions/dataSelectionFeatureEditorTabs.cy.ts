import { defineStep } from '../defineStep'
import { t } from '../i18n'

const HEADER_SECTIONS: Record<string, string> = {
  'Selected Fields': 'DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS',
  'Selected Filters': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_FILTER',
  'Selected Reference': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_REFERENCES',
}

/**
 * The tabs of the profile editor (`query-editor/feature/:id`) that the data selection
 * opens: Fields, Code Filter, Time restriction and Information. Opening a tab, selecting a field
 * or a concept and the chip assertions reuse the steps of `dataSelectionSearch.cy.ts` and
 * `conceptFilter.cy.ts`; only what they lack is here.
 */
export class DataSelectionFeatureEditorTabs {
  /**
   * The "Mark as required" panel on the right of the Fields tab (`.selected-fields-box`): one row per
   * selected field with a checkbox (required) and an X (remove from the selection). The header's
   * "Selected fields" column groups the chips into a Required and an Optional `.filter-wrapper`.
   */
  private panelRow(field: string) {
    return cy
      .get('.selected-fields-box .selected-filter-container')
      .filter((_, row) => row.querySelector('.field-name')?.textContent?.trim() === field)
  }

  public fieldShouldNotBeInSelectedList(field: string) {
    cy.get('.selected-fields-box').should('be.visible')
    cy.get('.selected-fields-box .field-name').should('not.contain', field)
  }

  public noChipShouldAppearInSection(chipName: string, section: string) {
    if (!HEADER_SECTIONS[section]) throw new Error(`Unknown section "${section}"`)
    cy.contains('.header-col', t(HEADER_SECTIONS[section]))
      .find(`.header-col-chips [data-cy="${chipName}"]`)
      .should('not.exist')
  }

  public informationShouldExplain(title: string) {
    cy.get('.information-templates num-information-section').contains(title).should('be.visible')
  }

  public toggleRequired(field: string) {
    this.panelRow(field).find('[data-cy="checkbox"]').click()
  }

  public requiredShouldBe(field: string, state: string) {
    this.panelRow(field)
      .find('[data-cy="checkbox"]')
      .should('have.attr', 'aria-checked', String(state === 'enabled'))
  }

  public selectedFieldShouldBeInGroup(field: string, group: string) {
    cy.contains('.header-col', t('DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS'))
      .find(`.filter-wrapper:has(.block[data-cy="${group}"]) .chip-container[data-cy="${field}"]`)
      .should('be.visible')
  }

  public removeSelectedField(field: string) {
    this.panelRow(field).find('.delete-button').click()
  }

  public fieldShouldNotBeTicked(field: string) {
    cy.get(`num-tree [data-cy="${field}"]`)
      .first()
      .find('[data-cy="checkbox"]')
      .first()
      .should('have.attr', 'aria-checked', 'false')
  }

  /**
   * The header's "Selected fields" column shows 3 chips per group, the rest sits behind a "+N" badge
   * whose tooltip lists them — a newly ticked field usually lands there, so look in both places.
   */
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
