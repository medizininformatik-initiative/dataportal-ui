import { defineStep } from '../defineStep'
import { expectDate, numBetweenFilter } from '../component-objects/NumBetweenFilter'
import {
  TimeRestrictionFilterType,
  TimeRestrictionFilterTypeDE,
} from '../../e2e/Utilities/timeRestrictionFilter'

const DATE_INPUT = '.mat-datepicker-input'

/**
 * Steps for time restriction filter: comparators, between, date assertions.
 * */
export class TimeRestriction {
  /**
   * Open Time restriction tab. No-op when it is only or active tab.
   * */
  private openTab() {
    cy.contains('.tab', 'Time restriction').click()
  }

  /**
   * Pick comparator type in native select.
   * */
  private pickType(type: TimeRestrictionFilterType | TimeRestrictionFilterTypeDE) {
    cy.get('num-timerestriction-type-selector select').select(type)
  }

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
    this.openTab()
    /**
     * `num-timerestriction-type-selector` renders native `<select>`, not Material `mat-select`
     * (read from timerestriction-type-selector.component.html). `.select()` picks by option
     * `value` attribute: `TimeRestrictionFilterType` values match real app enum exactly.
     * */
    this.pickType(type)
    /**
     * Datepicker commits (`dateChange`) on blur: blur here. Without it filter stays unapplied,
     * header chip missing, until next click blurs input.
     * */
    cy.get(DATE_INPUT).clear().type(date).should('have.value', date).blur()
  }

  /**
   * Set BETWEEN range. Renders two date inputs, see `NumBetweenFilter`.
   * */
  public addBetweenTimeRestriction(startDate: string, endDate: string) {
    this.openTab()
    this.pickType(TimeRestrictionFilterType.Between)
    numBetweenFilter.setRange(startDate, endDate)
  }

  /**
   * Assert BETWEEN date warning visible.
   * */
  public shouldShowBetweenWarning(warning: string) {
    numBetweenFilter.shouldShowWarning(warning)
  }

  /**
   * Assert single datepicker value.
   * */
  public dateShouldBe(date: string) {
    cy.get(DATE_INPUT).should(($input) => expectDate($input, date))
  }

  /**
   * Assert both BETWEEN datepicker values.
   * */
  public datesShouldBe(startDate: string, endDate: string) {
    numBetweenFilter.shouldHaveRange(startDate, endDate)
  }
}

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
