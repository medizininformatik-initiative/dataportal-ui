const INPUTS = 'num-between-filter .mat-datepicker-input'

/**
 * Date picker shows dates without leading zeros: 04.04.2045 shows as 4.4.2045.
 * */
const plainDate = (d: string) => d.replace(/\b0(\d)/g, '$1')

/**
 * Compare input value with expected date, ignoring leading zeros.
 * */
export const expectDate = (input: JQuery<HTMLElement>, date: string) =>
  expect(plainDate(String(input.val()))).to.eq(plainDate(date))

/**
 * Query and interaction helper for `num-between-filter`: two date inputs of time restriction type
 * BETWEEN. App emits only once both are set AND first < second, else shows date warning.
 * */
export class NumBetweenFilter {
  /**
   * Type start and end date, blur. Earlier date goes first, so no warning shows on first blur.
   * */
  public setRange(startDate: string, endDate: string) {
    cy.get(INPUTS).eq(0).clear().type(startDate).should('have.value', startDate)
    /**
     * Datepicker commits (`dateChange`) on blur, order check runs on that event: blur here, not on
     * next click.
     * */
    cy.get(INPUTS).eq(1).clear().type(endDate).should('have.value', endDate).blur()
  }

  /**
   * Assert date warning visible with text.
   * */
  public shouldShowWarning(warning: string) {
    cy.get('num-between-filter .date-warning').should('be.visible').and('contain.text', warning)
  }

  /**
   * Assert both input values.
   * */
  public shouldHaveRange(startDate: string, endDate: string) {
    cy.get(INPUTS).should(($inputs) => {
      expectDate($inputs.eq(0), startDate)
      expectDate($inputs.eq(1), endDate)
    })
  }
}

export const numBetweenFilter = new NumBetweenFilter()
