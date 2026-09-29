/**
 * Query/interaction helper for the `num-filter-chips` shared component.
 * Relocated from `cypress/support/step_definitions/filter-chips.cy.ts` and
 * fixed to use the `numDataCy` values `filter-chips.component.html` already
 * carries on `.block`/`.chip-container`, instead of the raw classes — removes
 * the old non-breaking-space text-scraping workaround entirely, since matching
 * an attribute value isn't subject to render-time whitespace quirks the way
 * scraped DOM text is.
 */
export class NumFilterChips {
  private getCriteriaBoxByLabel(criterium: string) {
    // `.container` (not the `num-criteria-box` host tag) is what actually
    // carries the data-cy — criteria-box.component.html puts [numDataCy] on
    // its own inner root div, not the host element. Scoping by it matters: a
    // quantity/value filter's own chip block can carry the exact same
    // data-cy as its criterion (the filter concept *is* the criterion, e.g.
    // "Current chronological age"), which makes an unscoped
    // `[data-cy="..."]` match both the box and its own chip block.
    return cy.get(`.container[data-cy="${criterium}"]`)
  }

  private assertBlockName(expectedBlockName: string) {
    cy.get(`[data-cy="${expectedBlockName}"]`).should('exist')
  }

  private assertChipVisible(chipName: string) {
    cy.get(`[data-cy="${chipName}"]`).should('be.visible')
  }

  public getFilterChipByName(criterium: string, chipName: string, blockName: string) {
    this.getCriteriaBoxByLabel(criterium).within(() => {
      this.assertBlockName(blockName)
      this.assertChipVisible(chipName)
    })
  }

  public getFilterChipBlock(criterium: string, blockName: string) {
    this.getCriteriaBoxByLabel(criterium).within(() => {
      this.assertBlockName(blockName)
    })
  }
}

export const numFilterChips = new NumFilterChips()
