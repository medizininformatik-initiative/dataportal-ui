# Information tab of the profile editor a data selection box opens ("Configure").
@area:data-selection
Feature: Data Selection Editor - information

  Background: the profile editor of a selected feature is open
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English
    And I add the feature "{{dataSelection.conditionFeature}}" to the data selection
    When I click on the button "{{labels.showSelection}}"
    And I click the edit button on the data selection box "{{dataSelection.conditionFeature}}"
    And I click on the menu item "{{labels.configure}}"
    Then I am on the "{{pages.queryEditorProfile}}" page

  @component:data-selection-feature-editor @behavior:show
  Scenario Outline: The information tab explains fields, references, time restriction and concepts
    When I click the "{{labels.information}}" tab
    Then the information tab explains "<title>"

    Examples:
      | title                          |
      | {{labels.infoFields}}          |
      | {{labels.infoReferences}}      |
      | {{labels.infoTimeRestriction}} |
      | {{labels.infoTokenFilter}}     |
