# The header toggle switches between the light and the dark theme. The choice is stored in
# the browser and kept after a reload.
@cross-cutting
Feature: Theme toggle

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page

  @component:theme @behavior:switch
  Scenario: The toggle sets the dark theme and a reload keeps it
    Then the theme should be light
    When I toggle the theme
    Then the theme should be dark
    When I reload the page
    Then the theme should be dark
    When I toggle the theme
    Then the theme should be light
