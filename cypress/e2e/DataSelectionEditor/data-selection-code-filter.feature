# Code Filter tab of the profile editor a data selection box opens ("Configure").
@area:data-selection
Feature: Data Selection Editor - code filter

  Background: the profile editor of a selected feature is open
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English
    And I add the feature "{{dataSelection.conditionFeature}}" to the data selection
    When I click on the button "{{labels.showSelection}}"
    And I click the edit button on the data selection box "{{dataSelection.conditionFeature}}"
    And I click on the menu item "{{labels.configure}}"
    Then I am on the "{{pages.queryEditorProfile}}" page

  @component:data-selection-feature-editor @behavior:edit-filter
  Scenario Outline: A code filter concept shows as a filter chip and can be removed again
    When I click the "<filterTab>" tab
    And I search for the concept "<code>"
    And I select the concept "<code>"
    Then a chip labeled "<concept>" should appear in the "{{labels.selectedFilters}}" section
    And the concept filter tab "{{labels.selectedConcepts}}" shows the count 1
    When I open the concept filter tab "{{labels.selectedConcepts}}"
    And I remove the concept "<code>" from the selected concepts list
    Then no chip labeled "<concept>" should appear in the "{{labels.selectedFilters}}" section

    Examples:
      | filterTab                            | code                            | concept                            |
      | {{dataSelection.conditionFilterTab}} | {{dataSelection.conditionCode}} | {{dataSelection.conditionConcept}} |

