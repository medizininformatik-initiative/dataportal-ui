import { defineStep } from '../defineStep'
import { searchInstance } from './search.cy'
import { tableInstance } from './table.cy'
import de from '../../../src/assets/i18n/de.json'
import { t } from '../i18n'

/**
 * Steps for the "unresolved reference" warning of a data selection box.
 *
 * A profile reference field the ontology marks `recommended` (here `ReferenzPrimaerdiagnose` on the
 * Condition profiles) shows a red warning until it is linked to another selected feature. The box
 * and its reference tile are siblings under `num-data-selection-boxes`, so the tile is found from
 * the box's parent. Clicking the warning opens the profile editor on that reference's tab.
 */
const box = (name: string) => cy.get(`.selection-box[data-cy="${name}"]`).should('be.visible')
const tile = (name: string) => box(name).parent().find('num-profile-reference-tile')
const notLinked = () => t('SHARED_COMPONENTS.REFERENCE_TILE.NOT_LINKED')

defineStep('I add the feature {string} to the data selection', (feature: string) => {
  searchInstance.typeInInputField(feature)
  tableInstance.selectCheckboxInRow(feature)
  cy.contains('button', t('DATASELECTION.SEARCH.ACTION_BAR.ADD'), { matchCase: false }).click()
})

defineStep('the data selection box {string} warns about the unresolved reference {string}', (name: string, field: string) => {
  tile(name).should('contain.text', field).and('contain.text', notLinked())
})

defineStep('the data selection box {string} has no unresolved reference warning', (name: string) => {
  box(name).parent().find('.warning-message').should('not.exist')
})

defineStep('I click the unresolved reference warning of the data selection box {string}', (name: string) => {
  tile(name).find('.warning-message').contains(notLinked()).click()
})

defineStep('the reference tab {string} is active', (field: string) => {
  cy.get('.mdc-tab--active').should('contain.text', field)
})

defineStep('I link the reference to the feature {string}', (feature: string) => {
  cy.contains('num-selectable-reference-tile', feature).find('[data-cy="checkbox"]').click()
})

defineStep('the data selection box {string} shows the reference {string} linked to {string}', (name: string, field: string, target: string) => {
  tile(name)
    .should('contain.text', field)
    .and('contain.text', t('SHARED_COMPONENTS.REFERENCE_TILE.LINKED_FEATURES_LABEL'))
    .and('contain.text', target)
    .and('not.contain.text', notLinked())
})

defineStep('I remove the reference {string} of the data selection box {string}', (field: string, name: string) => {
  tile(name).contains(field).closest('num-profile-reference-tile').find('.actions').click()
})

defineStep('I unlink the reference from the feature {string}', (feature: string) => {
  const checkbox = () => cy.contains('num-selectable-reference-tile', feature).find('[data-cy="checkbox"]')
  checkbox().should('have.attr', 'aria-checked', 'true')
  checkbox().click()
  // The click re-renders the tile, so the state is read from a fresh lookup, not chained.
  checkbox().should('have.attr', 'aria-checked', 'false')
})

// The "Required" checkbox is the only checkbox in a linked reference tile.
const required = (field: string, name: string) =>
  tile(name).contains(field).closest('num-profile-reference-tile').find('[data-cy="checkbox"]')

defineStep('I toggle the required option of the reference {string} in the data selection box {string}', (field: string, name: string) => {
  required(field, name).click()
})

defineStep('the required option of the reference {string} in the data selection box {string} is {word}', (field: string, name: string, state: string) => {
  required(field, name).should('have.attr', 'aria-checked', String(state === 'enabled'))
})

defineStep('the data selection box {string} shows the unresolved reference warning in German', (name: string) => {
  tile(name).should('contain.text', de.SHARED_COMPONENTS.REFERENCE_TILE.NOT_LINKED)
})
