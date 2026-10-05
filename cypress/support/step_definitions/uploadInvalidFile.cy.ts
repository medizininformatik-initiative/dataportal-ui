import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

/**
 * Uploads in-memory content through the real upload input, so a malformed or schema-violating
 * file needs no fixture on disk. Works on every page that has the action bar.
 */
defineStep('I upload a file named {string} containing {string}', (fileName: string, contents: string) => {
  cy.get('[data-cy="upload-crtdl"]').selectFile(
    { contents: Cypress.Buffer.from(contents), fileName, mimeType: 'application/json' },
    { force: true }
  )
})
