# Fields tab of the profile editor a data selection box opens ("Configure"): the field list and the
# "Mark as required" panel on its right.
@area:data-selection
Feature: Data Selection Editor - fields

  Background: the profile editor of a selected feature is open
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English
    And I add the feature "{{dataSelection.conditionFeature}}" to the data selection
    When I click on the button "{{labels.showSelection}}"
    And I click the edit button on the data selection box "{{dataSelection.conditionFeature}}"
    And I click on the menu item "{{labels.configure}}"
    Then I am on the "{{pages.queryEditorProfile}}" page

  @component:data-selection-feature-editor @behavior:select
  Scenario Outline: Selecting a field lists it and deselecting a default field removes it
    When I click the "{{labels.fields}}" tab
    And I select the checkbox labeled "<added>"
    Then the field "<added>" should be in the selected fields list
    And the header lists the selected field "<added>"
    When I select the checkbox labeled "<removed>"
    Then the field "<removed>" should not be in the selected fields list
    And no chip labeled "<removed>" should appear in the "{{labels.selectedFields}}" section

    Examples:
      | added                           | removed                        |
      | {{dataSelection.selectedField}} | {{dataSelection.defaultField}} |

  @component:data-selection-feature-editor @behavior:edit-filter
  Scenario Outline: A selected field can be marked as required and optional again
    When I click the "{{labels.fields}}" tab
    Then the required option of the field "<field>" is disabled
    And the selected field "<field>" is in the "{{labels.optionalGroup}}" group
    When I toggle the required option of the field "<field>"
    Then the required option of the field "<field>" is enabled
    And the selected field "<field>" is in the "{{labels.requiredGroup}}" group
    When I toggle the required option of the field "<field>"
    Then the required option of the field "<field>" is disabled
    And the selected field "<field>" is in the "{{labels.optionalGroup}}" group

    Examples:
      | field                          |
      | {{dataSelection.defaultField}} |

  @component:data-selection-feature-editor @behavior:remove
  Scenario Outline: Removing a field in the required panel unticks it in the fields list
    When I click the "{{labels.fields}}" tab
    And I remove the field "<field>" from the selected fields list
    Then the field "<field>" should not be in the selected fields list
    And the field "<field>" is not ticked in the fields list
    And no chip labeled "<field>" should appear in the "{{labels.selectedFields}}" section

    Examples:
      | field                            |
      | {{dataSelection.removableField}} |
