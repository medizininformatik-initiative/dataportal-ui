import { defineStep } from '../defineStep'
import { materialSelect } from '../component-objects/MaterialSelect'
import { numFilterChips } from '../component-objects/NumFilterChips'

// Steps for every feature that edits a quantity value filter (comparator, value, unit, range).
defineStep('I select {string} from the panel with the name {string}', (option: string) =>
  materialSelect.selectOptionByText('num-quantity-comparision-select', option)
)
defineStep('I select the unit {string}', (unit: string) =>
  materialSelect.selectOptionByText('num-allowed-units', unit)
)

// num-quantity-range renders two num-value-select inputs, minimum first. The unit must be chosen
// before the values: the component only validates (and shows its warning) once a unit is set.
defineStep('I select a minimum of {int} and a maximum of {int}', (min: number, max: number) => {
  cy.get('num-quantity-range num-value-select input').eq(0).clear().type(min.toString())
  cy.get('num-quantity-range num-value-select input').eq(1).clear().type(max.toString())
})

defineStep('I see the quantity range warning {string}', (warning: string) => {
  cy.get('num-quantity-range .warning').should('be.visible').and('contain.text', warning)
})

// Opens the operator dropdown, compares its options with the comma-separated list, and closes it.
defineStep('the operator of the panel {string} offers {string}', (_panel: string, comparators: string) => {
  cy.get('num-quantity-comparision-select mat-select').click()
  cy.get('.mat-mdc-option')
    .then(($options) => [...$options].map((o) => o.textContent.trim()))
    .should('deep.equal', comparators.split(',').map((c) => c.trim()))
  cy.get('body').type('{esc}')
})

defineStep('I see the panel with the name {string}', (panelName: string) => {
  cy.get(`[data-cy="${panelName}"]`).should('be.visible')
})

defineStep(
  'I should see {string} selected in the panel {string}',
  (selected: string, panelName: string) => {
    cy.get(`[data-cy="${panelName}"]`).within(() => {
      cy.get('num-quantity-comparision-select').contains(selected).should('be.visible')
    })
  }
)

// num-value-select wraps a plain matInput - target it directly rather than the host tag (the host
// has no dimensions of its own, and .type() needs the focusable element).
defineStep('I select a value of {int}', (value: number) => {
  cy.get('num-value-select input').clear().type(value.toString())
})

// The criterion page's own "Selected Filters" summary (criterion-header.component.html's
// `.header-col-chips`) is fed by the same criterion() -> EditCriterionService round trip as the
// Feasibility Editor's criteria list. Waiting for it (Cypress retries, no fixed wait) before "Close"
// rules out a race where "Close" navigates before the value filter has propagated.
defineStep('I should see {string} applied in the filter summary', (chipValue: string) => {
  cy.get('.header-col-chips').contains(chipValue).should('be.visible')
})

defineStep(
  'I should see {string} in the cohort criteria list with {string} and {string} selected',
  (criterium: string, panelName: string, chipValue: string) => {
    numFilterChips.getFilterChipBlock(criterium, panelName)
    // Scoped by .container (the actual data-cy host, see NumFilterChips): a value filter's chip block
    // can share its criterion's exact data-cy value, so an unscoped `[data-cy="..."]` is ambiguous.
    cy.get(`.container[data-cy="${criterium}"]`).within(() => {
      cy.get('[data-cy="criterion-content"]').should('contain', criterium).should('contain', chipValue)
    })
    numFilterChips.getFilterChipByName(criterium, chipValue, panelName)
  }
)
