# Model: Criterion.valueFilter of type quantity-range (minValue, maxValue, unit).
# quantity-range.component.ts only applies the filter when minValue <= maxValue; otherwise it shows
# FEASIBILITY.HINT.MINIMUM_GREATER_MAXIMUM and emits nothing. The unit has to be set first.
# Checked in the running app (Current chronological age): the operator offers exactly none, equal,
# less than, greater than and between (CCDL: eq, lt, gt, quantity-range - no ge, le or ne), the units
# are a and mo, and the unit only counts once it is SELECTED: the dropdown shows `a` from the start,
# but no warning appears until the unit is picked. An invalid pair leaves the previous valid filter
# in place instead of clearing it, so the scenario starts from "no filter".
# Note: per the code, equal values are accepted (`min <= max`) although the message says "less than".
# Data: `Current chronological age` is the one criterium with a quantity value filter (TEST_DATA.md).
@area:feasibility-query
Feature: Value filter (quantity-range) - minimum greater than maximum
  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  @component:criterion-editor @behavior:reject-invalid-range @filter:value-filter @type:quantity-range @comparator:between
  Scenario Outline: A quantity range whose minimum is greater than its maximum is rejected
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    And I click on the menu item "Configure"
    And I select "<comparator>" from the panel with the name "<panel_name>"
    And I select the unit "<unit>"
    And I select a minimum of <min> and a maximum of <max>
    Then I see the quantity range warning "<warning>"
    When I click on the button "Close"
    Then I am on the "Feasibility Editor" page
    And the criterium "<criterium>" shows no filter chips

    Examples:
      | criterium         | code         | panel_name        | comparator | unit         | min | max | warning                                               |
      | {{age.criterium}} | {{age.code}} | {{age.criterium}} | between    | {{age.unit}} | 20  | 10  | The minimum value must be less than the maximum value |

  @component:criterion-editor @behavior:offer-comparators @filter:value-filter @type:quantity-comparator
  Scenario Outline: The operator of a quantity value filter offers exactly the supported comparators
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    And I click on the menu item "Configure"
    Then the operator of the panel "<panel_name>" offers "<comparators>"

    Examples:
      | criterium         | code         | panel_name        | comparators                                        |
      | {{age.criterium}} | {{age.code}} | {{age.criterium}} | No filter, equal, less than, greater than, between |
