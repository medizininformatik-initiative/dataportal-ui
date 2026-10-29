@area:saved-queries
Feature: Saved Queries

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:saved-queries @behavior:load
  Scenario Outline: A saved query appears in the list and can be loaded back into the editor
    Given I add the criterium "<criterium>" via code "<code>" to the editor
    And I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
    And I click on the button "{{labels.saveCohort}}"
    And I add the title "<title>"
    And I add the comment "<comment>"
    And I save the cohort
    When I navigate to the "{{pages.savedQueries}}" page
    Then I should see the saved query "<title>" in the list
    When I load the saved query "<title>"
    Then I should see "<criterium>" in the cohort definition editor
    When I navigate to the "{{pages.savedQueries}}" page
    And I delete the saved query "<title>"
    Then I should not see the saved query "<title>" in the list

    Examples:
      | criterium            | code            | title                      | comment                      |
      | {{labAge.criterium}} | {{labAge.code}} | {{savedQueries.testQuery}} | {{savedQueries.aTestCohort}} |

  @component:saved-queries @behavior:delete
  Scenario Outline: Deleting a saved query removes it from the list
    Given I add the criterium "<criterium>" to the editor
    And I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
    And I click on the button "{{labels.saveCohort}}"
    And I add the title "<title>"
    And I add the comment "<comment>"
    And I save the cohort
    And I navigate to the "{{pages.savedQueries}}" page
    When I delete the saved query "<title>"
    Then I should not see the saved query "<title>" in the list

    Examples:
      | criterium                  | title                          | comment                      |
      | {{appendectomy.criterium}} | {{savedQueries.queryToDelete}} | {{savedQueries.aTestCohort}} |
