import { defineStep } from '../defineStep'
import { t } from '../i18n'

/**
 * Steps for the tabs of the profile editor (`query-editor/feature/:id`) that the data selection
 * opens: Fields, Code Filter, Time restriction and Information. Opening a tab, selecting a field
 * or a concept and the chip assertions reuse the steps of `dataSelectionSearch.cy.ts` and
 * `conceptFilter.cy.ts`; only what they lack is here.
 */
defineStep('the field {string} should not be in the selected fields list', (field: string) => {
  cy.get('.selected-fields-box').should('be.visible')
  cy.get('.selected-fields-box .field-name').should('not.contain', field)
})

const HEADER_SECTIONS: Record<string, string> = {
  'Selected Fields': 'DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS',
  'Selected Filters': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_FILTER',
  'Selected Reference': 'DATASELECTION.EDITOR.DISPLAY.APPLIED_REFERENCES',
}
defineStep('no chip labeled {string} should appear in the {string} section', (chipName: string, section: string) => {
  if (!HEADER_SECTIONS[section]) throw new Error(`Unknown section "${section}"`)
  cy.contains('.header-col', t(HEADER_SECTIONS[section])).find(`.header-col-chips [data-cy="${chipName}"]`).should('not.exist')
})

defineStep('the information tab explains {string}', (title: string) => {
  cy.get('.information-templates num-information-section').contains(title).should('be.visible')
})

/**
 * The "Mark as required" panel on the right of the Fields tab (`.selected-fields-box`): one row per
 * selected field with a checkbox (required) and an X (remove from the selection). The header's
 * "Selected fields" column groups the chips into a Required and an Optional `.filter-wrapper`.
 */
const panelRow = (field: string) =>
  cy.get('.selected-fields-box .selected-filter-container').filter((_, row) => row.querySelector('.field-name')?.textContent?.trim() === field)

defineStep('I toggle the required option of the field {string}', (field: string) => {
  panelRow(field).find('[data-cy="checkbox"]').click()
})

defineStep('the required option of the field {string} is {word}', (field: string, state: string) => {
  panelRow(field).find('[data-cy="checkbox"]').should('have.attr', 'aria-checked', String(state === 'enabled'))
})

defineStep('the selected field {string} is in the {string} group', (field: string, group: string) => {
  cy.contains('.header-col', t('DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS'))
    .find(`.filter-wrapper:has(.block[data-cy="${group}"]) .chip-container[data-cy="${field}"]`)
    .should('be.visible')
})

defineStep('I remove the field {string} from the selected fields list', (field: string) => {
  panelRow(field).find('.delete-button').click()
})

defineStep('the field {string} is not ticked in the fields list', (field: string) => {
  cy.get(`num-tree [data-cy="${field}"]`).first().find('[data-cy="checkbox"]').first().should('have.attr', 'aria-checked', 'false')
})

/**
 * The header's "Selected fields" column shows 3 chips per group, the rest sits behind a "+N" badge
 * whose tooltip lists them — a newly ticked field usually lands there, so look in both places.
 */
defineStep('the header lists the selected field {string}', (field: string) => {
  const column = () => cy.contains('.header-col', t('DATASELECTION.EDITOR.DISPLAY.SELECTED_FIELDS')).find('.header-col-chips')
  column().find('.chip-container').should('exist')
  column().then(($chips) => {
    if ($chips.find(`.chip-container[data-cy="${field}"]`).length) return
    cy.wrap($chips.find('.count-badge')).each(($badge) => cy.wrap($badge).trigger('mouseenter'))
    cy.get('.mat-mdc-tooltip').should('contain', field)
  })
})
