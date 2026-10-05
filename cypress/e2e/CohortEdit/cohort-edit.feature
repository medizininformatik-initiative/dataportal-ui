Feature: Cohort editing
  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  Scenario Outline: Applying a time-restriction filter to a criterium
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    When I click on the menu item "Configure"
    Then I am on the "Query Editor - Criteria" page
    When I set the time restriction filter to <filterType> with date "<date>"
    When I click on the button "Close"
    Then I am on the "Feasibility Editor" page
    Then I see the criterium "<criterium>" with filter chip "<date>" in the block "<block>"
    When I drag "<criterium>" criterium to the "Inclusion" list
    Then the button "Feasibility" should be enabled
    When I click on the button "Feasibility"
    Then I am on the "Feasibility Result" page
    When I click on the button "Edit cohort selection"
    Then I am on the "Feasibility Editor" page
    Examples:
      | criterium    | code                      | filterType | date       | block  |
      | Pneumonia    | {{pneumonia.code}}        | before     | 04.04.2045 | before |
      | Appendectomy | {{appendectomy.code}}     | before     | 04.04.2045 | before |
      | Pneumonia    | {{pneumonia.code}}        | on         | 04.04.2045 | at     |
      | Appendectomy | {{appendectomy.code}}     | after      | 04.04.2045 | after  |


  Scenario Outline: Changing a criterium's filter comparison updates its chip
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    When I click on the menu item "Configure"
    Then I see the panel with the name "<panel_name>"
    And I should see "<default_filter>" selected in the panel "<panel_name>"
    When I select "<new_filter>" from the panel with the name "<panel_name>"
    Then I should see "<new_filter>" selected in the panel "<panel_name>"
    When I select a value of <value>
    And I select the unit "<unit>"
    Then I should see "<chip_value>" applied in the filter summary
    And I click on the button "Close"
    Then I am on the "Feasibility Editor" page
    And I should see "<criterium>" in the cohort criteria list with "<panel_name>" and "<chip_value>" selected
    Examples:
      | criterium                | code      | default_filter | new_filter | panel_name                | value | unit | chip_value |
      | Current chronological age | 424144002 | No filter      | greater    | Current chronological age | 5     | a    | > 5 a      |


  Scenario Outline: Adding a criterium to the Inclusion list enables running Feasibility
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    Then I should see the criterium "<criterium>" in the editor
    When I drag "<criterium>" criterium to the "Inclusion" list
    Then the button "Feasibility" should be enabled
    When I click on the button "Feasibility"
    Then I am on the "Feasibility Result" page
    Examples:
      | criterium | code               |
      | Pneumonia | {{pneumonia.code}} |
