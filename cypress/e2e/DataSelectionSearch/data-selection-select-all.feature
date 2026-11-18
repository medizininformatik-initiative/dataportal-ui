# The "select all" checkbox in the table header ticks every loaded row. Rows
# update a moment after the header checkbox, so the row assertions retry.
@area:data-selection
Feature: Data Selection Search - select all

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English

  @component:data-selection-search @behavior:select-all
  Scenario Outline: Adding is disabled while nothing is selected
    Then the button "<addButton>" should be disabled

    Examples:
      | addButton                 |
      | {{labels.addToSelection}} |

  @component:data-selection-search @behavior:select-all
  Scenario Outline: Select all checks every loaded row and enables adding
    When I toggle the select all checkbox of the table
    Then all rows in the table should be selected
    And the button "<addButton>" should be enabled

    Examples:
      | addButton                 |
      | {{labels.addToSelection}} |

  @component:data-selection-search @behavior:select-all
  Scenario Outline: Toggling select all a second time clears the selection
    When I toggle the select all checkbox of the table
    Then all rows in the table should be selected
    When I toggle the select all checkbox of the table
    Then no row in the table should be selected
    And the button "<addButton>" should be disabled

    Examples:
      | addButton                 |
      | {{labels.addToSelection}} |
