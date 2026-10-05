# The header user menu is a mat-select, not the shared num-menu. The "Log" entry
# (error log) is disabled while there are no errors to show. Entry names are
# Examples data.
@cross-cutting
Feature: User menu

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  Scenario Outline: The user menu offers about, log and log out
    When I open the user menu
    Then the user menu should offer "<about>"
    And the user menu should offer "<log>"
    And the user menu should offer "<logout>"

    Examples:
      | about            | log | logout  |
      | About the Portal | Log | Log Out |

  Scenario Outline: The log entry is disabled while there are no errors to show
    When I open the user menu
    Then the user menu item "<log>" should be disabled

    Examples:
      | log |
      | Log |

  Scenario Outline: The about entry opens the about dialog
    When I open the user menu
    And I click on the user menu item "<about>"
    Then I should see the about dialog

    Examples:
      | about            |
      | About the Portal |

  Scenario Outline: Logging out returns to the sign-in page
    When I open the user menu
    And I click on the user menu item "<logout>"
    Then I should be on the sign-in page

    Examples:
      | logout  |
      | Log Out |
