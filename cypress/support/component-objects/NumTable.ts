import { dataCy } from '../dataCy'
import { numCheckbox } from './NumCheckbox'

const NUM_TABLE = 'num-table'
const NUM_TABLE_TBODY_TR = `${NUM_TABLE} tbody > tr`

/**
 * Escape regex metacharacters in text.
 * */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Query and interaction helper for `table` / `table-body` shared components. Row finding stays
 * text-based (`cy.contains('td', text)`) on purpose: row internal `id` traces back to opaque
 * backend/Elasticsearch hash test author cannot predict (checked, see cypress/CLAUDE.md). Real
 * display text is what Cypress recommends for meaningful text, and only thing author knows
 * ahead.
 * */
export class NumTable {
  /**
   * Find table row containing text.
   * */
  public getRowByText(text: string) {
    return cy
      .get(NUM_TABLE_TBODY_TR)
      .contains('td', new RegExp(escapeRegex(text), 'i'))
      .closest('tr')
  }

  /**
   * Exact whole-cell match, not substring: for actions where clicking wrong row matters (ticking
   * checkbox), not only confirming some row exists. Substring matching failed for real:
   * searching "Age" matched "AGel amyloidosis", different criterium, before this existed.
   * */
  private getRowByExactText(text: string) {
    return cy
      .get(NUM_TABLE_TBODY_TR)
      .contains('td', new RegExp(`^\\s*${escapeRegex(text)}\\s*$`, 'i'))
      .closest('tr')
  }

  /**
   * Assert table has row containing text.
   * */
  public shouldContainRow(text: string) {
    this.getRowByText(text).should('exist')
  }

  /**
   * Assert table has no row containing text.
   * */
  public shouldNotContainRow(text: string) {
    cy.get(NUM_TABLE_TBODY_TR)
      .contains('td', new RegExp(escapeRegex(text), 'i'))
      .should('not.exist')
  }

  /**
   * Tick checkbox in row by exact text.
   * */
  public selectCheckboxInRow(text: string) {
    this.getRowByExactText(text).within(() => numCheckbox.toggle())
  }

  /**
   * Toggle "select all" checkbox in table header.
   * */
  public toggleSelectAll() {
    cy.get(`${NUM_TABLE} thead`).within(() => numCheckbox.toggle())
  }

  /**
   * Assert on rows currently rendered: table is infinite-scrolled, so "all" = every loaded row.
   * Use retrying `.should(callback)` on `aria-checked`: row checkboxes update moment after
   * header one, asserting right after click sees header ticked, rows still unticked.
   * */
  public shouldHaveAllRowsChecked() {
    this.shouldHaveRowsCheckedState('true')
  }

  /**
   * Assert no row checked.
   * */
  public shouldHaveNoRowChecked() {
    this.shouldHaveRowsCheckedState('false')
  }

  /**
   * Assert all rendered rows have `aria-checked` state.
   * */
  private shouldHaveRowsCheckedState(expected: 'true' | 'false') {
    cy.get(`${NUM_TABLE_TBODY_TR} ${dataCy('checkbox')}`).should(($boxes) => {
      expect($boxes.length, 'number of row checkboxes').to.be.greaterThan(0)
      $boxes.each((_, box) => {
        expect(box.getAttribute('aria-checked'), 'aria-checked').to.eq(expected)
      })
    })
  }
}

export const numTable = new NumTable()
