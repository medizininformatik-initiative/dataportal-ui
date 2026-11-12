# The result page sends the query, then polls for the summary result until the polling time is over.
# The real backend cannot fail on demand, so faults are injected by intercepting its answers
# (cypress/support/step_definitions/resultPolling.cy.ts). `.settings` is shortened so a scenario
# takes seconds, not the 60s of a real polling window.
@area:feasibility-query
Feature: Cohort result polling

  @component:feasibility-result @behavior:report-backend-error
  Scenario: Polling that never gets a result tells the user
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers every result poll with status 500
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the message "{{resultPolling.timeout}}"
    And I see the spinner is not visible

  @component:feasibility-result @behavior:tolerate-slow-backend
  Scenario: A failed poll in between does not stop polling
    Given the result polling takes 20 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers the first 2 result polls with status 500
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    And the details button is enabled

  @component:feasibility-result @behavior:report-backend-error
  Scenario: An issue in the poll answer is shown
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers every result poll with the issue "{{resultPolling.issueCode}}"
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the message "{{resultPolling.tooManyQueries}}"
    And I see the spinner is not visible

  @component:feasibility-result @behavior:report-backend-error
  Scenario: A sent query without location header is reported
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers sending the query without a location header
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the message "{{resultPolling.failed}}"
    And I see the spinner is not visible

  @component:feasibility-result @behavior:tolerate-slow-backend
  Scenario: Slow polls never overlap
    Given the result polling takes 20 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers every result poll only after 3 seconds
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    And at most 1 result poll ran at a time

  @component:feasibility-result @behavior:show
  Scenario: The query is sent once
    Given the result polling takes 20 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And I watch the requests that send the query
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    And the query was sent 1 time

  @component:feasibility-result @behavior:show
  Scenario: Details are disabled once the result expired
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 8 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then the details button is enabled
    And the details button is disabled

  @component:feasibility-result @behavior:report-backend-error
  Scenario Outline: Details below the privacy threshold show their message, not the generic error
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers every detail request with the issue "<code>"
    And I watch the result details dialog
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    And the details button is enabled
    When I open the result details 1 time
    Then I see the message "<message>"
    And the result details dialog never opened
    And I see no error dialog

    Examples:
      | code                             | message                              |
      | {{resultPolling.belowThreshold}} | {{resultPolling.belowThresholdText}} |
      | {{resultPolling.fewSites}}       | {{resultPolling.fewSitesText}}       |

  @component:feasibility-result @behavior:report-backend-error
  Scenario: A failed details request is not repeated on further clicks
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers every detail request with the issue "{{resultPolling.belowThreshold}}"
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    And the details button is enabled
    When I open the result details 3 times
    Then I see the message "{{resultPolling.belowThresholdText}}"
    And the details were requested 1 time

  @component:feasibility-result @behavior:report-backend-error
  Scenario: A rate limited details request shows the seconds to wait
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers every detail request with the issue "{{resultPolling.rateLimited}}" and retry after 4 seconds
    And I watch the result details dialog
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    When I open the result details 1 time
    Then I see the message "{{resultPolling.retryAfter4}}"
    And the result details dialog never opened
    And I see no error dialog

  @component:feasibility-result @behavior:show
  Scenario: Details of a finished result open once and are not requested again
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And I watch the detail requests
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    And the details button is enabled
    When I open the result details 1 time
    Then I see the result details dialog with sites
    And the details were requested 1 time

  @component:feasibility-result @behavior:report-backend-error
  Scenario: A rate limited query send shows the seconds to wait and counts down on the send button
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers sending the query with the issue "{{resultPolling.issueCode}}" and retry after 3 seconds
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the message "{{resultPolling.retryAfter3}}"
    When I click on the button "{{labels.editCohortSelection}}"
    Then the send button counts down
    And the send button is enabled again

  @component:feasibility-result @behavior:show
  Scenario: Entering the result page again sends the query again
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And I watch the requests that send the query
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    When I click on the button "{{labels.editCohortSelection}}"
    And I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the result
    And I see no error dialog
    And the query was sent 2 times

  @component:feasibility-result @behavior:report-backend-error
  Scenario: Details after a summary below the privacy threshold show the message
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers every result poll with the issue "{{resultPolling.belowThreshold}}"
    And the backend answers every detail request with the issue "{{resultPolling.belowThreshold}}"
    And I watch the result details dialog
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the message "{{resultPolling.belowThresholdText}}"
    And the details button is enabled
    When I open the result details 1 time
    Then I see the message "{{resultPolling.belowThresholdText}}"
    And the result details dialog never opened
    And I see no error dialog

  @component:feasibility-result @behavior:report-backend-error
  Scenario: A locked account shows its message with the seconds to wait and counts down on the send button
    Given the result polling takes 6 seconds, polls every 1 seconds and expires after 60 seconds
    And I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "{{labAge.criterium}}" via code "{{labAge.code}}" to the editor
    And I drag "{{labAge.criterium}}" criterium to the "{{labels.inclusion}}" list
    And the backend answers sending the query with the issue "{{resultPolling.locked}}" and retry after 3 seconds
    When I click on the button "{{labels.feasibility}}"
    Then I should arrive on the "{{pages.feasibilityResult}}" page
    Then I see the message "{{resultPolling.lockedText}}"
    And I see the message "{{resultPolling.retryAfter3}}"
    When I click on the button "{{labels.editCohortSelection}}"
    Then the send button counts down
    And the send button is enabled again

