import { dataCy, dataCyOf } from '../dataCy'
import { defineStep } from '../defineStep'
import { materialSelect } from '../component-objects/MaterialSelect'
import { numFilterChips } from '../component-objects/NumFilterChips'

const COMPARISON_SELECT = 'num-quantity-comparision-select'

const NUM_QUANTITY_RANGE_NUM_VALUE_SELECT_INPUT = 'num-quantity-range num-value-select input'

/**
 * Every feature editing quantity value filter: comparator, value, unit, range.
 * */
export class QuantityFilter {
  /**
   * Pick comparator in comparison select.
   * */
  public selectComparator(option: string) {
    materialSelect.selectOptionByText(COMPARISON_SELECT, option)
  }

  /**
   * Pick unit in allowed-units select.
   * */
  public selectUnit(unit: string) {
    materialSelect.selectOptionByText('num-allowed-units', unit)
  }

  /**
   * `num-quantity-range` renders two `num-value-select` inputs, minimum first. Choose unit
   * before values: component validates, shows warning, only once unit set.
   * */
  public selectRange(min: number, max: number) {
    cy.get(NUM_QUANTITY_RANGE_NUM_VALUE_SELECT_INPUT).eq(0).clear().type(min.toString())
    cy.get(NUM_QUANTITY_RANGE_NUM_VALUE_SELECT_INPUT).eq(1).clear().type(max.toString())
  }

  /**
   * Assert range warning visible.
   * */
  public shouldShowRangeWarning(warning: string) {
    cy.get('num-quantity-range .warning').should('be.visible').and('contain.text', warning)
  }

  /**
   * Open operator dropdown, compare options with comma-separated list, close it.
   * */
  public operatorShouldOffer(comparators: string) {
    cy.get(`${COMPARISON_SELECT} mat-select`).click()
    cy.get('.mat-mdc-option')
      .then(($options) => Array.from($options).map((o) => o.textContent.trim()))
      .should(
        'deep.equal',
        comparators.split(',').map((c) => c.trim())
      )
    cy.get('body').type('{esc}')
  }

  /**
   * Assert panel visible.
   * */
  public shouldSeePanel(panelName: string) {
    cy.get(dataCyOf(panelName, 'num-quantity')).should('be.visible')
  }

  /**
   * Assert comparator selected in panel.
   * */
  public shouldSeeSelectedInPanel(selected: string, panelName: string) {
    cy.get(dataCyOf(panelName, 'num-quantity')).within(() => {
      cy.get(COMPARISON_SELECT).contains(selected).should('be.visible')
    })
  }

  /**
   * `num-value-select` wraps plain `matInput`: target input directly. Host tag has no
   * dimensions, `.type()` needs focusable element.
   * */
  public selectValue(value: number) {
    cy.get('num-value-select input').clear().type(value.toString())
  }

  /**
   * Criterion page "Selected Filters" summary (criterion-header.component.html
   * `.header-col-chips`) fed by same `criterion()` to `EditCriterionService` round trip as
   * Feasibility Editor criteria list. Wait for it (Cypress retry, no fixed wait) before "Close":
   * rules out race where "Close" navigates before value filter propagated.
   * */
  public shouldSeeInFilterSummary(chipValue: string) {
    cy.get('.header-col-chips').contains(chipValue).should('be.visible')
  }

  /**
   * Assert cohort criteria list shows criterium with panel and chip.
   * */
  public shouldSeeInCohortCriteriaList(criterium: string, panelName: string, chipValue: string) {
    numFilterChips.getFilterChipBlock(criterium, panelName)
    /**
     * Scope by `.container`, real `data-cy` host (see NumFilterChips): value filter chip block can
     * share criterion exact `data-cy` value, so unscoped `[data-cy="..."]` is ambiguous.
     * */
    cy.get(dataCyOf(criterium, '.container')).within(() => {
      cy.get(dataCy('criterion-content')).should('contain', criterium).should('contain', chipValue)
    })
    numFilterChips.getFilterChipByName(criterium, chipValue, panelName)
  }
}

export const quantityFilter = new QuantityFilter()

defineStep('I select {string} from the panel with the name {string}', (option: string) =>
  quantityFilter.selectComparator(option)
)
defineStep('I select the unit {string}', (unit: string) => quantityFilter.selectUnit(unit))
defineStep('I select a minimum of {int} and a maximum of {int}', (min: number, max: number) =>
  quantityFilter.selectRange(min, max)
)
defineStep('I see the quantity range warning {string}', (warning: string) =>
  quantityFilter.shouldShowRangeWarning(warning)
)
defineStep(
  'the operator of the panel {string} offers {string}',
  (_panel: string, comparators: string) => quantityFilter.operatorShouldOffer(comparators)
)
defineStep('I see the panel with the name {string}', (panelName: string) =>
  quantityFilter.shouldSeePanel(panelName)
)
defineStep(
  'I should see {string} selected in the panel {string}',
  (selected: string, panelName: string) =>
    quantityFilter.shouldSeeSelectedInPanel(selected, panelName)
)
defineStep('I select a value of {int}', (value: number) => quantityFilter.selectValue(value))
defineStep('I should see {string} applied in the filter summary', (chipValue: string) =>
  quantityFilter.shouldSeeInFilterSummary(chipValue)
)
defineStep(
  'I should see {string} in the cohort criteria list with {string} and {string} selected',
  (criterium: string, panelName: string, chipValue: string) =>
    quantityFilter.shouldSeeInCohortCriteriaList(criterium, panelName, chipValue)
)
