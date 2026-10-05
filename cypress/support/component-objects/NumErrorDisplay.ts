/**
 * Query/interaction helper for `num-error-display`: the overlay that the global error handler
 * opens for failed requests and uncaught errors. Its title is the raw error type, and its
 * labels ("Request URL", "Error 1", "No error details available") are hard-coded English, so
 * assertions match its own text, not translation keys.
 */
export class NumErrorDisplay {
  private container() {
    return cy.get('num-error-display .error-display-container')
  }

  public shouldBeOpen() {
    this.container().should('be.visible')
  }

  public shouldBeClosed() {
    cy.get('num-error-display .error-display-container').should('not.exist')
  }

  public shouldHaveTitle(title: string) {
    this.container().find('.error-title').should('have.text', title)
  }

  public shouldContain(text: string) {
    this.container().should('contain.text', text)
  }

  public shouldNotContain(text: string) {
    this.container().should('not.contain.text', text)
  }

  public close() {
    this.container().find('.close-button').click()
  }
}

export const numErrorDisplay = new NumErrorDisplay()
