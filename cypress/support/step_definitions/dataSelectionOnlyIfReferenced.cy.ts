import { defineStep } from '../defineStep'
import { numCheckbox } from '../component-objects/NumCheckbox'
import { t } from '../i18n'

/**
 * Option "Only if referenced" of data selection box (issue #641). Option is
 * `num-reference-col`, rendered only in box of profile referenced by another selected profile.
 * Regression in `isReferenced` (shadowed variable, never true) removed option entirely, so
 * assert existence, not only toggling. Find box by profile name on `.selection-box[data-cy]`:
 * reference chips in other boxes carry same `data-cy` text, class keeps lookup unambiguous.
 * */
export class DataSelectionOnlyIfReferenced {
  /**
   * Find visible selection box by profile name.
   * */
  private box(name: string) {
    return cy.get(`.selection-box[data-cy="${name}"]`).should('be.visible')
  }

  /**
   * Assert box offers option.
   * */
  public boxShouldOfferOption(name: string) {
    this.box(name)
      .find('num-reference-col')
      .should('be.visible')
      .and('contain.text', t('DATASELECTION.EDITOR.DISPLAY.REFERENCE'))
  }

  /**
   * Assert box lacks option.
   * */
  public boxShouldNotOfferOption(name: string) {
    this.box(name).find('num-reference-col').should('not.exist')
  }

  /**
   * Toggle option checkbox of box.
   * */
  public toggleOption(name: string) {
    this.box(name)
      .find('num-reference-col')
      .within(() => numCheckbox.toggle())
  }

  /**
   * Assert option enabled or disabled.
   * */
  public optionShouldBe(name: string, state: string) {
    this.box(name)
      .find('num-reference-col [data-cy="checkbox"]')
      .should('have.attr', 'aria-checked', String(state === 'enabled'))
  }
}

export const dataSelectionOnlyIfReferenced = new DataSelectionOnlyIfReferenced()

defineStep(
  'the data selection box {string} offers the {string} option',
  (name: string, _option: string) => dataSelectionOnlyIfReferenced.boxShouldOfferOption(name)
)
defineStep(
  'the data selection box {string} does not offer the {string} option',
  (name: string, _option: string) => dataSelectionOnlyIfReferenced.boxShouldNotOfferOption(name)
)
defineStep(
  'I toggle the {string} option of the data selection box {string}',
  (_option: string, name: string) => dataSelectionOnlyIfReferenced.toggleOption(name)
)
defineStep(
  'the {string} option of the data selection box {string} is {word}',
  (_option: string, name: string, state: string) =>
    dataSelectionOnlyIfReferenced.optionShouldBe(name, state)
)
