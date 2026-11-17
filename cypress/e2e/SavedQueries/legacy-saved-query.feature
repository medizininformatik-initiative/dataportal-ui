# A query saved before CRTDL existed holds a bare StructuredQuery as its content. The backend no
# longer stores that format (it strips the criteria on save), so the scenario saves a normal query
# and rewrites the GET response back to the old format.
@area:saved-queries
Feature: Saved Queries - legacy format

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  # Regression test for #684: the upgraded CRTDL was wrapped in a second `content` object.
  @component:saved-queries @behavior:load
  Scenario Outline: A saved query in the old StructuredQuery format is upgraded and loaded
    Given no saved query "<title>" exists
    And I add the criterium "<criterium>" via code "<code>" to the editor
    And I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
    And I click on the button "{{labels.saveCohort}}"
    And I add the title "<title>"
    And I add the comment "<comment>"
    And I save the cohort
    And I navigate to the "{{pages.savedQueries}}" page
    And saved queries are served in the old StructuredQuery format
    When I load the saved query "<title>"
    Then I should see "<criterium>" in the cohort definition editor
    When I navigate to the "{{pages.savedQueries}}" page
    And I delete the saved query "<title>"

    Examples:
      | criterium            | code            | title                        | comment                      |
      | {{labAge.criterium}} | {{labAge.code}} | {{savedQueries.legacyQuery}} | {{savedQueries.aTestCohort}} |
