import { defineStep } from '../defineStep'

/**
 * Steps for saved queries stored in pre-CRTDL format.
 * */
export class LegacySavedQuery {
  /**
   * Rewrite every saved-query GET by id: content becomes bare StructuredQuery
   * (`cohortDefinition`), format used before CRTDL.
   * */
  public serveAsStructuredQuery() {
    cy.intercept({ method: 'GET', url: /\/query\/data\/\d+\?/ }, (req) =>
      req.continue((res) => {
        res.body.content = res.body.content.cohortDefinition
      })
    )
  }
}

export const legacySavedQuery = new LegacySavedQuery()

defineStep('saved queries are served in the old StructuredQuery format', () =>
  legacySavedQuery.serveAsStructuredQuery()
)
