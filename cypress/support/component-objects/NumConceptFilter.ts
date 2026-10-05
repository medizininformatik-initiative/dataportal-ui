import { label } from '../labels'
import { t } from '../i18n'
import { numCheckbox } from './NumCheckbox'

/**
 * Query/interaction helper for the concept editor: `num-concept-filter` (search
 * tab + `num-concept-filter-table`), `num-concept-bulk-search` and
 * `num-selected-concept-list` inside the criterion editor's `mat-tab-group`.
 *
 * The inner tabs are Angular Material's own `mat-tab`s with translated labels
 * (en.json `EDITOR.CONTENT.TAB_LABEL.*`), so they are matched by text, not by a
 * retrofitted data-cy. Search rows are matched by the exact code cell, since the
 * code is the one thing a test author knows in advance (display texts are German
 * and can change); the checked state is read from the shared checkbox's
 * `aria-checked`.
 */
// Gherkin tab name -> translation key (resolved in the configured UI language).
const TAB_KEYS: Record<string, string> = {
  'Single Search': 'EDITOR.CONTENT.TAB_LABEL.SINGLE_SEARCH',
  Bulk: 'EDITOR.CONTENT.TAB_LABEL.BULK',
  'Selected Concepts': 'EDITOR.CONTENT.TAB_LABEL.SELECTED_CONCEPTS',
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function tabLabel(name: string): string {
  const key = TAB_KEYS[name]
  // "Selected code filter ({{count}})" carries a count: t() leaves "()" when no count is
  // passed, so strip it and match the text before it.
  return key ? t(key).replace(/\s*\(\s*\)\s*$/, '') : name
}

export class NumConceptFilter {
  /**
   * Each concept filter is its own top-level tab in the criterion editor, named
   * after the filter (attribute/value) - verified against the running UI. A named
   * scope therefore just activates that tab; the active tab body is the only
   * concept editor rendered.
   */
  public openEditorTab(name: string) {
    cy.contains('.tab', new RegExp(`^\\s*${escapeRegex(label(name))}\\s*$`, 'i')).click()
  }

  private scope(filterName?: string): Cypress.Chainable<JQuery> {
    if (filterName) {
      this.openEditorTab(filterName)
    }
    return cy.get('body')
  }

  public openTab(name: string, filterName?: string) {
    this.scope(filterName).contains('.mdc-tab, .mat-mdc-tab', tabLabel(name)).click()
  }

  public tabShouldBeDisabled(name: string) {
    cy.contains('.mdc-tab, .mat-mdc-tab', tabLabel(name)).should('have.attr', 'aria-disabled', 'true')
  }

  public tabShouldShowCount(name: string, count: number) {
    cy.contains('.mdc-tab, .mat-mdc-tab', tabLabel(name)).should('contain.text', `(${count})`)
  }

  public search(term: string, filterName?: string) {
    this.scope(filterName)
      .find('num-concept-filter num-searchbar input')
      .clear()
      .type(term)
      .should('have.value', term)
  }

  public clearSearch(filterName?: string) {
    this.scope(filterName).find('num-concept-filter num-searchbar input').clear().should('have.value', '')
  }

  private resultRow(code: string, filterName?: string) {
    return this.scope(filterName)
      .find('num-concept-filter-table tbody > tr')
      .contains('td', new RegExp(`^\\s*${escapeRegex(code)}\\s*$`))
      .closest('tr')
  }

  public toggleResult(code: string, filterName?: string) {
    this.resultRow(code, filterName).within(() => numCheckbox.toggle())
  }

  public resultShouldBeChecked(code: string, checked: boolean) {
    this.resultRow(code)
      .find('[data-cy="checkbox"]')
      .should('have.attr', 'aria-checked', String(checked))
  }

  /** Select codes via the UI: search for each code, tick its row. */
  public selectCodes(codes: string[], filterName?: string) {
    this.openTab('Single Search', filterName)
    codes.forEach((code) => {
      this.search(code, filterName)
      this.toggleResult(code, filterName)
    })
  }

  private selectedItems(filterName?: string) {
    return this.scope(filterName).find('num-selected-concept-list .selected-items-list .item')
  }

  public removeSelected(code: string, filterName?: string) {
    // The item renders display and code in adjacent spans with no whitespace
    // between them ("Konsilkonsil"), so match the code span exactly, then climb to its item.
    this.selectedItems(filterName)
      .contains('span', new RegExp(`^\\s*${escapeRegex(code)}\\s*$`))
      .closest('.item')
      .find('button.delete-button')
      .click()
  }

  public selectedShouldHaveCount(count: number, filterName?: string) {
    if (count === 0) {
      this.scope(filterName).find('num-selected-concept-list .item').should('not.exist')
    } else {
      this.selectedItems(filterName).should('have.length', count)
    }
  }

  public selectedShouldContain(code: string, contained: boolean, filterName?: string) {
    const matcher = new RegExp(`^\\s*${escapeRegex(code)}\\s*$`)
    if (contained) {
      this.selectedItems(filterName).contains('span', matcher).should('exist')
    } else {
      this.scope(filterName)
        .find('num-selected-concept-list')
        .should(($list) => {
          const codes = $list.find('.item span').toArray().map((el) => el.textContent ?? '')
          expect(codes.some((text) => matcher.test(text))).to.equal(false)
        })
    }
  }
}

export const numConceptFilter = new NumConceptFilter()
