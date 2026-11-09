@area:feasibility-query
Feature: Cohort Search

  Background: I am logged in and on the Cohort Search page
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:criteria-search @behavior:search
  Scenario Outline: Search for Criterium "<criterium>"
    Given the table should have 20 rows
    And the button "<button1>" should be disabled
    And the button "<button2>" should be disabled
    When I type "<criterium>" in the search input field
    Then I should see a row containing "<criterium>"
    When I clear the search input field
    Then the table should have 20 rows

    Examples: Search Criteria
      | criterium                 | button1                         | button2                              |
      | {{pneumonia.criterium}}   | {{labels.addToCohortSelection}} | {{cohortSearch.showCohortSelection}} |
      | {{cohortSearch.diabetes}} | {{labels.addToCohortSelection}} | {{cohortSearch.showCohortSelection}} |

  # Searched by termcode: a name search for "Age" is outranked by unrelated "...age..."
  # matches, so the exact row is not on the first page (see cypress/CLAUDE.md).
  @component:criteria-search @behavior:select
  Scenario Outline: Select Cohort elements
    When I type "<code>" in the search input field
    When I select the checkbox in the row containing "<criterium>"
    And I click on the button "<button1>"
    Then the button "<button2>" should be enabled
    And the button "<button1>" should be disabled
    When I click on the button "<button2>"
    Then I should arrive on the "{{pages.feasibilityEditor}}" page

    Examples: Selection Criteria
      | criterium            | code            | button1                         | button2                              |
      | {{labAge.criterium}} | {{labAge.code}} | {{labels.addToCohortSelection}} | {{cohortSearch.showCohortSelection}} |
