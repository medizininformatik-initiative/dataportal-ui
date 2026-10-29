import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'

/**
 * Upload in-memory content as file.
 * */
export class UploadInvalidFile {
  /**
   * Upload in-memory content through real upload input: malformed or schema-violating file needs
   * no fixture on disk. Works on every page with action bar.
   * */
  public uploadContent(fileName: string, contents: string) {
    cy.get(dataCy('upload-crtdl')).selectFile(
      { contents: Cypress.Buffer.from(contents), fileName, mimeType: 'application/json' },
      { force: true }
    )
  }
}

export const uploadInvalidFile = new UploadInvalidFile()

defineStep(
  'I upload a file named {string} containing {string}',
  (fileName: string, contents: string) => uploadInvalidFile.uploadContent(fileName, contents)
)
