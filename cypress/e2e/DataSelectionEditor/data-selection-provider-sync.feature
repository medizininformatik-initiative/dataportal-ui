# Each data selection profile is held twice: in `DataSelectionProviderService` (what the editor renders)
# and in `ProfileProviderService` (what most edit paths read). A write that reaches only one of them is
# overwritten later from the stale copy. DataSelectionProviderService now writes both on every
# change; each scenario below pins one path that broke before.
@area:data-selection
Feature: Data Selection Editor - profile stores stay in sync

  Background: three features are selected, two of them with a recommended reference
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English
    And I add the feature "{{dataSelection.conditionFeature}}" to the data selection
    And I add the feature "{{dataSelection.oncologyFeature}}" to the data selection
    And I add the feature "{{dataSelection.deathFeature}}" to the data selection
    When I click on the button "{{labels.showSelection}}"
    Then I should arrive on the "{{pages.dataSelectionEditor}}" page

  # Bug from video ref_bug.mp4: target is referenced (has the option) and references back (has a
  # "Required" tile). Toggling the option twice, then "Required", reset the option from the stale store.
  @component:data-selection-editor @behavior:toggle-only-if-referenced
  Scenario Outline: "Only if referenced" keeps its state when "Required" of the same box is toggled
    When I click the unresolved reference warning of the data selection box "<feature>"
    And I link the reference to the feature "<target>"
    And I click on the button "{{labels.close}}"
    And I click the unresolved reference warning of the data selection box "<target>"
    And I link the reference to the feature "<feature>"
    And I click on the button "{{labels.close}}"
    Then the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>" is disabled
    When I toggle the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>"
    And I toggle the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>"
    And I toggle the required option of the reference "<reference>" in the data selection box "<target>"
    Then the required option of the reference "<reference>" in the data selection box "<target>" is enabled
    And the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>" is disabled
    When I toggle the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>"
    And I toggle the required option of the reference "<reference>" in the data selection box "<target>"
    Then the required option of the reference "<reference>" in the data selection box "<target>" is disabled
    And the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>" is enabled

    Examples:
      | feature                            | target                            | reference                        |
      | {{dataSelection.conditionFeature}} | {{dataSelection.oncologyFeature}} | {{dataSelection.referenceField}} |

  # Was: RemoveReferenceService.delete removed the profile only from DataSelectionProviderService. "Apply
  # time period to all" read ProfileProviderService and wrote the deleted profile back.
  @component:data-selection-editor @behavior:delete
  Scenario Outline: A deleted feature stays deleted after a time restriction is applied to all features
    When I click the edit button on the data selection box "<feature>"
    And I click on the menu item "{{criteriumActions.delete}}"
    Then the data selection box "<feature>" is not shown
    When I apply no time restriction to all features
    Then the data selection box "<feature>" is not shown

    Examples:
      | feature                            |
      | {{dataSelection.conditionFeature}} |

  # Was: duplicate pushed into the same profiles array, so `toSignal(getActiveProfiles())` sees the same
  # reference and `canMoveDown` of the formerly last box was never recomputed.
  @component:data-selection-editor @behavior:duplicate
  Scenario Outline: The formerly last box can move down after a feature is duplicated
    Then the move down button of the data selection box "<last>" is disabled
    When I click the edit button on the data selection box "<feature>"
    And I click on the menu item "{{criteriumActions.duplicate}}"
    Then the move down button of the data selection box "<last>" is enabled

    Examples:
      | feature                            | last                           |
      | {{dataSelection.conditionFeature}} | {{dataSelection.deathFeature}} |

  # Was: removing the only link hid the option, but `isReferenceSet` stayed true and was exported as
  # `includeReferenceOnly`. Removing the last link now resets the flag.
  @component:data-selection-editor @behavior:toggle-only-if-referenced
  Scenario Outline: "Only if referenced" is reset when the last link to the feature is removed
    When I click the unresolved reference warning of the data selection box "<feature>"
    And I link the reference to the feature "<target>"
    And I click on the button "{{labels.close}}"
    And I toggle the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>"
    Then the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>" is enabled
    When I remove the reference "<reference>" of the data selection box "<feature>"
    Then the data selection box "<target>" does not offer the "{{labels.onlyIfReferenced}}" option
    When I click the unresolved reference warning of the data selection box "<feature>"
    And I link the reference to the feature "<target>"
    And I click on the button "{{labels.close}}"
    Then the "{{labels.onlyIfReferenced}}" option of the data selection box "<target>" is disabled

    Examples:
      | feature                            | target                            | reference                        |
      | {{dataSelection.conditionFeature}} | {{dataSelection.oncologyFeature}} | {{dataSelection.referenceField}} |
