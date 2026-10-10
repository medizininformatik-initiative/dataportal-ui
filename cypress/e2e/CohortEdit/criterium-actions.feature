# A criterium added from the search starts in the "Stage" list, not in a group.
# Its options menu offers exactly configure, duplicate and delete - there is no
# move entry, so moving into Inclusion / Exclusion is drag and drop only.
# The criterium and the menu entries are Examples data, so either can be swapped.
@area:feasibility-query
Feature: Criterium actions

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  Scenario Outline: The options menu offers configure, duplicate and delete
    Given I add the criterium "<criterium>" to the editor
    When I open the menu
    Then the menu should offer the item "<first>"
    And the menu should offer the item "<second>"
    And the menu should offer the item "<third>"

    Examples:
      | criterium      | first     | second    | third  |
      | BIOMAT erheben | Configure | Duplicate | Delete |

  Scenario Outline: A new criterium starts in the stage list, not in a group
    Given I add the criterium "<criterium>" to the editor
    Then I should see the criterium "<criterium>" in the "Stage" list
    And I should not see the criterium "<criterium>" in the "Inclusion" list
    And I should not see the criterium "<criterium>" in the "Exclusion" list

    Examples:
      | criterium      |
      | BIOMAT erheben |

  Scenario Outline: Duplicating a criterium creates a second copy
    Given I add the criterium "<criterium>" to the editor
    When I open the menu
    And I click on the menu item "<action>"
    Then I should see <count> criteria named "<criterium>" in the editor

    Examples:
      | criterium      | action    | count |
      | BIOMAT erheben | Duplicate | 2     |

  Scenario Outline: Deleting a criterium removes it from the editor
    Given I add the criterium "<criterium>" to the editor
    When I open the menu
    And I click on the menu item "<action>"
    Then I should not see the criterium "<criterium>" in the "Stage" list

    Examples:
      | criterium      | action |
      | BIOMAT erheben | Delete |
