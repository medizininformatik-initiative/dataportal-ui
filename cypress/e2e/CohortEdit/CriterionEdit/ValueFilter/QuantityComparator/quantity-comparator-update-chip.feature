# Model: Criterion.valueFilter of type quantity-comparator (comparator, value, unit).
# Data: `Current chronological age` is the one criterium with a quantity value filter (TEST_DATA.md).
@area:feasibility-query
Feature: Value filter (quantity-comparator) - comparator, value and unit
  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  @component:criterion-editor @behavior:update-chip @filter:value-filter @type:quantity-comparator @comparator:gt
  Scenario Outline: Changing the comparator of a value filter updates its chip
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    When I click on the menu item "Configure"
    Then I see the panel with the name "<panel_name>"
    And I should see "<default_comparator>" selected in the panel "<panel_name>"
    When I select "<new_comparator>" from the panel with the name "<panel_name>"
    Then I should see "<new_comparator>" selected in the panel "<panel_name>"
    When I select a value of <value>
    And I select the unit "<unit>"
    Then I should see "<chip_value>" applied in the filter summary
    And I click on the button "Close"
    Then I am on the "Feasibility Editor" page
    And I should see "<criterium>" in the cohort criteria list with "<panel_name>" and "<chip_value>" selected
    Examples:
      | criterium         | code         | default_comparator | new_comparator | panel_name        | value | unit         | chip_value |
      | {{age.criterium}} | {{age.code}} | No filter          | greater        | {{age.criterium}} | 5     | {{age.unit}} | > 5 a      |
