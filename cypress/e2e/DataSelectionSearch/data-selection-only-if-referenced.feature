# Regression for https://github.com/medizininformatik-initiative/dataportal-ui/issues/641
# ("Cannot set onlyIfReferenced", fix: commit 2edcb284 on develop). `isReferenced` of
# `data-selection-boxes` compared against a shadowed variable, so no box ever offered the
# "Only if referenced" option. The issue explicitly asks for a UI test that the option is there.
@area:data-selection
Feature: Data Selection - Only if referenced

  Background: I am logged in and have a data selection with a profile that references another
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English

  @component:data-selection-editor @behavior:toggle-only-if-referenced
  Scenario Outline: A referenced profile offers the "Only if referenced" option and it can be switched off and on
    Given I type "<feature>" in the search input field
    And I select the checkbox in the row containing "<feature>"
    When I click on the button "{{labels.addToSelection}}"
    And I click on the button "{{labels.showSelection}}"
    And I click the edit button on the data selection box "<feature>"
    And I click on the menu item "{{labels.configure}}"
    And I click the "{{labels.references}}" tab
    And I click the "{{labels.partOf}}" tab
    And I click to add a new reference
    And I add a reference named "<reference>"
    And I add the reference
    Then a chip labeled "<reference>" should appear in the "{{labels.selectedReference}}" section
    When I click on the button "{{labels.close}}"
    Then the data selection box "<reference>" offers the "{{labels.onlyIfReferenced}}" option
    And the data selection box "<feature>" does not offer the "{{labels.onlyIfReferenced}}" option
    And the "{{labels.onlyIfReferenced}}" option of the data selection box "<reference>" is enabled
    When I toggle the "{{labels.onlyIfReferenced}}" option of the data selection box "<reference>"
    Then the "{{labels.onlyIfReferenced}}" option of the data selection box "<reference>" is disabled
    When I toggle the "{{labels.onlyIfReferenced}}" option of the data selection box "<reference>"
    Then the "{{labels.onlyIfReferenced}}" option of the data selection box "<reference>" is enabled

    Examples:
      | feature                   | reference                   |
      | {{dataSelection.feature}} | {{dataSelection.reference}} |
