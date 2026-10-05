Feature: Cohort Exclusion

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  Scenario Outline: Adding a criterium to the Exclusion list keeps it out of Inclusion
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I drag "<criterium>" criterium to the "Exclusion" list
    Then I should see the criterium "<criterium>" in the "Exclusion" list
    And I should not see the criterium "<criterium>" in the "Inclusion" list

    Examples:
      | criterium | code               |
      | Pneumonia | {{pneumonia.code}} |
