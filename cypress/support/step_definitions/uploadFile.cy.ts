import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

export class UploadFile {
  uploadFile(fileName: string): void {
    cy.get('[data-cy="upload-crtdl"]').selectFile(`cypress/fixtures/${fileName}.json`, { force: true })
    // Real post-condition instead of a fixed wait: UploadService navigates to
    // Data Query - Cohort Definition and renders the uploaded criterium once
    // processing finishes (checked against fixtures/Single_Inclusion_Criteria_
    // With_Patient.json's actual content, not assumed).
    cy.contains('18-Oxydase-Mangel', { timeout: 15000 }).should('be.visible')
  }
}

export const uploadFile = new UploadFile()
defineStep('I upload the file {string}', (fileName: string) => {
  uploadFile.uploadFile(fileName)
})
