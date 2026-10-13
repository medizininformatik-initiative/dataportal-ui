import { defineStep } from '../defineStep'
import { searchInstance } from './search.cy'
import { tableInstance } from './table.cy'
import de from '../../../src/assets/i18n/de.json'
import { t } from '../i18n'

/**
 * The "unresolved reference" warning of a data selection box.
 *
 * A profile reference field the ontology marks `recommended` (here `ReferenzPrimaerdiagnose` on the
 * Condition profiles) shows a red warning until it is linked to another selected feature. The box
 * and its reference tile are siblings under `num-data-selection-boxes`, so the tile is found from
 * the box's parent. Clicking the warning opens the profile editor on that reference's tab.
 */
export class DataSelectionUnresolvedReference {
  private box(name: string) {
    return cy.get(`.selection-box[data-cy="${name}"]`).should('be.visible')
  }

  private tile(name: string) {
    return this.box(name).parent().find('num-profile-reference-tile')
  }

  private notLinked() {
    return t('SHARED_COMPONENTS.REFERENCE_TILE.NOT_LINKED')
  }

  // The "Required" checkbox is the only checkbox in a linked reference tile.
  private required(field: string, name: string) {
    return this.tile(name)
      .contains(field)
      .closest('num-profile-reference-tile')
      .find('[data-cy="checkbox"]')
  }

  public addFeature(feature: string) {
    searchInstance.typeInInputField(feature)
    tableInstance.selectCheckboxInRow(feature)
    cy.contains('button', t('DATASELECTION.SEARCH.ACTION_BAR.ADD'), { matchCase: false }).click()
  }

  public boxShouldWarnAbout(name: string, field: string) {
    this.tile(name).should('contain.text', field).and('contain.text', this.notLinked())
  }

  public boxShouldHaveNoWarning(name: string) {
    this.box(name).parent().find('.warning-message').should('not.exist')
  }

  public clickWarning(name: string) {
    this.tile(name).find('.warning-message').contains(this.notLinked()).click()
  }

  public tabShouldBeActive(field: string) {
    cy.get('.mdc-tab--active').should('contain.text', field)
  }

  public linkToFeature(feature: string) {
    cy.contains('num-selectable-reference-tile', feature).find('[data-cy="checkbox"]').click()
  }

  public boxShouldShowReferenceLinkedTo(name: string, field: string, target: string) {
    this.tile(name)
      .should('contain.text', field)
      .and('contain.text', t('SHARED_COMPONENTS.REFERENCE_TILE.LINKED_FEATURES_LABEL'))
      .and('contain.text', target)
      .and('not.contain.text', this.notLinked())
  }

  public removeReference(field: string, name: string) {
    this.tile(name).contains(field).closest('num-profile-reference-tile').find('.actions').click()
  }

  public unlinkFromFeature(feature: string) {
    const checkbox = () =>
      cy.contains('num-selectable-reference-tile', feature).find('[data-cy="checkbox"]')
    checkbox().should('have.attr', 'aria-checked', 'true')
    checkbox().click()
    // The click re-renders the tile, so the state is read from a fresh lookup, not chained.
    checkbox().should('have.attr', 'aria-checked', 'false')
  }

  public toggleRequired(field: string, name: string) {
    this.required(field, name).click()
  }

  public requiredShouldBe(field: string, name: string, state: string) {
    this.required(field, name).should('have.attr', 'aria-checked', String(state === 'enabled'))
  }

  public boxShouldWarnInGerman(name: string) {
    this.tile(name).should('contain.text', de.SHARED_COMPONENTS.REFERENCE_TILE.NOT_LINKED)
  }
}

export const dataSelectionUnresolvedReference = new DataSelectionUnresolvedReference()

defineStep('I add the feature {string} to the data selection', (feature: string) =>
  dataSelectionUnresolvedReference.addFeature(feature)
)
defineStep(
  'the data selection box {string} warns about the unresolved reference {string}',
  (name: string, field: string) => dataSelectionUnresolvedReference.boxShouldWarnAbout(name, field)
)
defineStep('the data selection box {string} has no unresolved reference warning', (name: string) =>
  dataSelectionUnresolvedReference.boxShouldHaveNoWarning(name)
)
defineStep(
  'I click the unresolved reference warning of the data selection box {string}',
  (name: string) => dataSelectionUnresolvedReference.clickWarning(name)
)
defineStep('the reference tab {string} is active', (field: string) =>
  dataSelectionUnresolvedReference.tabShouldBeActive(field)
)
defineStep('I link the reference to the feature {string}', (feature: string) =>
  dataSelectionUnresolvedReference.linkToFeature(feature)
)
defineStep(
  'the data selection box {string} shows the reference {string} linked to {string}',
  (name: string, field: string, target: string) =>
    dataSelectionUnresolvedReference.boxShouldShowReferenceLinkedTo(name, field, target)
)
defineStep(
  'I remove the reference {string} of the data selection box {string}',
  (field: string, name: string) => dataSelectionUnresolvedReference.removeReference(field, name)
)
defineStep('I unlink the reference from the feature {string}', (feature: string) =>
  dataSelectionUnresolvedReference.unlinkFromFeature(feature)
)
defineStep(
  'I toggle the required option of the reference {string} in the data selection box {string}',
  (field: string, name: string) => dataSelectionUnresolvedReference.toggleRequired(field, name)
)
defineStep(
  'the required option of the reference {string} in the data selection box {string} is {word}',
  (field: string, name: string, state: string) =>
    dataSelectionUnresolvedReference.requiredShouldBe(field, name, state)
)
defineStep(
  'the data selection box {string} shows the unresolved reference warning in German',
  (name: string) => dataSelectionUnresolvedReference.boxShouldWarnInGerman(name)
)
