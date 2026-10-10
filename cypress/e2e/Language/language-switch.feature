# The language dropdown offers German and English. The side navigation labels are
# used as the visible check because they come straight from the translation files.
# Languages, labels and the page to navigate to are Examples data.
@cross-cutting
Feature: Language switch

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page

  Scenario Outline: Switching language translates the side navigation
    When I set the language to <language>
    Then the side navigation should show the label "<first>"
    And the side navigation should show the label "<second>"

    Examples:
      | language | first             | second                         |
      | German   | Kohortenselektion | Gespeicherte Datendefinitionen |
      | English  | Cohort Selection  | Saved data definitions         |

  Scenario Outline: Switching back restores the first language
    When I set the language to <from>
    And I set the language to <to>
    Then the side navigation should show the label "<first>"
    And the side navigation should show the label "<second>"

    Examples:
      | from    | to      | first            | second                 |
      | German  | English | Cohort Selection | Saved data definitions |

  Scenario Outline: The chosen language stays when navigating inside the app
    When I set the language to <language>
    And I navigate to the "<page>" page
    Then the side navigation should show the label "<label>"

    Examples:
      | language | page           | label            |
      | German   | Data Selection | Merkmalselektion |
