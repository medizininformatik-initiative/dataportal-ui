import { defineStep } from '../defineStep'
import { numCheckbox } from '../component-objects/NumCheckbox'
import { t } from '../i18n'

/**
 * The "Only if referenced" option of a data selection box (issue #641).
 *
 * The option is `num-reference-col`, rendered only in the box of a profile that another
 * selected profile references. A regression in `isReferenced` (a shadowed variable made it
 * never true) removed the option entirely, so existence is asserted, not just toggling.
 * A box is found by the profile name on `.selection-box[data-cy]`; the reference chips in
 * other boxes carry the same `data-cy` text, so the class keeps the lookup unambiguous.
 */
export class DataSelectionOnlyIfReferenced {
  private box(name: string) {
    return cy.get(`.selection-box[data-cy="${name}"]`).should('be.visible')
  }

  public boxShouldOfferOption(name: string) {
    this.box(name)
      .find('num-reference-col')
      .should('be.visible')
      .and('contain.text', t('DATASELECTION.EDITOR.DISPLAY.REFERENCE'))
  }

  public boxShouldNotOfferOption(name: string) {
    this.box(name).find('num-reference-col').should('not.exist')
  }

  public toggleOption(name: string) {
    this.box(name)
      .find('num-reference-col')
      .within(() => numCheckbox.toggle())
  }

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
