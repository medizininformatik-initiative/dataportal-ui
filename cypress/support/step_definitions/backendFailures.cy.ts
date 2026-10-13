import { defineStep } from '../defineStep'

const apiPattern = (path: string) => `**/${path}*`

/**
 * Makes the backend misbehave, for the negative-path scenarios. Each method registers a
 * `cy.intercept`, so call them AFTER the page is loaded and BEFORE the action that fires the
 * request (typing in the search box, pressing a button, ...). Requests are matched by URL
 * substring against the real API path, e.g. `terminology/entry/search`.
 */
export class BackendFailures {
  public answerWithStatus(path: string, status: number) {
    cy.intercept(apiPattern(path), { statusCode: status, body: {} }).as(`fail-${path}`)
  }

  public cannotBeReached(path: string) {
    cy.intercept(apiPattern(path), { forceNetworkError: true }).as(`unreachable-${path}`)
  }

  public answerOnlyAfter(path: string, seconds: number) {
    cy.intercept(apiPattern(path), (req) => {
      req.on('response', (res) => {
        res.setDelay(seconds * 1000)
      })
    }).as(`slow-${path}`)
  }

  public expireSession() {
    cy.intercept('**/api/**', { statusCode: 401, body: { error: 'invalid_token' } }).as(
      'expired-session'
    )
  }
}

export const backendFailures = new BackendFailures()

defineStep(
  'the backend answers requests to {string} with status {int}',
  (path: string, status: number) => backendFailures.answerWithStatus(path, status)
)
defineStep('the backend cannot be reached for requests to {string}', (path: string) =>
  backendFailures.cannotBeReached(path)
)
defineStep(
  'the backend answers requests to {string} only after {int} seconds',
  (path: string, seconds: number) => backendFailures.answerOnlyAfter(path, seconds)
)
defineStep('my session has expired', () => backendFailures.expireSession())
