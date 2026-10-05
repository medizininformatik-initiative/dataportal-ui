# Model: Criterion with no timeRestriction, no attributeFilters, no valueFilters.
# Data: "BIOMAT erheben" (context Einwilligung, profile MII_PR_Consent_Einwilligung:
# timeRestrictionAllowed=false, no valueDefinition, no attributeDefinitions).
# The English UI shows the German original name (en translation is empty).
# The criterium, the list and the menu entry are Examples data.
Feature: Criterion without any filter

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to the configured language

  Scenario Outline: The criterium can be added and placed without configuring anything
    Given I add the criterium "<criterium>" to the editor
    When I drag "<criterium>" criterium to the "<list>" list
    Then I should see the criterium "<criterium>" in the "<list>" list
    And the button "<button>" should be enabled

    Examples:
      | criterium      | list      | button      |
      | BIOMAT erheben | Inclusion | Feasibility |

  Scenario Outline: The criterium shows no filter chips
    Given I add the criterium "<criterium>" to the editor
    Then the criterium "<criterium>" shows no filter chips

    Examples:
      | criterium      |
      | BIOMAT erheben |

  Scenario Outline: The editor offers no filter tabs
    Given I add the criterium "<criterium>" to the editor
    When I open the menu
    And I click on the menu item "<menuItem>"
    Then I am on the "<page>" page
    And the editor has no filter tabs

    Examples:
      | criterium      | menuItem  | page                    |
      | BIOMAT erheben | Configure | Query Editor - Criteria |
