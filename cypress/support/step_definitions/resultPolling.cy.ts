import { defineStep } from '../defineStep'

const SUMMARY_RESULT = '**/query/feasibility/*/summary-result'
const SEND_QUERY = '**/query/feasibility'
const SNACKBAR = 'num-snackbar [role="alert"]'
const DETAILS_BUTTON = 'num-simple-result button'
const LONG_TIMEOUT = 20000

/**
 * Faults for feasibility result polling. Real backend cannot fail on demand, so each method
 * registers `cy.intercept` on real API path: call BEFORE clicking "Feasibility". Settings
 * step must run before first page load, backend settings are fetched on app start.
 * */
export class ResultPolling {
  private inFlight = 0
  private maxInFlight = 0

  /**
   * Shorten polling window, poll interval and result expiry from backend `.settings`.
   * */
  public setTimes(pollingSeconds: number, intervalSeconds: number, expirySeconds: number) {
    /**
     * Static reply, no upstream callback: app start navigates (login redirect) and aborts
     * pending settings request. Callback on it fails test with BrowserConnectionClosedError.
     * */
    cy.request(`${Cypress.config('baseUrl')}/api/.settings`).then((settings) => {
      cy.intercept('GET', '**/.settings*', {
        statusCode: 200,
        body: {
          ...settings.body,
          passthroughPollingTimeUi: `PT${pollingSeconds}S`,
          readResultSummaryPollingInterval: `PT${intervalSeconds}S`,
          queryResultExpiry: `PT${expirySeconds}S`,
        },
      })
    })
  }

  /**
   * Answer every poll with HTTP `status`.
   * */
  public failEveryPoll(status: number) {
    cy.intercept('GET', SUMMARY_RESULT, { statusCode: status, body: {} })
  }

  /**
   * Answer first `count` polls with HTTP `status`, later polls reach real backend.
   * */
  public failFirstPolls(count: number, status: number) {
    let seen = 0
    cy.intercept('GET', SUMMARY_RESULT, (req) => {
      seen += 1
      if (seen <= count) {
        req.reply({ statusCode: status, body: {} })
      } else {
        req.continue()
      }
    })
  }

  /**
   * Answer every poll with issue `code` instead of result.
   * */
  public answerWithIssue(code: string) {
    cy.intercept('GET', SUMMARY_RESULT, {
      statusCode: 200,
      body: { issues: [{ code, message: code, type: 'ERROR', severity: 'ERROR' }] },
    })
  }

  /**
   * Remove `Location` header from answer to query send.
   * */
  public dropLocationHeader() {
    cy.intercept('POST', SEND_QUERY, (req) => {
      req.continue((res) => {
        delete res.headers['location']
      })
    })
  }

  /**
   * Answer every poll after `seconds`, remember how many polls ran at once.
   * */
  public delayPolls(seconds: number) {
    this.inFlight = 0
    this.maxInFlight = 0
    cy.intercept('GET', SUMMARY_RESULT, (req) => {
      this.inFlight += 1
      this.maxInFlight = Math.max(this.maxInFlight, this.inFlight)
      req.continue(
        () =>
          new Promise<void>((resolve) =>
            setTimeout(() => {
              this.inFlight -= 1
              resolve()
            }, seconds * 1000)
          )
      )
    })
  }

  /**
   * Count requests that send query.
   * */
  public watchSendQuery() {
    cy.intercept('POST', SEND_QUERY).as('sendQuery')
  }

  /**
   * Assert message in snackbar.
   * */
  public shouldShowMessage(text: string) {
    cy.get(SNACKBAR, { timeout: LONG_TIMEOUT }).should('contain.text', text)
  }

  /**
   * Assert query was sent `times` times.
   * */
  public shouldHaveSentQuery(times: number) {
    cy.get('@sendQuery.all').should('have.length', times)
  }

  /**
   * Assert polls never overlapped more than `limit`.
   * */
  public shouldNotOverlapPolls(limit: number) {
    cy.then(() => expect(this.maxInFlight).to.be.within(1, limit))
  }

  /**
   * Assert details button enabled once result is complete.
   * */
  public detailsShouldBeEnabled() {
    cy.contains(DETAILS_BUTTON, 'Details', { timeout: LONG_TIMEOUT }).should('not.be.disabled')
  }

  /**
   * Assert details button disabled after result expired.
   * */
  public detailsShouldBeDisabled() {
    cy.contains(DETAILS_BUTTON, 'Details', { timeout: LONG_TIMEOUT }).should('be.disabled')
  }
}

export const resultPolling = new ResultPolling()

defineStep(
  'the result polling takes {int} seconds, polls every {int} seconds and expires after {int} seconds',
  (polling: number, interval: number, expiry: number) =>
    resultPolling.setTimes(polling, interval, expiry)
)
defineStep('the backend answers every result poll with status {int}', (status: number) =>
  resultPolling.failEveryPoll(status)
)
defineStep(
  'the backend answers the first {int} result polls with status {int}',
  (count: number, status: number) => resultPolling.failFirstPolls(count, status)
)
defineStep('the backend answers every result poll with the issue {string}', (code: string) =>
  resultPolling.answerWithIssue(code)
)
defineStep('the backend answers sending the query without a location header', () =>
  resultPolling.dropLocationHeader()
)
defineStep('the backend answers every result poll only after {int} seconds', (seconds: number) =>
  resultPolling.delayPolls(seconds)
)
defineStep('I watch the requests that send the query', () => resultPolling.watchSendQuery())
defineStep('I see the message {string}', (text: string) => resultPolling.shouldShowMessage(text))
defineStep('the query was sent {int} time', (times: number) =>
  resultPolling.shouldHaveSentQuery(times)
)
defineStep('at most {int} result poll ran at a time', (limit: number) =>
  resultPolling.shouldNotOverlapPolls(limit)
)
defineStep('the details button is enabled', () => resultPolling.detailsShouldBeEnabled())
defineStep('the details button is disabled', () => resultPolling.detailsShouldBeDisabled())
