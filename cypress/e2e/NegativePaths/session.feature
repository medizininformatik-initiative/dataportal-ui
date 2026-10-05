# A lost session (no valid tokens, no SSO cookie) must not leave the user on a protected page.
@cross-cutting
Feature: Lost session

  Scenario Outline: A signed-out user is sent to the sign-in page
    Given I am logged in as a user
    When my session is lost
    And I open the "<page>" page of the portal
    Then I am asked to sign in

    Examples:
      | page                          |
      | data-query/cohort-definition  |
      | feasibility-query/search      |
      | saved-queries                 |
