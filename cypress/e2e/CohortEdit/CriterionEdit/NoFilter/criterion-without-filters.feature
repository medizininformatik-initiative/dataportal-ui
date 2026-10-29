# Model: Criterion with no timeRestriction, no attributeFilters, no valueFilters.
# Data: "BIOMAT raise" (de: "BIOMAT erheben", context Einwilligung, profile MII_PR_Consent_Einwilligung:
# timeRestrictionAllowed=false, no valueDefinition, no attributeDefinitions).
# The criterium, the list and the menu entry are Examples data.
@area:feasibility-query
Feature: Criterion without any filter

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to the configured language

  @component:criterion-editor @behavior:add @filter:none
  Scenario Outline: The criterium can be added and placed without configuring anything
    Given I add the criterium "<criterium>" to the editor
    When I drag "<criterium>" criterium to the "<list>" list
    Then I should see the criterium "<criterium>" in the "<list>" list
    And the button "<button>" should be enabled

    Examples:
      | criterium              | list                 | button                 |
      | {{noFilter.criterium}} | {{labels.inclusion}} | {{labels.feasibility}} |

  @component:criterion-editor @behavior:show-chips @filter:none
  Scenario Outline: The criterium shows no filter chips
    Given I add the criterium "<criterium>" to the editor
    Then the criterium "<criterium>" shows no filter chips

    Examples:
      | criterium              |
      | {{noFilter.criterium}} |

  @component:criterion-editor @behavior:show @filter:none
  Scenario Outline: The editor offers no filter tabs
    Given I add the criterium "<criterium>" to the editor
    When I open the menu
    And I click on the menu item "<menuItem>"
    Then I should arrive on the "<page>" page
    And the editor has no filter tabs

    Examples:
      | criterium              | menuItem             | page                          |
      | {{noFilter.criterium}} | {{labels.configure}} | {{pages.queryEditorCriteria}} |
