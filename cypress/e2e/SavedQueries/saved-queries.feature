@area:saved-queries
Feature: Saved Queries

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to English

  @component:saved-queries @behavior:load
  Scenario Outline: A saved query appears in the list and can be loaded back into the editor
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    And I drag "<criterium>" criterium to the "Inclusion" list
    And I click on the button "Save cohort"
    And I add the title "<title>"
    And I add the comment "<comment>"
    And I save the cohort
    When I navigate to the "Saved Queries" page
    Then I should see the saved query "<title>" in the list
    When I load the saved query "<title>"
    Then I should see "<criterium>" in the cohort definition editor

    Examples:
      | criterium            | code            | title      | comment       |
      | {{labAge.criterium}} | {{labAge.code}} | Test Query | A test cohort |

  @component:saved-queries @behavior:delete
  Scenario Outline: Deleting a saved query removes it from the list
    Given I add the criterium "<criterium>" to the editor
    And I drag "<criterium>" criterium to the "Inclusion" list
    And I click on the button "Save cohort"
    And I add the title "<title>"
    And I add the comment "<comment>"
    And I save the cohort
    And I navigate to the "Saved Queries" page
    When I delete the saved query "<title>"
    Then I should not see the saved query "<title>" in the list

    Examples:
      | criterium                  | title           | comment       |
      | {{appendectomy.criterium}} | Query To Delete | A test cohort |
