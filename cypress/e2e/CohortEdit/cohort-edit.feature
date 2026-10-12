@area:feasibility-query
Feature: Cohort editing
  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  @component:feasibility-editor @behavior:add
  Scenario Outline: Adding a criterium to the Inclusion list enables running Feasibility
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    Then I should see the criterium "<criterium>" in the editor
    When I drag "<criterium>" criterium to the "Inclusion" list
    Then the button "Feasibility" should be enabled
    When I click on the button "Feasibility"
    Then I am on the "Feasibility Result" page
    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |

  Rule: A criterium with a mandatory value filter keeps Feasibility disabled until the filter is set

    @component:feasibility-editor @behavior:mandatory-filter
    Scenario Outline: A criterium with an unset mandatory value filter keeps Feasibility disabled
      Given I add the criterium "<criterium>" via code "<code>" to the editor
      When I drag "<criterium>" criterium to the "Inclusion" list
      Then the "Inclusion" list should contain 1 criteria
      And the button "Feasibility" should be disabled

      Examples:
        | criterium         | code         |
        | {{age.criterium}} | {{age.code}} |

    @component:feasibility-editor @behavior:mandatory-filter
    Scenario Outline: Setting the mandatory value filter enables Feasibility
      Given I add the criterium "<criterium>" via code "<code>" to the editor
      And I drag "<criterium>" criterium to the "Inclusion" list
      And the button "Feasibility" should be disabled
      When I open the menu
      And I click on the menu item "Configure"
      And I select "<comparator>" from the panel with the name "<criterium>"
      And I select a value of <value>
      And I select the unit "<unit>"
      Then I should see "<chip_value>" applied in the filter summary
      When I click on the button "Close"
      Then I am on the "Feasibility Editor" page
      And the button "Feasibility" should be enabled

      Examples:
        | criterium         | code         | comparator | value | unit         | chip_value |
        | {{age.criterium}} | {{age.code}} | greater    | 5     | {{age.unit}} | > 5 a      |
