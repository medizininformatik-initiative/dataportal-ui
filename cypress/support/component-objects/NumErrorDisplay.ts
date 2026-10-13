/**
 * Query and interaction helper for `num-error-display`: overlay opened by global error handler
 * for failed requests and uncaught errors. Title is raw error type. Labels ("Request URL",
 * "Error 1", "No error details available") are hard-coded English: assert own text, not
 * translation keys.
 * */
export class NumErrorDisplay {
  /**
   * Find error display container.
   * */
  private container() {
    return cy.get('num-error-display .error-display-container')
  }

  /**
   * Assert overlay open.
   * */
  public shouldBeOpen() {
    this.container().should('be.visible')
  }

  /**
   * Assert overlay closed.
   * */
  public shouldBeClosed() {
    cy.get('num-error-display .error-display-container').should('not.exist')
  }

  /**
   * Assert overlay title.
   * */
  public shouldHaveTitle(title: string) {
    this.container().find('.error-title').should('have.text', title)
  }

  /**
   * Assert overlay contains text.
   * */
  public shouldContain(text: string) {
    this.container().should('contain.text', text)
  }

  /**
   * Assert overlay lacks text.
   * */
  public shouldNotContain(text: string) {
    this.container().should('not.contain.text', text)
  }

  /**
   * Click close button of overlay.
   * */
  public close() {
    this.container().find('.close-button').click()
  }
}

export const numErrorDisplay = new NumErrorDisplay()
