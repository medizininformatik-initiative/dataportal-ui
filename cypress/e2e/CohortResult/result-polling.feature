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
