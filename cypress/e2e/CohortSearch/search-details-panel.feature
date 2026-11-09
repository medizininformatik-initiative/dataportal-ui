# Clicking a result row (not its checkbox) opens a side panel with the criterium's
# details: title, translations, parents and children. A relative can be opened in
# the same panel or used as a new search term. The panel's "Show criterium" and
# "Add to cohort selection" menu entries are not covered: the first is untranslated
# in English and the second is disabled for selectable entries (see cypress/CLAUDE.md).
@area:feasibility-query
Feature: Search details panel

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:criteria-search @behavior:open
  Scenario Outline: Clicking a row opens the details panel
    Given I type "<code>" in the search input field
    And the details panel should be closed
    When I click on the row containing "<criterium>"
    Then the details panel should be open
    And the details panel should show the title "<criterium>"
    And the details panel should offer the tab "<parents>"
    And the details panel should offer the tab "<children>"

    Examples:
      | criterium               | code               | parents                  | children                |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | {{pneumonia.parentTabs}} | {{pneumonia.childTabs}} |

  @component:criteria-search @behavior:close
  Scenario Outline: The details panel closes via its button and by clicking the row again
    Given I type "<code>" in the search input field
    When I click on the row containing "<criterium>"
    And I close the details panel
    Then the details panel should be closed
    When I click on the row containing "<criterium>"
    And I click on the row containing "<criterium>"
    Then the details panel should be closed

    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |

  @component:criteria-search @behavior:navigate
  Scenario Outline: Clicking a related criterium shows its details in the same panel
    Given I type "<code>" in the search input field
    When I click on the row containing "<criterium>"
    And I open the details panel tab "<childTab>"
    And I click on the related criterium "<child>" in the details panel
    And I open the details panel tab "{{labels.details}}"
    Then the details panel should show the title "<child>"

    Examples:
      | criterium               | code               | childTab                | child               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | {{pneumonia.childTabs}} | {{pneumonia.child}} |

  @component:criteria-search @behavior:use-as-search-term
  Scenario Outline: A related criterium can be used as the new search term
    Given I type "<code>" in the search input field
    When I click on the row containing "<criterium>"
    And I open the details panel tab "<parentTab>"
    And I open the menu of the related criterium "<parent>"
    And I click on the menu item "{{labels.useAsSearchTerm}}"
    Then I should see a row containing "<parent>"
    And the details panel should be open

    Examples:
      | criterium               | code               | parentTab                | parent               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} | {{pneumonia.parentTabs}} | {{pneumonia.parent}} |
