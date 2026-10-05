# UI checks for the concept editor: what the user SEES in the search table,
# tabs and empty state, and that the tabs stay in sync with each other.
# Selection/removal logic itself is in the sibling -select / -remove files.
# All data (criterium, code, tab, search terms, concepts, count) is in Examples cells.
@area:shared-filter
Feature: Attribute filter (concept) - UI state

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to the configured language

  Scenario Outline: A selected concept is checked in the search results, others are not
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    When I search for the concept "<term>"
    And I select the concept "<first>"
    Then the concept "<first>" is checked in the search results
    And the concept "<second>" is not checked in the search results

    Examples:
      | criterium      | criteriumCode | tab        | term       | first | second |
      | Cause of death | 79378-6       | ICD-10-WHO | pneumoniae | J13   | J15.0  |

  Scenario Outline: Removing a concept in the Selected tab unchecks it in the search results
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
    When I open the concept filter tab "Selected Concepts"
    And I remove the concept "<first>" from the selected concepts list
    And I open the concept filter tab "Single Search"
    And I search for the concept "<term>"
    Then the concept "<first>" is not checked in the search results
    And the concept "<second>" is checked in the search results

    Examples:
      | criterium      | criteriumCode | tab        | term       | first | second |
      | Cause of death | 79378-6       | ICD-10-WHO | pneumoniae | J13   | J15.0  |

  Scenario Outline: Existing selections are pre-checked when reopening the editor
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
    When I click on the button "Close"
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I search for the concept "<term>"
    Then the concept "<first>" is checked in the search results
    And the concept "<second>" is checked in the search results

    Examples:
      | criterium      | criteriumCode | tab        | term       | first | second |
      | Cause of death | 79378-6       | ICD-10-WHO | pneumoniae | J13   | J15.0  |

  Scenario Outline: A new search keeps the checked state of already selected concepts
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first> |
    When I search for the concept "<otherTerm>"
    And I search for the concept "<term>"
    Then the concept "<first>" is checked in the search results

    Examples:
      | criterium      | criteriumCode | tab        | term       | otherTerm | first |
      | Cause of death | 79378-6       | ICD-10-WHO | pneumoniae | Sepsis    | J13   |

  Scenario Outline: The Selected tab is disabled while nothing is selected
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    Then the concept filter tab "Selected Concepts" is disabled

    Examples:
      | criterium      | criteriumCode | tab        |
      | Cause of death | 79378-6       | ICD-10-WHO |

  Scenario Outline: The Selected tab label shows the number of selected concepts
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
    Then the concept filter tab "Selected Concepts" shows the count <count>

    Examples:
      | criterium      | criteriumCode | tab        | first | second | count |
      | Cause of death | 79378-6       | ICD-10-WHO | J13   | J15.0  | 2     |

  Scenario Outline: The search table scrolls inside the editor instead of overflowing
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    When I search for the concept "<term>"
    Then the concept results table is scrollable within the editor

    Examples:
      | criterium      | criteriumCode | tab        | term       |
      | Cause of death | 79378-6       | ICD-10-WHO | pneumoniae |
