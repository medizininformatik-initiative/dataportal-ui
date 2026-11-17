# Criteria in the Inclusion and Exclusion lists are grouped by connections. Inclusion: criteria in
# one group are connected by OR, groups by AND. Exclusion: criteria in one group are connected by
# AND, groups by OR. A switch between two criteria merges (outer switch) or splits (inner switch).
# `A + B | C` reads: one group of A and B, then one group of C. Every scenario starts from an
# uploaded fixture with known groups (cypress/fixtures/Criteria_*.json).
@area:feasibility-query
Feature: Criteria groups in the cohort editor

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.dataQueryCohortDefinition}}" page
    And I set the language to English

  Rule: A switch between two criteria changes their connection

    @component:feasibility-editor @behavior:switch
    Scenario: Switching AND to OR merges two criteria into one group
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I switch the connection between "{{criteriaGroups.a}}" and "{{criteriaGroups.b}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.ab_c}}"

    @component:feasibility-editor @behavior:switch
    Scenario: Switching OR to AND splits a group
      Given I upload the criteria fixture "{{criteriaGroups.orGroup}}"
      And I open the cohort editor
      When I switch the connection between "{{criteriaGroups.a}}" and "{{criteriaGroups.b}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.a_bc}}"

    @component:feasibility-editor @behavior:switch
    Scenario: Switching the second connection of an OR group splits off the last criterium
      Given I upload the criteria fixture "{{criteriaGroups.orGroup}}"
      And I open the cohort editor
      When I switch the connection between "{{criteriaGroups.b}}" and "{{criteriaGroups.c}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.ab_c}}"

    @component:feasibility-editor @behavior:switch
    Scenario: Switching every AND connection to OR builds one group
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I switch the connection between "{{criteriaGroups.a}}" and "{{criteriaGroups.b}}"
      And I switch the connection between "{{criteriaGroups.b}}" and "{{criteriaGroups.c}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.abc}}"

    @component:feasibility-editor @behavior:switch
    Scenario: Switching a connection twice restores the groups
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I switch the connection between "{{criteriaGroups.a}}" and "{{criteriaGroups.b}}"
      And I switch the connection between "{{criteriaGroups.a}}" and "{{criteriaGroups.b}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.a_b_c}}"

    @component:feasibility-editor @behavior:switch
    Scenario: Switching AND to OR in the Exclusion list splits a group
      Given I upload the criteria fixture "{{criteriaGroups.bothLists}}"
      And I open the cohort editor
      When I switch the connection between "{{criteriaGroups.c}}" and "{{criteriaGroups.d}}"
      Then the "{{labels.exclusion}}" list has the groups "{{criteriaGroups.layout.c_d}}"

    @component:feasibility-editor @behavior:switch
    Scenario: Switching OR to AND in the Exclusion list merges two groups
      Given I upload the criteria fixture "{{criteriaGroups.bothLists}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.a}}" to the end of the "{{labels.exclusion}}" list
      And I switch the connection between "{{criteriaGroups.d}}" and "{{criteriaGroups.a}}"
      Then the "{{labels.exclusion}}" list has the groups "{{criteriaGroups.layout.cda}}"

  Rule: A criterium dragged out of a connected group leaves the other criteria connected

    @component:feasibility-editor @behavior:exclude
    Scenario Outline: Dragging a criterium of an AND chain to the Exclusion list
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I drag "<criterium>" to the "{{labels.exclusion}}" list
      Then the "{{labels.inclusion}}" list has the groups "<inclusion>"
      And the "{{labels.exclusion}}" list has the groups "<criterium>"

      Examples:
        | criterium            | inclusion                     |
        | {{criteriaGroups.a}} | {{criteriaGroups.layout.b_c}} |
        | {{criteriaGroups.b}} | {{criteriaGroups.layout.a_c}} |
        | {{criteriaGroups.c}} | {{criteriaGroups.layout.a_b}} |

    @component:feasibility-editor @behavior:exclude
    Scenario Outline: Dragging a criterium of an OR group to the Exclusion list
      Given I upload the criteria fixture "{{criteriaGroups.orGroup}}"
      And I open the cohort editor
      When I drag "<criterium>" to the "{{labels.exclusion}}" list
      Then the "{{labels.inclusion}}" list has the groups "<inclusion>"
      And the "{{labels.exclusion}}" list has the groups "<criterium>"

      Examples:
        | criterium            | inclusion                    |
        | {{criteriaGroups.a}} | {{criteriaGroups.layout.bc}} |
        | {{criteriaGroups.b}} | {{criteriaGroups.layout.ac}} |
        | {{criteriaGroups.c}} | {{criteriaGroups.layout.ab}} |

    @component:feasibility-editor @behavior:exclude
    Scenario: An AND chain turned into an OR group is dragged to the Exclusion list criterium by criterium
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      And I switch the connection between "{{criteriaGroups.a}}" and "{{criteriaGroups.b}}"
      And I switch the connection between "{{criteriaGroups.b}}" and "{{criteriaGroups.c}}"
      When I drag "{{criteriaGroups.a}}" to the "{{labels.exclusion}}" list
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.bc}}"
      When I drag "{{criteriaGroups.b}}" to the "{{labels.exclusion}}" list
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.c}}"
      When I drag "{{criteriaGroups.c}}" to the "{{labels.exclusion}}" list
      Then the "{{labels.inclusion}}" list should contain 0 criteria
      And the "{{labels.exclusion}}" list should contain 3 criteria

    @component:feasibility-editor @behavior:exclude
    Scenario: An OR group turned into an AND chain is dragged to the Exclusion list
      Given I upload the criteria fixture "{{criteriaGroups.orGroup}}"
      And I open the cohort editor
      And I switch the connection between "{{criteriaGroups.a}}" and "{{criteriaGroups.b}}"
      And I switch the connection between "{{criteriaGroups.b}}" and "{{criteriaGroups.c}}"
      When I drag "{{criteriaGroups.b}}" to the "{{labels.exclusion}}" list
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.a_c}}"
      And the "{{labels.exclusion}}" list has the groups "{{criteriaGroups.b}}"

    @component:feasibility-editor @behavior:exclude
    Scenario Outline: Dragging a criterium of a mixed list to the Exclusion list
      Given I upload the criteria fixture "{{criteriaGroups.mixed}}"
      And I open the cohort editor
      When I drag "<criterium>" to the "{{labels.exclusion}}" list
      Then the "{{labels.inclusion}}" list has the groups "<inclusion>"
      And the "{{labels.exclusion}}" list has the groups "<criterium>"

      Examples:
        | criterium            | inclusion                       |
        | {{criteriaGroups.a}} | {{criteriaGroups.layout.b_c_d}} |
        | {{criteriaGroups.b}} | {{criteriaGroups.layout.a_c_d}} |
        | {{criteriaGroups.c}} | {{criteriaGroups.layout.ab_d}}  |
        | {{criteriaGroups.d}} | {{criteriaGroups.layout.ab_c}}  |

  Rule: A criterium dragged out of an Exclusion group leaves the other criteria connected

    @component:feasibility-editor @behavior:move
    Scenario Outline: Dragging a criterium of an Exclusion AND group to the Inclusion list
      Given I upload the criteria fixture "{{criteriaGroups.bothLists}}"
      And I open the cohort editor
      When I drag "<criterium>" to the "{{labels.inclusion}}" list
      Then the "{{labels.exclusion}}" list has the groups "<exclusion>"
      And the "{{labels.inclusion}}" list should contain 3 criteria

      Examples:
        | criterium            | exclusion            |
        | {{criteriaGroups.c}} | {{criteriaGroups.d}} |
        | {{criteriaGroups.d}} | {{criteriaGroups.c}} |

    @component:feasibility-editor @behavior:move
    Scenario: Dragging both criteria of an Exclusion AND group to the Inclusion list empties Exclusion
      Given I upload the criteria fixture "{{criteriaGroups.bothLists}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.c}}" to the "{{labels.inclusion}}" list
      And I drag "{{criteriaGroups.d}}" to the "{{labels.inclusion}}" list
      Then the "{{labels.exclusion}}" list should contain 0 criteria
      And the "{{labels.inclusion}}" list should contain 4 criteria

  Rule: A criterium dragged to the selected criteria and back keeps its place in a group

    @component:feasibility-editor @behavior:move
    Scenario Outline: Dragging a criterium of an OR group to the selected criteria
      Given I upload the criteria fixture "{{criteriaGroups.orGroup}}"
      And I open the cohort editor
      When I drag "<criterium>" to the "{{labels.stage}}" list
      Then the "{{labels.inclusion}}" list has the groups "<inclusion>"
      And the "{{labels.stage}}" list should contain 1 criteria

      Examples:
        | criterium            | inclusion                    |
        | {{criteriaGroups.a}} | {{criteriaGroups.layout.bc}} |
        | {{criteriaGroups.b}} | {{criteriaGroups.layout.ac}} |
        | {{criteriaGroups.c}} | {{criteriaGroups.layout.ab}} |

    @component:feasibility-editor @behavior:move
    Scenario Outline: Dragging a criterium of an AND chain to the selected criteria
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I drag "<criterium>" to the "{{labels.stage}}" list
      Then the "{{labels.inclusion}}" list has the groups "<inclusion>"
      And the "{{labels.stage}}" list should contain 1 criteria

      Examples:
        | criterium            | inclusion                     |
        | {{criteriaGroups.a}} | {{criteriaGroups.layout.b_c}} |
        | {{criteriaGroups.b}} | {{criteriaGroups.layout.a_c}} |
        | {{criteriaGroups.c}} | {{criteriaGroups.layout.a_b}} |

    @component:feasibility-editor @behavior:move
    Scenario: A criterium dragged from an OR group to the selected criteria and back shows once
      Given I upload the criteria fixture "{{criteriaGroups.orGroup}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.b}}" to the "{{labels.stage}}" list
      And I drag "{{criteriaGroups.b}}" to the "{{labels.inclusion}}" list
      Then the "{{labels.stage}}" list should contain 0 criteria
      And the "{{labels.inclusion}}" list should contain 3 criteria
      And I should see 1 criteria named "{{criteriaGroups.b}}" in the editor

    @component:feasibility-editor @behavior:move
    Scenario: A criterium dragged from an AND chain to the selected criteria and back shows once
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.b}}" to the "{{labels.stage}}" list
      And I drag "{{criteriaGroups.b}}" to the "{{labels.inclusion}}" list
      Then the "{{labels.stage}}" list should contain 0 criteria
      And the "{{labels.inclusion}}" list should contain 3 criteria
      And I should see 1 criteria named "{{criteriaGroups.b}}" in the editor

    @component:feasibility-editor @behavior:move
    Scenario: A criterium dragged from the Exclusion list to the selected criteria and back shows once
      Given I upload the criteria fixture "{{criteriaGroups.bothLists}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.c}}" to the "{{labels.stage}}" list
      Then the "{{labels.exclusion}}" list has the groups "{{criteriaGroups.d}}"
      When I drag "{{criteriaGroups.c}}" to the "{{labels.exclusion}}" list
      Then the "{{labels.stage}}" list should contain 0 criteria
      And I should see 1 criteria named "{{criteriaGroups.c}}" in the editor

  Rule: A criterium dropped next to another criterium joins its group or forms a new one

    @component:feasibility-editor @behavior:move
    Scenario: A criterium dropped after the last criterium of an AND chain forms its own group
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.a}}" to the "{{labels.stage}}" list
      And I drag "{{criteriaGroups.a}}" to the end of the "{{labels.inclusion}}" list
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.b_c_a}}"

    @component:feasibility-editor @behavior:move
    Scenario: A criterium dropped in the middle of an OR group joins that group
      Given I upload the criteria fixture "{{criteriaGroups.mixed}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.d}}" to the "{{labels.stage}}" list
      And I drag "{{criteriaGroups.d}}" before "{{criteriaGroups.b}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.adb_c}}"

    @component:feasibility-editor @behavior:move
    Scenario: A criterium dropped into the second group joins the second group
      Given I upload the criteria fixture "{{criteriaGroups.mixed}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.a}}" to the "{{labels.stage}}" list
      And I switch the connection between "{{criteriaGroups.c}}" and "{{criteriaGroups.d}}"
      And I drag "{{criteriaGroups.a}}" before "{{criteriaGroups.d}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.b_cad}}"

  Rule: A criterium moved inside its list keeps the connections of the others

    @component:feasibility-editor @behavior:move
    Scenario: Moving the last criterium of an AND chain to the front
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.c}}" before "{{criteriaGroups.a}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.c_a_b}}"

    @component:feasibility-editor @behavior:move
    Scenario: Moving the first criterium of an AND chain to the end
      Given I upload the criteria fixture "{{criteriaGroups.andChain}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.a}}" after "{{criteriaGroups.c}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.b_c_a}}"

    @component:feasibility-editor @behavior:move
    Scenario: Moving a criterium inside an OR group keeps the group
      Given I upload the criteria fixture "{{criteriaGroups.orGroup}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.c}}" before "{{criteriaGroups.a}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.cab}}"

    @component:feasibility-editor @behavior:move
    Scenario: Moving a criterium of an OR group to the end keeps the group
      Given I upload the criteria fixture "{{criteriaGroups.orGroup}}"
      And I open the cohort editor
      When I drag "{{criteriaGroups.a}}" after "{{criteriaGroups.c}}"
      Then the "{{labels.inclusion}}" list has the groups "{{criteriaGroups.layout.bca}}"
