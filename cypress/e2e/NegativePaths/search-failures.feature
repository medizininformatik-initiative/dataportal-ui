# Negative paths of the search pages: nothing found, a slow backend, and a failing backend.
# The error dialog (`num-error-display`) is shown for every non-validation HTTP error, so these
# scenarios check that it appears, can be closed, and leaves the page usable. How its content
# reads is covered by the @pending scenarios below: they describe the behaviour a user should
# get, and fail today (see the comments).
@area:feasibility-query
Feature: Search - nothing found and backend failures

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  Scenario Outline: A search without matches says so and offers nothing to add
    When I type "<term>" in the search input field
    Then I should see the no-results message for "<term>"
    And the button "Add to cohort selection" should be disabled
    When I clear the search input field
    Then the table should have 20 rows

    Examples:
      | term      |
      | zzzqqqxxx |

  Scenario Outline: The data selection search shows no rows and offers nothing to add
    Given I am on the "Data Selection Search" page
    And I set the language to English
    When I type "<term>" in the search input field
    Then the table should have 0 rows
    And the button "Add to Selection" should be disabled
    When I clear the search input field
    Then the table should have 20 rows

    Examples:
      | term      |
      | zzzqqqxxx |

  # DEFECT: unlike the criteria search, the data selection search renders an empty table with
  # only its header row when nothing matches - no "could not find any results" message.
  @pending
  Scenario Outline: The data selection search says so too
    Given I am on the "Data Selection Search" page
    And I set the language to English
    When I type "<term>" in the search input field
    Then I should see the no-results message for "<term>"

    Examples:
      | term      |
      | zzzqqqxxx |

  Scenario Outline: A slow backend answer is still shown without an error
    Given the backend answers requests to "terminology/entry/search" only after <seconds> seconds
    When I type "<term>" in the search input field
    Then the table should show results within 20 seconds
    And no error dialog is shown

    Examples:
      | term      | seconds |
      | pneumonia | 6       |

  Scenario Outline: A backend error on search opens an error dialog that can be closed
    Given the backend answers requests to "terminology/entry/search" with status <status>
    When I type "<term>" in the search input field
    Then an error dialog is shown
    When I close the error dialog
    Then no error dialog is shown
    And the search input should keep the text "<term>"

    Examples:
      | term      | status |
      | pneumonia | 500    |
      | pneumonia | 504    |

  Scenario Outline: A backend that cannot be reached opens an error dialog
    Given the backend cannot be reached for requests to "terminology/entry/search"
    When I type "<term>" in the search input field
    Then an error dialog is shown
    When I close the error dialog
    Then no error dialog is shown

    Examples:
      | term      |
      | pneumonia |

  # DEFECT: a network failure and a 504 render `Error 1: [object Object]`, because the raw
  # HttpErrorResponse is stringified (`DataportalErrorHandlerService`, non-validation branch).
  @pending
  Scenario Outline: A failed request is described in words, not as an object
    Given the backend cannot be reached for requests to "terminology/entry/search"
    When I type "<term>" in the search input field
    Then an error dialog is shown
    And the error dialog does not show "[object Object]"

    Examples:
      | term      |
      | pneumonia |

  # DEFECT: the dialog title is the raw error type `GENERIC_ERROR` (hard-coded, untranslated),
  # and the 500 body says "No error details available".
  @pending
  Scenario Outline: The error dialog has a readable title
    Given the backend answers requests to "terminology/entry/search" with status 500
    When I type "<term>" in the search input field
    Then an error dialog is shown
    And the error dialog does not show "GENERIC_ERROR"

    Examples:
      | term      |
      | pneumonia |

  # DEFECT: `HttpErrorHandlerService` handles 401 as "Not implemented", so an API answering
  # "unauthorised" (revoked token, restarted backend) shows the generic error dialog instead
  # of sending the user back to the sign-in page.
  @pending
  Scenario: An API that rejects the token sends the user to sign in
    Given my session has expired
    When I type "pneumonia" in the search input field
    Then I am asked to sign in
