import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'

/**
 * Upload CRTDL fixture through upload input.
 * */
export class UploadFile {
  /**
   * Select fixture file, wait for uploaded criterium.
   * */
  uploadFile(fileName: string): void {
    cy.get(dataCy('upload-crtdl')).selectFile(`cypress/fixtures/${fileName}.json`, {
      force: true,
    })
    /**
     * Real post-condition, no fixed wait: UploadService navigates to Data Query - Cohort
     * Definition, renders uploaded criterium once processing finishes (checked against
     * fixtures/Single_Inclusion_Criteria_With_Patient.json content).
     * */
    cy.contains('18-Oxydase-Mangel', { timeout: 15000 }).should('be.visible')
  }
}

export const uploadFile = new UploadFile()
defineStep('I upload the file {string}', (fileName: string) => uploadFile.uploadFile(fileName))
