import { defineStep } from '../defineStep'

/**
 * Glob matching any API request whose URL contains `path`.
 * */
const apiPattern = (path: string) => `**/${path}*`

/**
 * Make backend misbehave for negative-path scenarios. Each method registers `cy.intercept`:
 * call AFTER page load, BEFORE action firing request. Match by URL substring of real API path,
 * e.g. `terminology/entry/search`.
 * */
export class BackendFailures {
  /**
   * Answer requests to `path` with HTTP `status`.
   * */
  public answerWithStatus(path: string, status: number) {
    cy.intercept(apiPattern(path), { statusCode: status, body: {} }).as(`fail-${path}`)
  }

  /**
   * Fail requests to `path` with network error.
   * */
  public cannotBeReached(path: string) {
    cy.intercept(apiPattern(path), { forceNetworkError: true }).as(`unreachable-${path}`)
  }

  /**
   * Delay responses to `path` by `seconds`.
   * */
  public answerOnlyAfter(path: string, seconds: number) {
    cy.intercept(apiPattern(path), (req) => {
      req.on('response', (res) => {
        res.setDelay(seconds * 1000)
      })
    }).as(`slow-${path}`)
  }

  /**
   * Answer every `/api/` request with 401, simulating expired token.
   * */
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
