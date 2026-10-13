@area:feasibility-query
Feature: Cohort editing
  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:feasibility-editor @behavior:add
  Scenario Outline: Adding a criterium to the Inclusion list enables running Feasibility
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    Then I should see the criterium "<criterium>" in the editor
    When I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
    Then the button "{{labels.feasibility}}" should be enabled
    When I click on the button "{{labels.feasibility}}"
    Then I am on the "{{pages.feasibilityResult}}" page
    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |

  Rule: A criterium with a mandatory value filter keeps Feasibility disabled until the filter is set

    @component:feasibility-editor @behavior:mandatory-filter
    Scenario Outline: A criterium with an unset mandatory value filter keeps Feasibility disabled
      Given I add the criterium "<criterium>" via code "<code>" to the editor
      When I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
      Then the "{{labels.inclusion}}" list should contain 1 criteria
      And the button "{{labels.feasibility}}" should be disabled

      Examples:
        | criterium         | code         |
        | {{age.criterium}} | {{age.code}} |

    @component:feasibility-editor @behavior:mandatory-filter
    Scenario Outline: Setting the mandatory value filter enables Feasibility
      Given I add the criterium "<criterium>" via code "<code>" to the editor
      And I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
      And the button "{{labels.feasibility}}" should be disabled
      When I open the menu
      And I click on the menu item "{{labels.configure}}"
      And I select "<comparator>" from the panel with the name "<criterium>"
      And I select a value of <value>
      And I select the unit "<unit>"
      Then I should see "<chip_value>" applied in the filter summary
      When I click on the button "{{labels.close}}"
      Then I am on the "{{pages.feasibilityEditor}}" page
      And the button "{{labels.feasibility}}" should be enabled

      Examples:
        | criterium         | code         | comparator | value | unit         | chip_value                           |
        | {{age.criterium}} | {{age.code}} | greater    | 5     | {{age.unit}} | {{quantityComparatorUpdateChip.v5A}} |
