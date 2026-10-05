import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { caseNamed } from '../crtdl/cases'
import { differences } from '../crtdl/roundtrip'

/** Upload -> download roundtrip steps. What counts as "the same" is `crtdl/roundtrip.ts`. */
defineStep('I upload the generated data definition {string}', (name: string) => {
  cy.get('[data-cy="upload-crtdl"]').selectFile(
    { contents: Cypress.Buffer.from(JSON.stringify(caseNamed(name))), fileName: `${name}.json`, mimeType: 'application/json' },
    { force: true }
  )
})

defineStep('the downloaded file {string} matches the generated data definition {string}', (file: string, name: string) => {
  cy.readFile(`cypress/downloads/${file}.json`).then((downloaded) => {
    const problems = differences(caseNamed(name), downloaded)
    expect(problems, problems.join('\n')).to.have.length(0)
  })
})
