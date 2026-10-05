# Logging in lands on the cohort definition page. Without a cohort it shows the
# empty message, and running a feasibility query or saving is not possible yet.
# Button names and the target page are Examples data.
Feature: Cohort definition - empty state

  Background:
    Given I am logged in as a user
    And I am on the "Data Query - Cohort Definition" page
    And I set the language to English

  Scenario: A user without a cohort sees the empty message
    Then the cohort definition should show the empty message

  Scenario Outline: Feasibility query and save are disabled without a cohort
    Then the button "<feasibility>" should be disabled
    And the button "<save>" should be disabled

    Examples:
      | feasibility       | save        |
      | Feasibility Query | Save cohort |

  Scenario Outline: New cohort opens the criteria search
    When I click on the button "<newCohort>"
    Then I should arrive on the "<page>" page

    Examples:
      | newCohort  | page               |
      | New Cohort | Feasibility Search |
