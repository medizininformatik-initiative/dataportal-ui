@area:feasibility-query
Feature: Cohort Result

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  Scenario Outline: Adding a criterium through to saving the resulting cohort
    When I add the criterium "<criterium>" via code "<code>" to the editor
    Then I should see the criterium "<criterium>" in the editor
    When I drag "<criterium>" criterium to the "Inclusion" list
    And I click on the button "Save cohort"
    Then I see a dialog
    When I add the title "Bla"
    And I add the comment "Bla"
    And I save the cohort
    Then I should see the dialog closing
    When I click on the button "Feasibility"
    Then I am on the "Feasibility Result" page
    And I see the spinner is visible
    Then I see the result

    Examples:
      | criterium | code    |
      | Age       | 30525-0 |
