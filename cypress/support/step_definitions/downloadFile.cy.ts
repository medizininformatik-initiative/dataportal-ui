import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

export class DownloadFile {
  public downloadFile(fileName: string): void {
    cy.get('[data-cy="download-crtdl-button"]').click()
    cy.get('[data-cy="download-modal"]').should('be.visible')
    // Material's dialog focus trap moves focus into the modal only once its open animation
    // has finished. Typing before that loses the keystrokes (the input is blurred with its
    // value still empty), so wait for focus to land inside the modal first.
    cy.focused().should(($el) => {
      expect($el.closest('[data-cy="download-modal"]')).to.have.length(1)
    })
    cy.get('[data-cy="download-modal"]').find('input[type="text"]').type(fileName).should('have.value', fileName)
    cy.get('[data-cy="save-file-button"]').click()
    // No fixed wait: cy.readFile() already retries until the file exists or
    // the command times out, so waiting before it is pure redundancy.
    cy.readFile(`cypress/downloads/${fileName}.json`)
  }
}
export const downloadFile = new DownloadFile()
defineStep('I download the file {string}', (fileName: string) => {
  downloadFile.downloadFile(fileName)
})
