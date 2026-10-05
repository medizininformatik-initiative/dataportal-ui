# Model: AttributeFilter -> ConceptFilter.selectedConcepts[]; removal via the
# "Selected code filter" tab. State is asserted ONLY through that list — no
# checkbox / search-table assertions (see attribute-concept-ui-sync.feature).
# Regression for bug-reports/selected-concept-list-remove-wipes-selection.md
# Data: see attribute-concept-select.feature. Every value is an Examples cell; a cell may
# be a literal or a {{placeholder}} from support/test-data/concepts.json.
Feature: Attribute filter (concept) - removing concepts

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to the configured language

  Scenario Outline: Removing one concept keeps the others
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
      | <third>  |
    And I open the concept filter tab "Selected Concepts"
    When I remove the concept "<removed>" from the selected concepts list
    Then the selected concepts list has 2 entries
    And the selected concepts list does not contain "<removed>"

    Examples:
      | criterium                  | criteriumCode        | tab                | first               | second               | third               | removed             |
      | {{causeOfDeath.criterium}} | {{causeOfDeath.code}} | {{causeOfDeath.tab}} | {{concepts.first}} | {{concepts.second}} | {{concepts.third}} | {{concepts.first}}  |
      | {{causeOfDeath.criterium}} | {{causeOfDeath.code}} | {{causeOfDeath.tab}} | {{concepts.first}} | {{concepts.second}} | {{concepts.third}} | {{concepts.second}} |
      | {{causeOfDeath.criterium}} | {{causeOfDeath.code}} | {{causeOfDeath.tab}} | {{concepts.first}} | {{concepts.second}} | {{concepts.third}} | {{concepts.third}}  |

  Scenario Outline: Removing concepts one after another
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
      | <third>  |
    And I open the concept filter tab "Selected Concepts"
    When I remove the concept "<first>" from the selected concepts list
    And I remove the concept "<second>" from the selected concepts list
    Then the selected concepts are:
      | code    |
      | <third> |

    Examples:
      | criterium                  | criteriumCode        | tab                | first               | second               | third               |
      | {{causeOfDeath.criterium}} | {{causeOfDeath.code}} | {{causeOfDeath.tab}} | {{concepts.first}} | {{concepts.second}} | {{concepts.third}} |

  Scenario Outline: Removing every concept leaves an empty list
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
      | <third>  |
    And I open the concept filter tab "Selected Concepts"
    When I remove the concept "<first>" from the selected concepts list
    And I remove the concept "<second>" from the selected concepts list
    And I remove the concept "<third>" from the selected concepts list
    Then the selected concepts list is empty

    Examples:
      | criterium                  | criteriumCode        | tab                | first               | second               | third               |
      | {{causeOfDeath.criterium}} | {{causeOfDeath.code}} | {{causeOfDeath.tab}} | {{concepts.first}} | {{concepts.second}} | {{concepts.third}} |

  Scenario Outline: A removal survives closing and reopening the editor
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
      | <third>  |
    And I open the concept filter tab "Selected Concepts"
    When I remove the concept "<first>" from the selected concepts list
    And I click on the button "Close"
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    Then the selected concepts are:
      | code     |
      | <second> |
      | <third>  |

    Examples:
      | criterium                  | criteriumCode        | tab                | first               | second               | third               |
      | {{causeOfDeath.criterium}} | {{causeOfDeath.code}} | {{causeOfDeath.tab}} | {{concepts.first}} | {{concepts.second}} | {{concepts.third}} |
