@area:feasibility-query
Feature: Cohort Exclusion

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:feasibility-editor @behavior:exclude
  Scenario Outline: Adding a criterium to the Exclusion list keeps it out of Inclusion
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I drag "<criterium>" criterium to the "{{labels.exclusion}}" list
    Then I should see the criterium "<criterium>" in the "{{labels.exclusion}}" list
    And I should not see the criterium "<criterium>" in the "{{labels.inclusion}}" list

    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |

  @component:feasibility-editor @behavior:move
  Scenario Outline: Moving a criterium from Inclusion to Exclusion empties Inclusion and disables Feasibility
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    And I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
    And the "{{labels.inclusion}}" list should contain 1 criteria
    When I drag "<criterium>" criterium to the "{{labels.exclusion}}" list
    Then the "{{labels.inclusion}}" list should contain 0 criteria
    And the "{{labels.exclusion}}" list should contain 1 criteria
    And the button "{{labels.feasibility}}" should be disabled

    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |

  @component:feasibility-editor @behavior:move
  Scenario Outline: Moving a criterium from Exclusion to Inclusion empties Exclusion and enables Feasibility
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    And I drag "<criterium>" criterium to the "{{labels.exclusion}}" list
    And the "{{labels.exclusion}}" list should contain 1 criteria
    And the button "{{labels.feasibility}}" should be disabled
    When I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
    Then the "{{labels.exclusion}}" list should contain 0 criteria
    And the "{{labels.inclusion}}" list should contain 1 criteria
    And the button "{{labels.feasibility}}" should be enabled

    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |
