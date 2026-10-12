@area:feasibility-query
Feature: Criterion editor - time restriction
  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  @component:criterion-editor @behavior:apply @filter:time-restriction
  Scenario Outline: Applying a time restriction to a criterium
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    When I click on the menu item "Configure"
    Then I am on the "Query Editor - Criteria" page
    When I set the time restriction to <comparator> with date "<date>"
    When I click on the button "Close"
    Then I am on the "Feasibility Editor" page
    Then I see the criterium "<criterium>" with filter chip "<date>" in the block "<block>"
    When I drag "<criterium>" criterium to the "Inclusion" list
    Then the button "Feasibility" should be enabled
    When I click on the button "Feasibility"
    Then I am on the "Feasibility Result" page
    When I click on the button "Edit cohort selection"
    Then I am on the "Feasibility Editor" page
    @comparator:before
    Examples:
      | criterium                  | code                  | comparator | date       | block  |
      | {{pneumonia.criterium}}    | {{pneumonia.code}}    | before     | 04.04.2045 | before |
      | {{appendectomy.criterium}} | {{appendectomy.code}} | before     | 04.04.2045 | before |

    @comparator:at
    Examples:
      | criterium               | code               | comparator | date       | block |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | at         | 04.04.2045 | at    |

    @comparator:after
    Examples:
      | criterium                  | code                  | comparator | date       | block |
      | {{appendectomy.criterium}} | {{appendectomy.code}} | after      | 04.04.2045 | after |

  @component:criterion-editor @behavior:apply @filter:time-restriction @comparator:between
  Scenario Outline: Applying a time restriction with comparator between
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    When I click on the menu item "Configure"
    Then I am on the "Query Editor - Criteria" page
    When I set the time restriction to between "<after>" and "<before>"
    When I click on the button "Close"
    Then I am on the "Feasibility Editor" page
    Then I see the criterium "<criterium>" with filter chip "<chip>" in the block "<block>"

    Examples:
      | criterium               | code               | after      | before     | chip                          | block   |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | 01.01.2045 | 04.04.2045 | From 01.01.2045 to 04.04.2045 | between |

  # between-filter.component.ts only applies the filter when the end date is later than the start
  # date; otherwise it shows SHARED_FILTER.TIMERESTRICTION.WARNING and emits nothing. Equal dates are
  # rejected too (the comparison is strict).
  @component:criterion-editor @behavior:reject-invalid-dates @filter:time-restriction @comparator:between
  Scenario Outline: A between time restriction whose start date is not before its end date is rejected
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    And I click on the menu item "Configure"
    Then I am on the "Query Editor - Criteria" page
    When I set the time restriction to between "<after>" and "<before>"
    Then I see the time restriction warning "<warning>"
    When I click on the button "Close"
    Then I am on the "Feasibility Editor" page
    And the criterium "<criterium>" shows no filter chips

    Examples:
      | criterium               | code               | after      | before     | warning                                          |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | 04.04.2045 | 01.01.2045 | The start date must be earlier than the end date |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | 04.04.2045 | 04.04.2045 | The start date must be earlier than the end date |
