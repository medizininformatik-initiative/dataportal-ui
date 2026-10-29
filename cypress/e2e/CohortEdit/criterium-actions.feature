# A criterium added from the search starts in the "Stage" list, not in a group.
# Its options menu offers exactly configure, duplicate and delete - there is no
# move entry, so moving into Inclusion / Exclusion is drag and drop only.
# The criterium and the menu entries are Examples data, so either can be swapped.
@area:feasibility-query
Feature: Criterium actions

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:feasibility-editor @behavior:open-menu
  Scenario Outline: The options menu offers configure, duplicate and delete
    Given I add the criterium "<criterium>" to the editor
    When I open the menu
    Then the menu should offer the item "<first>"
    And the menu should offer the item "<second>"
    And the menu should offer the item "<third>"

    Examples:
      | criterium              | first                | second                         | third                       |
      | {{noFilter.criterium}} | {{labels.configure}} | {{criteriumActions.duplicate}} | {{criteriumActions.delete}} |

  @component:feasibility-editor @behavior:add
  Scenario Outline: A new criterium starts in the stage list, not in a group
    Given I add the criterium "<criterium>" to the editor
    Then I should see the criterium "<criterium>" in the "{{labels.stage}}" list
    And I should not see the criterium "<criterium>" in the "{{labels.inclusion}}" list
    And I should not see the criterium "<criterium>" in the "{{labels.exclusion}}" list

    Examples:
      | criterium              |
      | {{noFilter.criterium}} |

  @component:feasibility-editor @behavior:duplicate
  Scenario Outline: Duplicating a criterium creates a second copy
    Given I add the criterium "<criterium>" to the editor
    When I open the menu
    And I click on the menu item "<action>"
    Then I should see <count> criteria named "<criterium>" in the editor

    Examples:
      | criterium              | action                         | count |
      | {{noFilter.criterium}} | {{criteriumActions.duplicate}} | 2     |

  @component:feasibility-editor @behavior:delete
  Scenario Outline: Deleting a criterium removes it from the editor
    Given I add the criterium "<criterium>" to the editor
    When I open the menu
    And I click on the menu item "<action>"
    Then I should not see the criterium "<criterium>" in the "{{labels.stage}}" list

    Examples:
      | criterium              | action                      |
      | {{noFilter.criterium}} | {{criteriumActions.delete}} |
