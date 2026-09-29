import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
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
    cy.get('.mat-datepicker-input').clear().type(date).should('have.value', date)
  }
}
export const timeRestriction = new TimeRestriction()
defineStep('I set the time restriction filter to before with date {string}', (date: string) => {
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.Before)
})
defineStep('I set the time restriction filter to on with date {string}', (date: string) => {
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.On)
})
defineStep('I set the time restriction filter to after with date {string}', (date: string) => {
  timeRestriction.addTimeRestriction(date, TimeRestrictionFilterType.After)
})
// Deliberately unimplemented — not used by any current scenario. See
// cypress/CLAUDE.md / the refactor plan: writing Gherkin against these would
// pass without asserting anything until these bodies are filled in for real.
defineStep('I set the time restriction filter to equal with date {string}', (_date: string) => {})
defineStep(
  'I set the time restriction filter to between {string} and {string}',
  (_startDate: string, _endDate: string) => {}
)
