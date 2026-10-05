import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { materialSelect } from '../../support/component-objects/MaterialSelect'
import { numFilterChips } from '../../support/component-objects/NumFilterChips'

export class CohortEdit {
  public shouldSeePanelWithName(panelName: string) {
    cy.get(`[data-cy="${panelName}"]`).should('be.visible')
  }

  public shouldSeeSelectedInPanel(selected: string, panelName: string) {
    cy.get(`[data-cy="${panelName}"]`).within(() => {
      cy.get('num-quantity-comparision-select').contains(selected).should('be.visible')
    })
  }

  public selectFromPanelByName(option: string) {
    materialSelect.selectOptionByText('num-quantity-comparision-select', option)
  }

  public shouldSeeCriteriumInListWithSelected(
    criterium: string,
    panelName: string,
    chipValue: string
  ) {
    numFilterChips.getFilterChipBlock(criterium, panelName)
    // Scoped by .container (the actual data-cy host — see NumFilterChips),
    // not just the data-cy value — a value filter's chip block can share
    // its criterion's exact data-cy value, which makes an unscoped
    // `[data-cy="..."]` ambiguous here too.
    // The box itself, not `criterion-content`: the chips render in the box's own
    // filter section, a sibling of the content block, not inside it.
    cy.get(`.container[data-cy="${criterium}"]`).should('contain', criterium).and('contain', chipValue)
    numFilterChips.getFilterChipByName(criterium, chipValue, panelName)
  }

  public selectValue(value: string) {
    // num-value-select wraps a plain matInput — target it directly rather
    // than the host tag (host has no styling/dimensions of its own, and
    // .type() needs the actual focusable element).
    cy.get('num-value-select input').clear().type(value)
  }

  public selectUnit(unit: string) {
    materialSelect.selectOptionByText('num-allowed-units', unit)
  }

  /**
   * Asserts the criterion page's own "Selected Filters" summary
   * (criterion-header.component.html's `.header-col-chips`) reflects the
   * value just entered, before navigating away with "Close". The summary is
   * driven by the same `criterion()` input → EditCriterionService round trip
   * as the Feasibility Editor's own criteria-box list, so waiting for it
   * here (Cypress's normal retry, not a fixed wait) rules out a race where
   * "Close" navigates before that round trip has propagated — confirmed
   * necessary: without this, the value filter intermittently didn't survive
   * the trip back to the Feasibility Editor page.
   */
  public shouldSeeChipValueInFilterSummary(chipValue: string) {
    cy.get('.header-col-chips').contains(chipValue).should('be.visible')
  }
}

export const cohortEdit = new CohortEdit()

defineStep('I see the panel with the name {string}', (panelName: string) =>
  cohortEdit.shouldSeePanelWithName(panelName)
)
defineStep(
  'I should see {string} selected in the panel {string}',
  (selected: string, panelName: string) => cohortEdit.shouldSeeSelectedInPanel(selected, panelName)
)
defineStep('I select {string} from the panel with the name {string}', (option: string) =>
  cohortEdit.selectFromPanelByName(option)
)
defineStep('I select a value of {int}', (value: number) => cohortEdit.selectValue(value.toString()))
defineStep('I select the unit {string}', (unit: string) => cohortEdit.selectUnit(unit))
defineStep('I should see {string} applied in the filter summary', (chipValue: string) =>
  cohortEdit.shouldSeeChipValueInFilterSummary(chipValue)
)
defineStep(
  'I should see {string} in the cohort criteria list with {string} and {string} selected',
  (criterium: string, panelName: string, chipValue: string) =>
    cohortEdit.shouldSeeCriteriumInListWithSelected(criterium, panelName, chipValue)
)
