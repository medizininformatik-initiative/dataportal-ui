@area:feasibility-query
Feature: Criterion editor - time restriction
  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:criterion-editor @behavior:apply @filter:time-restriction
  Scenario Outline: Applying a time restriction to a criterium
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    When I click on the menu item "{{labels.configure}}"
    Then I am on the "{{pages.queryEditorCriteria}}" page
    When I set the time restriction to <comparator> with date "<date>"
    When I click on the button "{{labels.close}}"
    Then I am on the "{{pages.feasibilityEditor}}" page
    Then I see the criterium "<criterium>" with filter chip "<date>" in the block "<block>"
    When I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
    Then the button "{{labels.feasibility}}" should be enabled
    When I click on the button "{{labels.feasibility}}"
    Then I am on the "{{pages.feasibilityResult}}" page
    When I click on the button "{{labels.editCohortSelection}}"
    Then I am on the "{{pages.feasibilityEditor}}" page
    @comparator:before
    Examples:
      | criterium                  | code                  | comparator | date                          | block  |
      | {{pneumonia.criterium}}    | {{pneumonia.code}}    | before     | {{timeRestriction.v04042045}} | before |
      | {{appendectomy.criterium}} | {{appendectomy.code}} | before     | {{timeRestriction.v04042045}} | before |

    @comparator:at
    Examples:
      | criterium               | code               | comparator | date                          | block |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | at         | {{timeRestriction.v04042045}} | at    |

    @comparator:after
    Examples:
      | criterium                  | code                  | comparator | date                          | block |
      | {{appendectomy.criterium}} | {{appendectomy.code}} | after      | {{timeRestriction.v04042045}} | after |

  @component:criterion-editor @behavior:apply @filter:time-restriction @comparator:between
  Scenario Outline: Applying a time restriction with comparator between
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    When I click on the menu item "{{labels.configure}}"
    Then I am on the "{{pages.queryEditorCriteria}}" page
    When I set the time restriction to between "<after>" and "<before>"
    When I click on the button "{{labels.close}}"
    Then I am on the "{{pages.feasibilityEditor}}" page
    Then I see the criterium "<criterium>" with filter chip "<chip>" in the block "<block>"

    Examples:
      | criterium               | code               | after                         | before                        | chip                                 | block   |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | {{timeRestriction.v01012045}} | {{timeRestriction.v04042045}} | {{timeRestriction.from01012045To04}} | between |

  # between-filter.component.ts only applies the filter when the end date is later than the start
  # date; otherwise it shows SHARED_FILTER.TIMERESTRICTION.WARNING and emits nothing. Equal dates are
  # rejected too (the comparison is strict).
  @component:criterion-editor @behavior:reject-invalid-dates @filter:time-restriction @comparator:between
  Scenario Outline: A between time restriction whose start date is not before its end date is rejected
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    And I click on the menu item "{{labels.configure}}"
    Then I am on the "{{pages.queryEditorCriteria}}" page
    When I set the time restriction to between "<after>" and "<before>"
    Then I see the time restriction warning "<warning>"
    When I click on the button "{{labels.close}}"
    Then I am on the "{{pages.feasibilityEditor}}" page
    And the criterium "<criterium>" shows no filter chips

    Examples:
      | criterium               | code               | after                         | before                        | warning                                       |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | {{timeRestriction.v04042045}} | {{timeRestriction.v01012045}} | {{timeRestriction.theStartDateMustBeEarlier}} |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | {{timeRestriction.v04042045}} | {{timeRestriction.v04042045}} | {{timeRestriction.theStartDateMustBeEarlier}} |
