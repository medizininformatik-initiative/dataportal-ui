# Upload of a data definition whose feature has a date filter: the code filter of that feature stays usable (#453).
@area:data-selection
Feature: CRTDL upload - code filter after upload

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.dataQueryCohortDefinition}}" page
    And I set the language to English

  @component:data-selection-feature-editor @behavior:edit-filter @filter:attribute-filter @type:concept
  Scenario Outline: A code filter can be added to an uploaded feature that has a date filter
    When I upload the generated data definition "<case>"
    Then the "{{labels.inclusion}}" list should contain 1 criteria
    When I navigate to the "{{languageSwitch.dataSelection}}" page
    And I click on the button "{{labels.showSelection}}"
    And I click the edit button on the data selection box "{{dataSelection.conditionFeatureDe}}"
    And I click on the menu item "{{labels.configure}}"
    Then I should arrive on the "{{pages.queryEditorProfile}}" page
    When I click the "<filterTab>" tab
    And I search for the concept "<code>"
    And I select the concept "<code>"
    Then a chip labeled "<concept>" should appear in the "{{labels.selectedFilters}}" section

    Examples:
      | case                     | filterTab                            | code                            | concept                            |
      | feature with date filter | {{dataSelection.conditionFilterTab}} | {{dataSelection.conditionCode}} | {{dataSelection.conditionConcept}} |
