@area:feasibility-query
Feature: Cohort Exclusion

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  @component:feasibility-editor @behavior:exclude
  Scenario Outline: Adding a criterium to the Exclusion list keeps it out of Inclusion
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I drag "<criterium>" criterium to the "Exclusion" list
    Then I should see the criterium "<criterium>" in the "Exclusion" list
    And I should not see the criterium "<criterium>" in the "Inclusion" list

    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |

  @component:feasibility-editor @behavior:move
  Scenario Outline: Moving a criterium from Inclusion to Exclusion empties Inclusion and disables Feasibility
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    And I drag "<criterium>" criterium to the "Inclusion" list
    And the "Inclusion" list should contain 1 criteria
    When I drag "<criterium>" criterium to the "Exclusion" list
    Then the "Inclusion" list should contain 0 criteria
    And the "Exclusion" list should contain 1 criteria
    And the button "Feasibility" should be disabled

    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |

  @component:feasibility-editor @behavior:move
  Scenario Outline: Moving a criterium from Exclusion to Inclusion empties Exclusion and enables Feasibility
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    And I drag "<criterium>" criterium to the "Exclusion" list
    And the "Exclusion" list should contain 1 criteria
    And the button "Feasibility" should be disabled
    When I drag "<criterium>" criterium to the "Inclusion" list
    Then the "Exclusion" list should contain 0 criteria
    And the "Inclusion" list should contain 1 criteria
    And the button "Feasibility" should be enabled

    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |
