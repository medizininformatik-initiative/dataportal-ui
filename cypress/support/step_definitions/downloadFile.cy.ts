import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

export class DownloadFile {
  public downloadFile(fileName: string): void {
    cy.get('[data-cy="download-ccdl"]').click()
    cy.get('num-save-file-modal').should('be.visible')
    cy.get('num-save-file-modal').find('input[type="text"]').type(fileName).should('have.value', fileName)
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
