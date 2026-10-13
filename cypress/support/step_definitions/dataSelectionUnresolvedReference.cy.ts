import { defineStep } from '../defineStep'
import { searchInstance } from './search.cy'
import { tableInstance } from './table.cy'
import de from '../../../src/assets/i18n/de.json'
import { t } from '../i18n'

/**
 * Warning "Unresolved reference" of data selection box. Profile reference field marked
 * `recommended` by ontology (here `ReferenzPrimaerdiagnose` on Condition profiles) shows red
 * warning until linked to another selected feature. Box and reference tile are siblings under
 * `num-data-selection-boxes`: find tile from box parent. Click on warning opens profile editor
 * on that reference tab.
 * */
export class DataSelectionUnresolvedReference {
  /**
   * Find visible selection box by profile name.
   * */
  private box(name: string) {
    return cy.get(`.selection-box[data-cy="${name}"]`).should('be.visible')
  }

  /**
   * Find reference tile of box, sibling of box.
   * */
  private tile(name: string) {
    return this.box(name).parent().find('num-profile-reference-tile')
  }

  /**
   * Translated "not linked" label.
   * */
  private notLinked() {
    return t('SHARED_COMPONENTS.REFERENCE_TILE.NOT_LINKED')
  }

  /**
   * Checkbox "Required" is only checkbox in linked reference tile.
   * */
  private required(field: string, name: string) {
    return this.tile(name)
      .contains(field)
      .closest('num-profile-reference-tile')
      .find('[data-cy="checkbox"]')
  }

  /**
   * Search feature, tick it, click Add.
   * */
  public addFeature(feature: string) {
    searchInstance.typeInInputField(feature)
    tableInstance.selectCheckboxInRow(feature)
    cy.contains('button', t('DATASELECTION.SEARCH.ACTION_BAR.ADD'), { matchCase: false }).click()
  }

  /**
   * Assert box warns about unresolved reference field.
   * */
  public boxShouldWarnAbout(name: string, field: string) {
    this.tile(name).should('contain.text', field).and('contain.text', this.notLinked())
  }

  /**
   * Assert box shows no warning.
   * */
  public boxShouldHaveNoWarning(name: string) {
    this.box(name).parent().find('.warning-message').should('not.exist')
  }

  /**
   * Click unresolved-reference warning of box.
   * */
  public clickWarning(name: string) {
    this.tile(name).find('.warning-message').contains(this.notLinked()).click()
  }

  /**
   * Assert reference tab active.
   * */
  public tabShouldBeActive(field: string) {
    cy.get('.mdc-tab--active').should('contain.text', field)
  }

  /**
   * Tick feature in reference tile to link it.
   * */
  public linkToFeature(feature: string) {
    cy.contains('num-selectable-reference-tile', feature).find('[data-cy="checkbox"]').click()
  }

  /**
   * Assert reference linked to target, no warning left.
   * */
  public boxShouldShowReferenceLinkedTo(name: string, field: string, target: string) {
    this.tile(name)
      .should('contain.text', field)
      .and('contain.text', t('SHARED_COMPONENTS.REFERENCE_TILE.LINKED_FEATURES_LABEL'))
      .and('contain.text', target)
      .and('not.contain.text', this.notLinked())
  }

  /**
   * Click remove action of reference tile.
   * */
  public removeReference(field: string, name: string) {
    this.tile(name).contains(field).closest('num-profile-reference-tile').find('.actions').click()
  }

  /**
   * Untick feature in reference tile. Click re-renders tile: read state from fresh lookup, not
   * chained.
   * */
  public unlinkFromFeature(feature: string) {
    const checkbox = () =>
      cy.contains('num-selectable-reference-tile', feature).find('[data-cy="checkbox"]')
    checkbox().should('have.attr', 'aria-checked', 'true')
    checkbox().click()
    /**
     * Click re-renders tile: read state from fresh lookup, not chained.
     * */
    checkbox().should('have.attr', 'aria-checked', 'false')
  }

  /**
   * Toggle required checkbox of reference.
   * */
  public toggleRequired(field: string, name: string) {
    this.required(field, name).click()
  }

  /**
   * Assert required option of reference enabled or disabled.
   * */
  public requiredShouldBe(field: string, name: string, state: string) {
    this.required(field, name).should('have.attr', 'aria-checked', String(state === 'enabled'))
  }

  /**
   * Assert warning shown in German.
   * */
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
