# References of a data selection: a Condition profile has the recommended reference field "ReferenzPrimaerdiagnose".
# Until it is linked to another selected feature its box shows a red warning; clicking it opens the profile
# editor on that reference's tab. Cause of Death has no such field.
@area:data-selection
Feature: Data Selection Editor - references

  Background: three features are selected, two of them with a recommended reference
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English
    And I add the feature "{{dataSelection.conditionFeature}}" to the data selection
    And I add the feature "{{dataSelection.oncologyFeature}}" to the data selection
    And I add the feature "{{dataSelection.deathFeature}}" to the data selection
    When I click on the button "{{labels.showSelection}}"
    Then I am on the "{{pages.dataSelectionEditor}}" page

  @component:data-selection-editor @behavior:show
  Scenario Outline: Only boxes with an unresolved recommended reference show the warning
    Then the data selection box "<warned>" warns about the unresolved reference "<reference>"
    And the data selection box "<otherWarned>" warns about the unresolved reference "<reference>"
    And the data selection box "<clean>" has no unresolved reference warning

    Examples:
      | warned                             | otherWarned                       | clean                          | reference                        |
      | {{dataSelection.conditionFeature}} | {{dataSelection.oncologyFeature}} | {{dataSelection.deathFeature}} | {{dataSelection.referenceField}} |

  @component:data-selection-editor @behavior:navigate
  Scenario Outline: The warning opens the profile editor on the unresolved reference tab
    When I click the unresolved reference warning of the data selection box "<feature>"
    Then I am on the "{{pages.queryEditorProfile}}" page
    And the reference tab "<reference>" is active

    Examples:
      | feature                            | reference                        |
      | {{dataSelection.conditionFeature}} | {{dataSelection.referenceField}} |

  @component:data-selection-feature-editor @behavior:select
  Scenario Outline: Linking the reference to a selected feature clears only that warning
    When I click the unresolved reference warning of the data selection box "<feature>"
    And I link the reference to the feature "<target>"
    Then a chip labeled "<target>" should appear in the "{{labels.selectedReference}}" section
    When I click on the button "{{labels.close}}"
    Then I am on the "{{pages.dataSelectionEditor}}" page
    And the data selection box "<feature>" shows the reference "<reference>" linked to "<target>"
    And the data selection box "<target>" warns about the unresolved reference "<reference>"

    Examples:
      | feature                            | target                            | reference                        |
      | {{dataSelection.conditionFeature}} | {{dataSelection.oncologyFeature}} | {{dataSelection.referenceField}} |

  @component:data-selection-editor @behavior:remove
  Scenario Outline: Removing the reference field clears the warning
    When I remove the reference "<reference>" of the data selection box "<feature>"
    Then the data selection box "<feature>" has no unresolved reference warning

    Examples:
      | feature                            | reference                        |
      | {{dataSelection.conditionFeature}} | {{dataSelection.referenceField}} |

  @component:data-selection-feature-editor @behavior:select
  Scenario Outline: A reference can be linked to several selected features
    When I click the unresolved reference warning of the data selection box "<feature>"
    And I link the reference to the feature "<first>"
    And I link the reference to the feature "<second>"
    Then a chip labeled "<first>" should appear in the "{{labels.selectedReference}}" section
    And a chip labeled "<second>" should appear in the "{{labels.selectedReference}}" section
    When I click on the button "{{labels.close}}"
    Then the data selection box "<feature>" shows the reference "<reference>" linked to "<first>"
    And the data selection box "<feature>" shows the reference "<reference>" linked to "<second>"
    And the data selection box "<feature>" has no unresolved reference warning

    Examples:
      | feature                           | first                              | second                         | reference                        |
      | {{dataSelection.oncologyFeature}} | {{dataSelection.conditionFeature}} | {{dataSelection.deathFeature}} | {{dataSelection.referenceField}} |

  @component:data-selection-feature-editor @behavior:remove
  Scenario Outline: Unlinking the only linked feature brings the warning back
    When I click the unresolved reference warning of the data selection box "<feature>"
    And I link the reference to the feature "<target>"
    And I unlink the reference from the feature "<target>"
    Then no chip labeled "<target>" should appear in the "{{labels.selectedReference}}" section
    When I click on the button "{{labels.close}}"
    Then the data selection box "<feature>" warns about the unresolved reference "<reference>"

    Examples:
      | feature                            | target                            | reference                        |
      | {{dataSelection.conditionFeature}} | {{dataSelection.oncologyFeature}} | {{dataSelection.referenceField}} |

  @component:data-selection-editor @behavior:toggle-only-if-referenced
  Scenario Outline: Linking a feature makes "Only if referenced" available on it
    Then the data selection box "<target>" does not offer the "{{labels.onlyIfReferenced}}" option
    When I click the unresolved reference warning of the data selection box "<feature>"
    And I link the reference to the feature "<target>"
    And I click on the button "{{labels.close}}"
    Then the data selection box "<target>" offers the "{{labels.onlyIfReferenced}}" option

    Examples:
      | feature                            | target                            |
      | {{dataSelection.conditionFeature}} | {{dataSelection.oncologyFeature}} |

  @component:data-selection-editor @behavior:select
  Scenario Outline: The "Required" option of a linked reference can be switched on
    When I click the unresolved reference warning of the data selection box "<feature>"
    And I link the reference to the feature "<target>"
    And I click on the button "{{labels.close}}"
    Then the required option of the reference "<reference>" in the data selection box "<feature>" is disabled
    When I toggle the required option of the reference "<reference>" in the data selection box "<feature>"
    Then the required option of the reference "<reference>" in the data selection box "<feature>" is enabled

    Examples:
      | feature                            | target                            | reference                        |
      | {{dataSelection.conditionFeature}} | {{dataSelection.oncologyFeature}} | {{dataSelection.referenceField}} |

  @component:data-selection-editor @behavior:show
  Scenario Outline: The warning is shown in German
    When I set the language to German
    Then the data selection box "<feature>" shows the unresolved reference warning in German

    Examples:
      | feature                              |
      | {{dataSelection.conditionFeatureDe}} |
