import { defineStep } from '../defineStep'
import {
  TimeRestrictionFilterType,
  TimeRestrictionFilterTypeDE,
} from '../../e2e/Utilities/timeRestrictionFilter'

export class TimeRestriction {
  public addTimeRestriction(
    date: string,
    type: TimeRestrictionFilterType | TimeRestrictionFilterTypeDE
  ) {
    // Criteria with more than one available filter tab (e.g. a Procedure
    // that also supports References) don't default to the Time Restriction
    // tab — confirmed via screenshot for "Appendectomy" specifically, which
    // opened on "References" instead. Clicking it is a harmless no-op when
    // it's already the only/active tab.
    cy.contains('.tab', 'Time restriction').click()
    // num-timerestriction-type-selector renders a native <select>, not
    // Angular Material's mat-select — confirmed by reading its actual
    // template (timerestriction-type-selector.component.html) rather than
    // assumed. .select() works by the option's value attribute here, which
    // is why TimeRestrictionFilterType's values were fixed to match the
    // real app enum exactly.
    cy.get('num-timerestriction-type-selector select').select(type)
    // The datepicker commits (`dateChange`) on blur, so blur here: without it the filter is not applied yet
    // (header chip missing) until the next click happens to blur the input.
    cy.get('.mat-datepicker-input').clear().type(date).should('have.value', date).blur()
  }

  // BETWEEN renders two date inputs (num-between-filter). The app only emits
  // once both are set AND first < second (else it shows a date warning), so
  // type the earlier date into the first input.
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
      // The datepicker commits (`dateChange`) on blur, and the order check runs on that event, so
      // blur here instead of relying on the next click to do it.
      .blur()
  }
}
export const timeRestriction = new TimeRestriction()
defineStep('I set the time restriction to before with date {string}', (date: string) => {
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.Before)
})
defineStep('I set the time restriction to at with date {string}', (date: string) => {
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.On)
})
defineStep('I set the time restriction to after with date {string}', (date: string) => {
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.After)
})
// Deliberately unimplemented — not used by any current scenario. See
// cypress/CLAUDE.md / the refactor plan: writing Gherkin against these would
// pass without asserting anything until these bodies are filled in for real.
defineStep('I set the time restriction to equal with date {string}', (_date: string) => {})
defineStep(
  'I set the time restriction to between {string} and {string}',
  (startDate: string, endDate: string) => {
    timeRestriction.addBetweenTimeRestriction(startDate, endDate)
  }
)
defineStep('I see the time restriction warning {string}', (warning: string) => {
  cy.get('num-between-filter .date-warning').should('be.visible').and('contain.text', warning)
})
// The date picker shows the date without leading zeros (04.04.2045 -> 4.4.2045).
const plainDate = (d: string) => d.replace(/\b0(\d)/g, '$1')
const expectDate = (input: JQuery<HTMLElement>, date: string) =>
  expect(plainDate(String(input.val()))).to.eq(plainDate(date))
defineStep('the time restriction date is {string}', (date: string) => {
  cy.get('.mat-datepicker-input').should(($input) => expectDate($input, date))
})
defineStep(
  'the time restriction dates are {string} and {string}',
  (startDate: string, endDate: string) => {
    cy.get('num-between-filter .mat-datepicker-input').should(($inputs) => {
      expectDate($inputs.eq(0), startDate)
      expectDate($inputs.eq(1), endDate)
    })
  }
)
