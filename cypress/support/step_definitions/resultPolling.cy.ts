import { defineStep } from '../defineStep'

const SUMMARY_RESULT = '**/query/feasibility/*/summary-result'
const SEND_QUERY = '**/query/feasibility'
const DETAILED_RESULT = '**/query/feasibility/*/detailed-obfuscated-result'
const SNACKBAR = 'num-snackbar [role="alert"]'
const DETAILS_BUTTON = 'num-simple-result button'
const DETAILS_DIALOG = 'num-result-detail-modal'
const ERROR_DIALOG = 'num-error-display .error-display-overlay'
const SEND_BUTTON = 'num-editor-action-bar button'
const LONG_TIMEOUT = 20000

/**
 * Faults for feasibility result polling. Real backend cannot fail on demand, so each method
 * registers `cy.intercept` on real API path: call BEFORE clicking "Feasibility". Settings
 * step must run before first page load, backend settings are fetched on app start.
 * */
export class ResultPolling {
  private inFlight = 0
  private maxInFlight = 0
  private dialogSeen = false

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
   * Answer every detail request with issue `code` and HTTP 200, as backend does below privacy
   * threshold.
   * */
  public answerDetailsWithIssue(code: string) {
    cy.intercept('GET', DETAILED_RESULT, {
      statusCode: 200,
      body: { issues: [{ code, message: code, type: 'busy', severity: 'error' }] },
    }).as('detailRequest')
  }

  /**
   * Answer every detail request with HTTP 429, issue `code` and retry header `seconds`.
   * */
  public rateLimitDetails(code: string, seconds: number) {
    cy.intercept('GET', DETAILED_RESULT, {
      statusCode: 429,
      headers: { 'X-Rate-Limit-Retry-After-Seconds': String(seconds) },
      body: { issues: [{ code, message: code, type: 'busy', severity: 'error' }] },
    }).as('detailRequest')
  }

  /**
   * Answer query send with HTTP 429, issue `code` and `Retry-After` header `seconds`.
   * */
  public rateLimitSendQuery(code: string, seconds: number) {
    cy.intercept('POST', SEND_QUERY, {
      statusCode: 429,
      headers: { 'Retry-After': String(seconds) },
      body: { issues: [{ code, message: code, type: 'busy', severity: 'error' }] },
    })
  }

  /**
   * Count detail requests that reach real backend.
   * */
  public watchDetailRequests() {
    cy.intercept('GET', DETAILED_RESULT).as('detailRequest')
  }

  /**
   * Remember if details dialog ever appears in page, even briefly.
   * */
  public watchDetailsDialog() {
    this.dialogSeen = false
    cy.document().then((doc) =>
      new MutationObserver(() => {
        if (doc.querySelector(DETAILS_DIALOG)) {
          this.dialogSeen = true
        }
      }).observe(doc.body, { childList: true, subtree: true })
    )
  }

  /**
   * Click details button `times` times, back to back.
   * */
  public openDetails(times: number) {
    for (let i = 0; i < times; i++) {
      cy.contains(DETAILS_BUTTON, 'Details').click()
    }
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
   * Assert details dialog never opened, not even briefly.
   * */
  public detailsDialogShouldNeverOpen() {
    cy.then(() => expect(this.dialogSeen).to.equal(false))
    cy.get(DETAILS_DIALOG).should('not.exist')
  }

  /**
   * Assert details dialog lists sites with patient counts.
   * */
  public detailsDialogShouldListSites() {
    cy.get(DETAILS_DIALOG, { timeout: LONG_TIMEOUT }).find('tr').should('have.length.above', 1)
  }

  /**
   * Assert generic error dialog is not shown.
   * */
  public shouldShowNoErrorDialog() {
    cy.get(ERROR_DIALOG).should('not.exist')
  }

  /**
   * Assert detail requests that reached backend or stub.
   * */
  public shouldHaveRequestedDetails(times: number) {
    cy.get('@detailRequest.all').should('have.length', times)
  }

  /**
   * Assert send button is disabled and shows wait countdown.
   * */
  public sendShouldCountDown() {
    cy.contains(SEND_BUTTON, 'Please wait').should('be.disabled')
  }

  /**
   * Assert send button is enabled again with its normal label.
   * */
  public sendShouldBeEnabledAgain() {
    cy.contains(SEND_BUTTON, 'Feasibility', { timeout: LONG_TIMEOUT }).should('not.be.disabled')
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
defineStep('the backend answers every detail request with the issue {string}', (code: string) =>
  resultPolling.answerDetailsWithIssue(code)
)
defineStep(
  'the backend answers every detail request with the issue {string} and retry after {int} seconds',
  (code: string, seconds: number) => resultPolling.rateLimitDetails(code, seconds)
)
defineStep(
  'the backend answers sending the query with the issue {string} and retry after {int} seconds',
  (code: string, seconds: number) => resultPolling.rateLimitSendQuery(code, seconds)
)
defineStep('I watch the detail requests', () => resultPolling.watchDetailRequests())
defineStep('I watch the result details dialog', () => resultPolling.watchDetailsDialog())
defineStep('I open the result details {int} time(s)', (times: number) =>
  resultPolling.openDetails(times)
)
defineStep('the result details dialog never opened', () =>
  resultPolling.detailsDialogShouldNeverOpen()
)
defineStep('I see the result details dialog with sites', () =>
  resultPolling.detailsDialogShouldListSites()
)
defineStep('I see no error dialog', () => resultPolling.shouldShowNoErrorDialog())
defineStep('the details were requested {int} time(s)', (times: number) =>
  resultPolling.shouldHaveRequestedDetails(times)
)
defineStep('the send button counts down', () => resultPolling.sendShouldCountDown())
defineStep('the send button is enabled again', () => resultPolling.sendShouldBeEnabledAgain())
