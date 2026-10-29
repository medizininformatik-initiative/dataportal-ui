@area:feasibility-query
Feature: Cohort Result

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:feasibility-result @behavior:save
  Scenario Outline: A criterium is saved as a cohort, its feasibility result is shown and the saved cohort is deleted
    When I add the criterium "<criterium>" via code "<code>" to the editor
    Then I should see the criterium "<criterium>" in the editor
    When I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
    And I click on the button "{{labels.saveCohort}}"
    Then I see a dialog
    When I add the title "<title>"
    And I add the comment "<comment>"
    And I save the cohort
    Then I should see the dialog closing
    When I click on the button "{{labels.feasibility}}"
    Then I am on the "{{pages.feasibilityResult}}" page
    Then I see the result
    When I navigate to the "{{pages.savedQueries}}" page
    And I delete the saved query "<title>"
    Then I should not see the saved query "<title>" in the list

    Examples:
      | criterium            | code            | title                  | comment                  |
      | {{labAge.criterium}} | {{labAge.code}} | {{cohortResult.title}} | {{cohortResult.comment}} |
