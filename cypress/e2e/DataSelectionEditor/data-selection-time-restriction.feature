# Time restriction tab of the profile editor a data selection box opens ("Configure"). Same
# `num-edit-time-restriction` component as the criterion editor: keep both features' comparators in step
# (before, at, after, between, invalid between) and see "Time restriction" in TESTING.md.
@area:data-selection
Feature: Data Selection Editor - time restriction

  Background: the profile editor of a selected feature is open
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English
    And I add the feature "{{dataSelection.conditionFeature}}" to the data selection
    When I click on the button "{{labels.showSelection}}"
    And I click the edit button on the data selection box "{{dataSelection.conditionFeature}}"
    And I click on the menu item "{{labels.configure}}"
    Then I am on the "{{pages.queryEditorProfile}}" page

  @component:data-selection-feature-editor @behavior:apply @filter:time-restriction
  Scenario Outline: The time restriction shows as a header chip and stays when switching tabs
    When I set the time restriction to <comparator> with date "<date>"
    Then a chip labeled "<date>" should appear in the "{{labels.selectedFilters}}" section
    When I click the "{{labels.fields}}" tab
    And I click the "{{labels.timeRestriction}}" tab
    Then the time restriction date is "<date>"
    And a chip labeled "<date>" should appear in the "{{labels.selectedFilters}}" section

    @comparator:before
    Examples:
      | comparator | date                          |
      | before     | {{timeRestriction.v04042045}} |

    @comparator:at
    Examples:
      | comparator | date                          |
      | at         | {{timeRestriction.v04042045}} |

    @comparator:after
    Examples:
      | comparator | date                          |
      | after      | {{timeRestriction.v04042045}} |

  @component:data-selection-feature-editor @behavior:apply @filter:time-restriction @comparator:between
  Scenario Outline: A between time restriction shows as a header chip and stays when switching tabs
    When I set the time restriction to between "<after>" and "<before>"
    Then a chip labeled "<chip>" should appear in the "{{labels.selectedFilters}}" section
    When I click the "{{labels.fields}}" tab
    And I click the "{{labels.timeRestriction}}" tab
    Then the time restriction dates are "<after>" and "<before>"
    And a chip labeled "<chip>" should appear in the "{{labels.selectedFilters}}" section

    Examples:
      | after                         | before                        | chip                                 |
      | {{timeRestriction.v01012045}} | {{timeRestriction.v04042045}} | {{timeRestriction.from01012045To04}} |

  @component:data-selection-feature-editor @behavior:reject-invalid-dates @filter:time-restriction @comparator:between
  Scenario Outline: A between time restriction whose start date is not before its end date is rejected
    When I set the time restriction to between "<after>" and "<before>"
    Then I see the time restriction warning "<warning>"
    And no chip labeled "<chip>" should appear in the "{{labels.selectedFilters}}" section

    Examples:
      | after                         | before                        | chip                                 | warning                                       |
      | {{timeRestriction.v04042045}} | {{timeRestriction.v01012045}} | {{timeRestriction.from04042045To01}} | {{timeRestriction.theStartDateMustBeEarlier}} |
      | {{timeRestriction.v04042045}} | {{timeRestriction.v04042045}} | {{timeRestriction.from04042045To04}} | {{timeRestriction.theStartDateMustBeEarlier}} |
