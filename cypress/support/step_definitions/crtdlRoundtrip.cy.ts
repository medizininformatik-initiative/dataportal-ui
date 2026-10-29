import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'
import { caseNamed } from '../../../test-support/crtdl/cases'
import { differences } from '../../../test-support/crtdl/roundtrip'

/**
 * Upload to download roundtrip. What counts as same: `crtdl/roundtrip.ts`.
 * */
export class CrtdlRoundtrip {
  /**
   * Upload generated CRTDL case `name` through upload input.
   * */
  public uploadGenerated(name: string) {
    cy.get(dataCy('upload-crtdl')).selectFile(
      {
        contents: Cypress.Buffer.from(JSON.stringify(caseNamed(name))),
        fileName: `${name}.json`,
        mimeType: 'application/json',
      },
      { force: true }
    )
  }

  /**
   * Assert downloaded file matches generated case `name`.
   * */
  public downloadedShouldMatchGenerated(file: string, name: string) {
    cy.readFile(`cypress/downloads/${file}.json`).then((downloaded) => {
      const problems = differences(caseNamed(name), downloaded)
      expect(problems, problems.join('\n')).to.have.length(0)
    })
  }
}

export const crtdlRoundtrip = new CrtdlRoundtrip()

defineStep('I upload the generated data definition {string}', (name: string) => crtdlRoundtrip.uploadGenerated(name))
defineStep('the downloaded file {string} matches the generated data definition {string}', (file: string, name: string) =>
  crtdlRoundtrip.downloadedShouldMatchGenerated(file, name)
)
