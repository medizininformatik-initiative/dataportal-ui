# The side navigation shows four areas and can be collapsed to icons only. In the
# collapsed state the labels are gone (they move into tooltips). The labels and the
# number of areas are Examples data.
@cross-cutting
Feature: Side navigation

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English

  @component:navigation @behavior:show
  Scenario Outline: The side navigation lists the main areas
    Then the side navigation should list <count> areas
    And the side navigation should show the label "<first>"
    And the side navigation should show the label "<second>"
    And the side navigation should show the label "<third>"
    And the side navigation should show the label "<fourth>"

    Examples:
      | count | first                     | second                             | third                               | fourth                                  |
      | 4     | {{labels.dataDefinition}} | {{languageSwitch.cohortSelection}} | {{sideNavigation.featureSelection}} | {{languageSwitch.savedDataDefinitions}} |

  @component:navigation @behavior:collapse
  Scenario: Collapsing the side navigation hides the labels
    Then the side navigation should be expanded
    When I toggle the side navigation
    Then the side navigation should be collapsed
    And the side navigation should show no labels

  @component:navigation @behavior:expand
  Scenario Outline: Expanding the side navigation again shows the labels
    When I toggle the side navigation
    And I toggle the side navigation
    Then the side navigation should be expanded
    And the side navigation should show the label "<label>"

    Examples:
      | label                              |
      | {{languageSwitch.cohortSelection}} |
