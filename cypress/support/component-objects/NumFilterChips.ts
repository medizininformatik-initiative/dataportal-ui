/**
 * Query and interaction helper for `num-filter-chips` shared component. Moved from
 * `cypress/support/step_definitions/filter-chips.cy.ts`, fixed to use `numDataCy` values
 * `filter-chips.component.html` already carries on `.block` / `.chip-container`, not raw
 * classes. Removes old non-breaking-space text-scraping workaround: attribute match is immune
 * to render-time whitespace quirks.
 * */
export class NumFilterChips {
  /**
   * Find criteria box by criterium label.
   * */
  private getCriteriaBoxByLabel(criterium: string) {
    /**
     * `.container`, not `num-criteria-box` host tag, carries `data-cy`:
     * criteria-box.component.html puts `[numDataCy]` on own inner root div. Scoping matters:
     * quantity or value filter chip block can carry exact same `data-cy` as its criterion (filter
     * concept IS criterion, e.g. "Current chronological age"), so unscoped `[data-cy="..."]`
     * matches box and own chip block.
     * */
    return cy.get(`.container[data-cy="${criterium}"]`)
  }

  /**
   * Assert chip block name.
   * */
  private assertBlockName(expectedBlockName: string) {
    cy.get(`[data-cy="${expectedBlockName}"]`).should('exist')
  }

  /**
   * Assert chip visible.
   * */
  private assertChipVisible(chipName: string) {
    cy.get(`[data-cy="${chipName}"]`).should('be.visible')
  }

  /**
   * Assert criterium shows chip inside block.
   * */
  public getFilterChipByName(criterium: string, chipName: string, blockName: string) {
    this.getCriteriaBoxByLabel(criterium).within(() => {
      this.assertBlockName(blockName)
      this.assertChipVisible(chipName)
    })
  }

  /**
   * Assert criterium shows chip block.
   * */
  public getFilterChipBlock(criterium: string, blockName: string) {
    this.getCriteriaBoxByLabel(criterium).within(() => {
      this.assertBlockName(blockName)
    })
  }
}

export const numFilterChips = new NumFilterChips()
