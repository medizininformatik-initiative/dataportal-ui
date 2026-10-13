import { defineStep } from '../defineStep'
import { caseNamed } from '../crtdl/cases'
import { differences } from '../crtdl/roundtrip'

/** Upload -> download roundtrip. What counts as "the same" is `crtdl/roundtrip.ts`. */
export class CrtdlRoundtrip {
  public uploadGenerated(name: string) {
    cy.get('[data-cy="upload-crtdl"]').selectFile(
      {
        contents: Cypress.Buffer.from(JSON.stringify(caseNamed(name))),
        fileName: `${name}.json`,
        mimeType: 'application/json',
      },
      { force: true }
    )
  }

  public downloadedShouldMatchGenerated(file: string, name: string) {
    cy.readFile(`cypress/downloads/${file}.json`).then((downloaded) => {
      const problems = differences(caseNamed(name), downloaded)
      expect(problems, problems.join('\n')).to.have.length(0)
    })
  }
}

export const crtdlRoundtrip = new CrtdlRoundtrip()

defineStep('I upload the generated data definition {string}', (name: string) =>
  crtdlRoundtrip.uploadGenerated(name)
)
defineStep(
  'the downloaded file {string} matches the generated data definition {string}',
  (file: string, name: string) => crtdlRoundtrip.downloadedShouldMatchGenerated(file, name)
)
