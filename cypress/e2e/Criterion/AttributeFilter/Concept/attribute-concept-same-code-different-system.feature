# Regression for https://github.com/medizininformatik-initiative/dataportal-ui/issues/626
# (fix: commit 88b62fa9 on develop - concept identity = code AND system).
#
# The feasibility criteria's concept filters each offer ONE value set, so one code can never
# appear in two systems there. The data-selection editor can: the profile "Diagnosis"
# (MII PR Diagnose Condition) has a Code Filter whose value sets include ICD-10-GM and
# Alpha-ID, and `I26` exists in both (ICD-10-GM: Lungenembolie, Alpha-ID: Traumatische
# Amputation im Schultergelenk). Verified against GET dse/profile-data and the
# codeable_concept index (see TEST_DATA.md).
#
# The search table shows the system as its display name in its own cell, so a row is picked by
# code AND that name. The selected-concepts list shows only display and code, never the system,
# so it is asserted by entry count.
@area:shared-filter
Feature: Concept filter - same code in different code systems

  Background:
    Given I am logged in as a user
    And I am on the "Data Selection Search" page
    And I set the language to English

  Scenario Outline: Selecting a code does not select the same code from another system
    Given I type "<profile>" in the search input field
    And I select the checkbox in the row containing "<profile>"
    When I click on the button "Add to Selection"
    And I click on the button "Show Selection"
    And I click the edit button on the data selection box "<profile>"
    And I click on the menu item "Configure"
    And I click the "<tab>" tab
    And I search for the concept "<code>"
    And I select the concept "<code>" with system "<firstSystem>"
    Then the concept filter tab "Selected Concepts" shows the count 1
    And the concept "<code>" with system "<firstSystem>" is checked in the search results
    And the concept "<code>" with system "<secondSystem>" is not checked in the search results

    Examples:
      | profile   | tab         | code | firstSystem | secondSystem |
      | Diagnosis | Code Filter | I26  | ICD-10-GM   | Alpha-ID     |

  Scenario Outline: The same code in two systems keeps both entries until each is removed
    Given I type "<profile>" in the search input field
    And I select the checkbox in the row containing "<profile>"
    When I click on the button "Add to Selection"
    And I click on the button "Show Selection"
    And I click the edit button on the data selection box "<profile>"
    And I click on the menu item "Configure"
    And I click the "<tab>" tab
    And I have selected the concept "<code>" with system "<firstSystem>"
    And I have selected the concept "<code>" with system "<secondSystem>"
    When I open the concept filter tab "Selected Concepts"
    Then the selected concepts list has 2 entries
    When I remove the concept "<code>" from the selected concepts list
    Then the selected concepts list has 1 entry

    Examples:
      | profile   | tab         | code | firstSystem | secondSystem |
      | Diagnosis | Code Filter | I26  | ICD-10-GM   | Alpha-ID     |
