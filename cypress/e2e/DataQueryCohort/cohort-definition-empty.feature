# Logging in lands on the cohort definition page. Without a cohort it shows the
# empty message, and running a feasibility query or saving is not possible yet.
# Button names and the target page are Examples data.
@area:data-query
Feature: Cohort definition - empty state

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.dataQueryCohortDefinition}}" page
    And I set the language to English

  @component:cohort-definition @behavior:show-empty-state
  Scenario: A user without a cohort sees the empty message
    Then the cohort definition should show the empty message

  @component:cohort-definition @behavior:show-empty-state
  Scenario Outline: Feasibility query and save are disabled without a cohort
    Then the button "<feasibility>" should be disabled
    And the button "<save>" should be disabled

    Examples:
      | feasibility                                | save                  |
      | {{cohortDefinitionEmpty.feasibilityQuery}} | {{labels.saveCohort}} |

  @component:cohort-definition @behavior:create-cohort
  Scenario Outline: New cohort opens the criteria search
    When I click on the button "<newCohort>"
    Then I should arrive on the "<page>" page

    Examples:
      | newCohort                           | page                        |
      | {{cohortDefinitionEmpty.newCohort}} | {{pages.feasibilitySearch}} |
