import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numCheckbox } from '../component-objects/NumCheckbox'
import { t } from '../i18n'

/**
 * Steps for the "Only if referenced" option of a data selection box (issue #641).
 *
 * The option is `num-reference-col`, rendered only in the box of a profile that another
 * selected profile references. A regression in `isReferenced` (a shadowed variable made it
 * never true) removed the option entirely, so existence is asserted, not just toggling.
 * A box is found by the profile name on `.selection-box[data-cy]`; the reference chips in
 * other boxes carry the same `data-cy` text, so the class keeps the lookup unambiguous.
 */
const box = (name: string) => cy.get(`.selection-box[data-cy="${name}"]`).should('be.visible')

const optionLabel = () => t('DATASELECTION.EDITOR.DISPLAY.REFERENCE')

defineStep('the data selection box {string} offers the "Only if referenced" option', (name: string) => {
  box(name).find('num-reference-col').should('be.visible').and('contain.text', optionLabel())
})

defineStep('the data selection box {string} does not offer the "Only if referenced" option', (name: string) => {
  box(name).find('num-reference-col').should('not.exist')
})

defineStep('I toggle the "Only if referenced" option of the data selection box {string}', (name: string) => {
  box(name)
    .find('num-reference-col')
    .within(() => numCheckbox.toggle())
})

defineStep('the "Only if referenced" option of the data selection box {string} is {word}', (name: string, state: string) => {
  box(name)
    .find('num-reference-col [data-cy="checkbox"]')
    .should('have.attr', 'aria-checked', String(state === 'enabled'))
})
