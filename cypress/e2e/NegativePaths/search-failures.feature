# Negative paths of the search pages: nothing found, a slow backend, and a failing backend.
# The error dialog (`num-error-display`) is shown for every non-validation HTTP error, so these
# scenarios check that it appears, can be closed, and leaves the page usable, and that its
# content reads as words. The @pending scenario below describes behaviour that fails today.
@area:feasibility-query
Feature: Search - nothing found and backend failures

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:criteria-search @behavior:report-not-found
  Scenario Outline: A search without matches says so and offers nothing to add
    When I type "<term>" in the search input field
    Then I should see the no-results message for "<term>"
    And the button "{{labels.addToCohortSelection}}" should be disabled
    When I clear the search input field
    Then the table should have 20 rows

    Examples:
      | term                                      |
      | {{dataSelectionSearchFailures.zzzqqqxxx}} |

  @component:criteria-search @behavior:tolerate-slow-backend
  Scenario Outline: A slow backend answer is still shown without an error
    Given the backend answers requests to "<endpoint>" only after <seconds> seconds
    When I type "<term>" in the search input field
    Then the table should show results within 20 seconds
    And no error dialog is shown

    Examples:
      | term                         | seconds | endpoint                                  |
      | {{searchFailures.pneumonia}} | 6       | {{searchFailures.terminologyEntrySearch}} |

  @component:criteria-search @behavior:report-backend-error
  Scenario Outline: A backend error on search opens an error dialog that can be closed
    Given the backend answers requests to "<endpoint>" with status <status>
    When I type "<term>" in the search input field
    Then an error dialog is shown
    When I close the error dialog
    Then no error dialog is shown
    And the search input should keep the text "<term>"

    Examples:
      | term                         | status | endpoint                                  |
      | {{searchFailures.pneumonia}} | 500    | {{searchFailures.terminologyEntrySearch}} |
      | {{searchFailures.pneumonia}} | 504    | {{searchFailures.terminologyEntrySearch}} |

  @component:criteria-search @behavior:report-backend-error
  Scenario Outline: A backend that cannot be reached opens an error dialog
    Given the backend cannot be reached for requests to "<endpoint>"
    When I type "<term>" in the search input field
    Then an error dialog is shown
    When I close the error dialog
    Then no error dialog is shown

    Examples:
      | term                         | endpoint                                  |
      | {{searchFailures.pneumonia}} | {{searchFailures.terminologyEntrySearch}} |

  @component:criteria-search @behavior:report-backend-error
  Scenario Outline: A failed request is described in words, not as an object
    Given the backend cannot be reached for requests to "<endpoint>"
    When I type "<term>" in the search input field
    Then an error dialog is shown
    And the error dialog does not show "<text>"
    And the error dialog shows "<reason>"
    And the error dialog shows "<request>"

    Examples:
      | term                         | endpoint                                  | text                            | reason                          | request                                |
      | {{searchFailures.pneumonia}} | {{searchFailures.terminologyEntrySearch}} | {{searchFailures.objectObject}} | {{searchFailures.unknownError}} | {{searchFailures.searchtermPneumonia}} |

  @component:criteria-search @behavior:report-backend-error
  Scenario Outline: The error dialog names status, backend message and request of a failed search
    Given the backend answers requests to "<endpoint>" with status <status> and message "<message>"
    When I type "<term>" in the search input field
    Then an error dialog is shown
    And the error dialog is titled "<title>"
    And the error dialog shows "<code>"
    And the error dialog shows "<message>"
    And the error dialog shows "<request>"

    Examples:
      | term                         | endpoint                                  | status | message                                     | title                                 | code                       | request                                |
      | {{searchFailures.pneumonia}} | {{searchFailures.terminologyEntrySearch}} | 400    | {{searchFailures.invalidSearchTerm}}        | {{searchFailures.somethingWentWrong}} | {{searchFailures.code400}} | {{searchFailures.searchtermPneumonia}} |
      | {{searchFailures.pneumonia}} | {{searchFailures.terminologyEntrySearch}} | 404    | {{searchFailures.noSuchEndpoint}}           | {{searchFailures.somethingWentWrong}} | {{searchFailures.code404}} | {{searchFailures.searchtermPneumonia}} |
      | {{searchFailures.pneumonia}} | {{searchFailures.terminologyEntrySearch}} | 500    | {{searchFailures.elasticsearchUnavailable}} | {{searchFailures.somethingWentWrong}} | {{searchFailures.code500}} | {{searchFailures.searchtermPneumonia}} |
      | {{searchFailures.pneumonia}} | {{searchFailures.terminologyEntrySearch}} | 504    | {{searchFailures.gatewayTimeout}}           | {{searchFailures.somethingWentWrong}} | {{searchFailures.code504}} | {{searchFailures.searchtermPneumonia}} |

  @component:criteria-search @behavior:report-backend-error
  Scenario Outline: The error dialog has a readable title
    Given the backend answers requests to "<endpoint>" with status 500
    When I type "<term>" in the search input field
    Then an error dialog is shown
    And the error dialog does not show "<text>"

    Examples:
      | term                         | endpoint                                  | text                            |
      | {{searchFailures.pneumonia}} | {{searchFailures.terminologyEntrySearch}} | {{searchFailures.gENERICERROR}} |

  # DEFECT: `HttpErrorHandlerService` has no own 401 handling, so an API answering
  # "unauthorised" (revoked token, restarted backend) shows an error dialog with code 401 instead
  # of sending the user back to the sign-in page.
  @component:criteria-search @behavior:report-backend-error
  @pending
  Scenario Outline: An API that rejects the token sends the user to sign in
    Given my session has expired
    When I type "<term>" in the search input field
    Then I am asked to sign in

    Examples:
      | term                         |
      | {{searchFailures.pneumonia}} |
