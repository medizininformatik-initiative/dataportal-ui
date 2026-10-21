@area:feasibility-query
Feature: Cohort Result

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:feasibility-result @behavior:save
  Scenario Outline: Adding a criterium through to saving the resulting cohort
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
    And I see the spinner is visible
    Then I see the result

    Examples:
      | criterium            | code            | title                | comment              |
      | {{labAge.criterium}} | {{labAge.code}} | {{cohortResult.bla}} | {{cohortResult.bla}} |
