import { defineStep } from '../defineStep'

/**
 * Download CRTDL through download modal.
 * */
export class DownloadFile {
  /**
   * Open download modal, type file name, save, wait for file on disk.
   * */
  public downloadFile(fileName: string): void {
    cy.get('[data-cy="download-crtdl-button"]').click()
    cy.get('[data-cy="download-modal"]').should('be.visible')
    /**
     * Material dialog focus trap moves focus into modal only after open animation ends. Typing
     * earlier loses keystrokes: input blurred with value still empty. Wait for focus inside modal
     * first.
     * */
    cy.focused().should(($el) => {
      expect($el.closest('[data-cy="download-modal"]')).to.have.length(1)
    })
    cy.get('[data-cy="download-modal"]')
      .find('input[type="text"]')
      .type(fileName)
      .should('have.value', fileName)
    cy.get('[data-cy="save-file-button"]').click()
    /**
     * No fixed wait: `cy.readFile()` retries until file exists or command times out.
     * */
    cy.readFile(`cypress/downloads/${fileName}.json`)
  }
}
export const downloadFile = new DownloadFile()
defineStep('I download the file {string}', (fileName: string) =>
  downloadFile.downloadFile(fileName)
)
