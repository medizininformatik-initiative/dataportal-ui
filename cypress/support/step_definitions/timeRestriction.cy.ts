import { defineStep } from '../defineStep'
import {
  TimeRestrictionFilterType,
  TimeRestrictionFilterTypeDE,
} from '../../e2e/Utilities/timeRestrictionFilter'

/**
 * Steps for time restriction filter: comparators, between, date assertions.
 * */
export class TimeRestriction {
  /**
   * Open Time restriction tab, pick comparator type, type date, blur.
   * */
  public addTimeRestriction(
    date: string,
    type: TimeRestrictionFilterType | TimeRestrictionFilterTypeDE
  ) {
    /**
     * Criteria with several filter tabs (e.g. Procedure also supporting References) do not default
     * to Time Restriction tab: "Appendectomy" opened on "References", confirmed by screenshot.
     * Click is harmless no-op when it is only or active tab.
     * */
    cy.contains('.tab', 'Time restriction').click()
    /**
     * `num-timerestriction-type-selector` renders native `<select>`, not Material `mat-select`
     * (read from timerestriction-type-selector.component.html). `.select()` picks by option
     * `value` attribute: `TimeRestrictionFilterType` values match real app enum exactly.
     * */
    cy.get('num-timerestriction-type-selector select').select(type)
    /**
     * Datepicker commits (`dateChange`) on blur: blur here. Without it filter stays unapplied,
     * header chip missing, until next click blurs input.
     * */
    cy.get('.mat-datepicker-input').clear().type(date).should('have.value', date).blur()
  }

  /**
   * Set BETWEEN range. Renders two date inputs (num-between-filter). App emits only once both
   * set AND first < second, else shows date warning: type earlier date first.
   * */
  public addBetweenTimeRestriction(startDate: string, endDate: string) {
    cy.contains('.tab', 'Time restriction').click()
    cy.get('num-timerestriction-type-selector select').select(TimeRestrictionFilterType.Between)
    cy.get('num-between-filter .mat-datepicker-input')
      .eq(0)
      .clear()
      .type(startDate)
      .should('have.value', startDate)
    cy.get('num-between-filter .mat-datepicker-input')
      .eq(1)
      .clear()
      .type(endDate)
      .should('have.value', endDate)
      /**
       * Datepicker commits (`dateChange`) on blur, order check runs on that event: blur here, not on
       * next click.
       * */
      .blur()
  }

  /**
   * Assert BETWEEN date warning visible.
   * */
  public shouldShowBetweenWarning(warning: string) {
    cy.get('num-between-filter .date-warning').should('be.visible').and('contain.text', warning)
  }

  /**
   * Assert single datepicker value.
   * */
  public dateShouldBe(date: string) {
    cy.get('.mat-datepicker-input').should(($input) => expectDate($input, date))
  }

  /**
   * Assert both BETWEEN datepicker values.
   * */
  public datesShouldBe(startDate: string, endDate: string) {
    cy.get('num-between-filter .mat-datepicker-input').should(($inputs) => {
      expectDate($inputs.eq(0), startDate)
      expectDate($inputs.eq(1), endDate)
    })
  }
}

/**
 * Date picker shows dates without leading zeros: 04.04.2045 shows as 4.4.2045.
 * */
const plainDate = (d: string) => d.replace(/\b0(\d)/g, '$1')
/**
 * Compare input value with expected date, ignoring leading zeros.
 * */
const expectDate = (input: JQuery<HTMLElement>, date: string) =>
  expect(plainDate(String(input.val()))).to.eq(plainDate(date))

export const timeRestriction = new TimeRestriction()
defineStep('I set the time restriction to before with date {string}', (date: string) =>
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.Before)
)
defineStep('I set the time restriction to at with date {string}', (date: string) =>
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.On)
)
defineStep('I set the time restriction to after with date {string}', (date: string) =>
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.After)
)
/**
 * Deliberately unimplemented, unused by current scenarios (see cypress/CLAUDE.md). Gherkin
 * against it would pass asserting nothing until body is filled.
 * */
defineStep('I set the time restriction to equal with date {string}', (_date: string) => {})
defineStep(
  'I set the time restriction to between {string} and {string}',
  (startDate: string, endDate: string) =>
    timeRestriction.addBetweenTimeRestriction(startDate, endDate)
)
defineStep('I see the time restriction warning {string}', (warning: string) =>
  timeRestriction.shouldShowBetweenWarning(warning)
)
defineStep('the time restriction date is {string}', (date: string) =>
  timeRestriction.dateShouldBe(date)
)
defineStep(
  'the time restriction dates are {string} and {string}',
  (startDate: string, endDate: string) => timeRestriction.datesShouldBe(startDate, endDate)
)
