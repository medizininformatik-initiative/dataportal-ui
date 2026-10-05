import { numCheckbox } from './NumCheckbox'

/**
 * Query/interaction helper for the `table`/`table-body` shared components.
 * Row-finding stays text-based (`cy.contains('td', text)`) deliberately — a
 * row's internal `id` traces back to an opaque backend/Elasticsearch hash a
 * test author can't predict in advance (checked before deciding this; see
 * cypress/CLAUDE.md). Matching by the criterium's real display text is both
 * what Cypress recommends for meaningful text and the only thing a test
 * author actually knows ahead of time.
 */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export class NumTable {
  public getRowByText(text: string) {
    return cy
      .get('num-table tbody > tr')
      .contains('td', new RegExp(escapeRegex(text), 'i'))
      .closest('tr')
  }

  /**
   * Exact (whole-cell) match, not substring — for actions where clicking the
   * wrong row matters (selecting a checkbox), not just confirming some row
   * exists. Substring matching bit us for real: searching "Age" matched
   * "AGel amyloidosis" (a genuine, different criterium) before this existed.
   */
  private getRowByExactText(text: string) {
    return cy
      .get('num-table tbody > tr')
      .contains('td', new RegExp(`^\\s*${escapeRegex(text)}\\s*$`, 'i'))
      .closest('tr')
  }

  public shouldContainRow(text: string) {
    this.getRowByText(text).should('exist')
  }

  public shouldNotContainRow(text: string) {
    cy.get('num-table tbody > tr')
      .contains('td', new RegExp(escapeRegex(text), 'i'))
      .should('not.exist')
  }

  public selectCheckboxInRow(text: string) {
    this.getRowByExactText(text).within(() => numCheckbox.toggle())
  }

  /** Toggles the "select all" checkbox in the table header. */
  public toggleSelectAll() {
    cy.get('num-table thead').within(() => numCheckbox.toggle())
  }

  /**
   * Asserts on the rows currently rendered (the table is infinite-scrolled, so
   * "all" means every loaded row). Uses a retrying `.should(callback)` on
   * `aria-checked` because the row checkboxes update a moment after the header
   * one — asserting right after the click sees the header ticked and the rows
   * still unticked.
   */
  public shouldHaveAllRowsChecked() {
    this.shouldHaveRowsCheckedState('true')
  }

  public shouldHaveNoRowChecked() {
    this.shouldHaveRowsCheckedState('false')
  }

  private shouldHaveRowsCheckedState(expected: 'true' | 'false') {
    cy.get('num-table tbody > tr [data-cy="checkbox"]').should(($boxes) => {
      expect($boxes.length, 'number of row checkboxes').to.be.greaterThan(0)
      $boxes.each((_, box) => {
        expect(box.getAttribute('aria-checked'), 'aria-checked').to.eq(expected)
      })
    })
  }
}

export const numTable = new NumTable()
