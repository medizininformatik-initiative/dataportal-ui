# Negative paths of the data selection search: nothing found. The criteria search has the same
# scenarios in search-failures.feature.
@area:data-selection
Feature: Data selection search - nothing found

  Background:
    Given I am logged in as a user

  @component:data-selection-search @behavior:report-not-found
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
  @component:data-selection-search @behavior:report-not-found
  @pending
  Scenario Outline: The data selection search says so too
    Given I am on the "Data Selection Search" page
    And I set the language to English
    When I type "<term>" in the search input field
    Then I should see the no-results message for "<term>"

    Examples:
      | term      |
      | zzzqqqxxx |
