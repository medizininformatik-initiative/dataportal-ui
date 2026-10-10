# Model: Criterion.valueFilters[] -> ValueFilter -> ConceptFilter.selectedConcepts[]
# Data: "Gender" (context Patient, SNOMED 263495000, profile MII_PR_Person_Patient1,
# valueDefinition.type=concept), value set http://hl7.org/fhir/ValueSet/administrative-gender:
# female, male, other, unknown (system http://hl7.org/fhir/administrative-gender).
# The criterium, its code, the tab, the concepts and the system are Examples data.
@area:shared-filter
Feature: Value filter (concept) - selecting and removing concepts

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to the configured language

  Scenario Outline: Selecting a concept adds it to the selection
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    When I search for the concept "<first>"
    And I select the concept "<first>"
    Then the selected concepts are:
      | code    | system   |
      | <first> | <system> |

    Examples:
      | criterium | criteriumCode | tab    | first  | system                                    |
      | Gender    | 263495000     | Gender | female | http://hl7.org/fhir/administrative-gender |

  Scenario Outline: Removing one concept keeps the others
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
      | <third>  |
    When I open the concept filter tab "Selected Concepts"
    And I remove the concept "<second>" from the selected concepts list
    Then the selected concepts are:
      | code    |
      | <first> |
      | <third> |

    Examples:
      | criterium | criteriumCode | tab    | first  | second | third |
      | Gender    | 263495000     | Gender | female | male   | other |

  Scenario Outline: The value filter selection is independent of attribute filters
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first> |
    When I click on the button "Close"
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    Then the selected concepts are:
      | code    |
      | <first> |

    Examples:
      | criterium | criteriumCode | tab    | first  |
      | Gender    | 263495000     | Gender | female |

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
    And I clear the concept search
    Then the concept "<first>" is not checked in the search results
    And the concept "<second>" is checked in the search results

    Examples:
      | criterium | criteriumCode | tab    | first  | second |
      | Gender    | 263495000     | Gender | female | male   |
