import { label } from '../labels'
import { t } from '../i18n'
import { numCheckbox } from './NumCheckbox'

/**
 * Gherkin tab name to translation key, resolved in configured UI language.
 * */
const TAB_KEYS: Record<string, string> = {
  'Single Search': 'EDITOR.CONTENT.TAB_LABEL.SINGLE_SEARCH',
  Bulk: 'EDITOR.CONTENT.TAB_LABEL.BULK',
  'Selected Concepts': 'EDITOR.CONTENT.TAB_LABEL.SELECTED_CONCEPTS',
}

/**
 * Escape regex special characters in text.
 * */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Translate Gherkin tab name to UI label.
 * */
function tabLabel(name: string): string {
  const key = TAB_KEYS[name]
  /**
   * Label "Selected code filter ({{count}})" carries count: `t()` leaves "()" when no count passed.
   * Strip it, match text before it.
   * */
  return key ? t(key).replace(/\s*\(\s*\)\s*$/, '') : name
}

/**
 * Query and interaction helper for concept editor: `num-concept-filter` (search tab +
 * `num-concept-filter-table`), `num-concept-bulk-search`, `num-selected-concept-list` inside
 * criterion editor `mat-tab-group`. Inner tabs are Material `mat-tab`s with translated labels
 * (en.json `EDITOR.CONTENT.TAB_LABEL.*`): match by text, not retrofitted `data-cy`. Search
 * rows match exact code cell: code is only thing test author knows ahead (display texts are
 * German, can change). Checked state read from shared checkbox `aria-checked`.
 * */
export class NumConceptFilter {
  /**
   * Each concept filter is own top-level tab in criterion editor, named after filter (attribute
   * or value), verified against running UI. Named scope therefore only activates that tab:
   * active tab body is only concept editor rendered.
   * */
  public openEditorTab(name: string) {
    cy.contains('.tab', new RegExp(`^\\s*${escapeRegex(label(name))}\\s*$`, 'i')).click()
  }

  /**
   * Scope to concept editor, activating tab of named filter first.
   * */
  private scope(filterName?: string): Cypress.Chainable<JQuery> {
    if (filterName) {
      this.openEditorTab(filterName)
    }
    return cy.get('body')
  }

  /**
   * Open inner tab, optionally within named filter.
   * */
  public openTab(name: string, filterName?: string) {
    this.scope(filterName).contains('.mdc-tab, .mat-mdc-tab', tabLabel(name)).click()
  }

  /**
   * Assert inner tab disabled.
   * */
  public tabShouldBeDisabled(name: string) {
    cy.contains('.mdc-tab, .mat-mdc-tab', tabLabel(name)).should(
      'have.attr',
      'aria-disabled',
      'true'
    )
  }

  /**
   * Assert inner tab count badge.
   * */
  public tabShouldShowCount(name: string, count: number) {
    cy.contains('.mdc-tab, .mat-mdc-tab', tabLabel(name)).should('contain.text', `(${count})`)
  }

  /**
   * Type search term into concept search.
   * */
  public search(term: string, filterName?: string) {
    this.scope(filterName)
      .find('num-concept-filter num-searchbar input')
      .clear()
      .type(term)
      .should('have.value', term)
  }

  /**
   * Clear concept search input.
   * */
  public clearSearch(filterName?: string) {
    this.scope(filterName)
      .find('num-concept-filter num-searchbar input')
      .clear()
      .should('have.value', '')
  }

  /**
   * Find search result row by exact code cell.
   * */
  private resultRow(code: string, filterName?: string) {
    return this.scope(filterName)
      .find('num-concept-filter-table tbody > tr')
      .contains('td', new RegExp(`^\\s*${escapeRegex(code)}\\s*$`))
      .closest('tr')
  }

  /**
   * Toggle checkbox of result row by code.
   * */
  public toggleResult(code: string, filterName?: string) {
    this.resultRow(code, filterName).within(() => numCheckbox.toggle())
  }

  /**
   * Same code can exist in several code systems (e.g. `I26` in ICD-10-GM and Alpha-ID): identify
   * row by code AND system display name shown in own cell. Asserting exactly one match also
   * guards against ambiguous lookup.
   * */
  private resultRowInSystem(code: string, system: string, filterName?: string) {
    return this.scope(filterName)
      .find('num-concept-filter-table tbody > tr')
      .filter((_, row) => {
        const cells = Array.from(row.querySelectorAll('td')).map((td) =>
          (td.textContent ?? '').trim()
        )
        return cells.includes(code) && cells.includes(system)
      })
      .should('have.length', 1)
  }

  /**
   * Toggle checkbox of result row by code within system.
   * */
  public toggleResultInSystem(code: string, system: string, filterName?: string) {
    this.resultRowInSystem(code, system, filterName).within(() => numCheckbox.toggle())
  }

  /**
   * Assert result row of code within system checked or unchecked.
   * */
  public resultInSystemShouldBeChecked(code: string, system: string, checked: boolean) {
    this.resultRowInSystem(code, system)
      .find('[data-cy="checkbox"]')
      .should('have.attr', 'aria-checked', String(checked))
  }

  /**
   * Assert result row of code checked or unchecked.
   * */
  public resultShouldBeChecked(code: string, checked: boolean) {
    this.resultRow(code)
      .find('[data-cy="checkbox"]')
      .should('have.attr', 'aria-checked', String(checked))
  }

  /**
   * Select codes via UI: search each code, tick its row.
   * */
  public selectCodes(codes: string[], filterName?: string) {
    this.openTab('Single Search', filterName)
    codes.forEach((code) => {
      this.search(code, filterName)
      this.toggleResult(code, filterName)
    })
  }

  /**
   * Selected-list items, optionally within named filter.
   * */
  private selectedItems(filterName?: string) {
    return this.scope(filterName).find('num-selected-concept-list .selected-items-list .item')
  }

  /**
   * Click remove button of selected item by code.
   * */
  public removeSelected(code: string, filterName?: string) {
    /**
     * Item renders display and code in adjacent spans without whitespace ("Konsilkonsil"): match
     * code span exactly, then climb to item.
     * */
    this.selectedItems(filterName)
      .contains('span', new RegExp(`^\\s*${escapeRegex(code)}\\s*$`))
      .closest('.item')
      .find('button.delete-button')
      .click()
  }

  /**
   * Assert selected-list entry count.
   * */
  public selectedShouldHaveCount(count: number, filterName?: string) {
    if (count === 0) {
      this.scope(filterName).find('num-selected-concept-list .item').should('not.exist')
    } else {
      this.selectedItems(filterName).should('have.length', count)
    }
  }

  /**
   * Assert selected list contains or lacks code.
   * */
  public selectedShouldContain(code: string, contained: boolean, filterName?: string) {
    const matcher = new RegExp(`^\\s*${escapeRegex(code)}\\s*$`)
    if (contained) {
      this.selectedItems(filterName).contains('span', matcher).should('exist')
    } else {
      this.scope(filterName)
        .find('num-selected-concept-list')
        .should(($list) => {
          const codes = $list
            .find('.item span')
            .toArray()
            .map((el) => el.textContent ?? '')
          expect(codes.some((text) => matcher.test(text))).to.equal(false)
        })
    }
  }
}

export const numConceptFilter = new NumConceptFilter()
