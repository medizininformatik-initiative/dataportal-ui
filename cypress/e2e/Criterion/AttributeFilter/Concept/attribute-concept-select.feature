# Model: Criterion.attributeFilters[] -> AttributeFilter -> ConceptFilter.selectedConcepts[]
# Data: "Cause of death" (context Todesursache, LOINC 79378-6, profile
# MII_PR_Person_Todesursache1), value set http://hl7.org/fhir/sid/icd-10/vs,
# search "pneumoniae" -> J13, J15.0, J15.7, A40.3, J20.0.
# Open point: a second "Cause of death" exists in context "MII Onkologie Tod"
# (icd-10-gm only), hence the add-by-code step.
# All data (criterium, code, tab, search term, concepts, system) is in the Examples
# tables, so another criterium or concept can be tried without touching a step.
Feature: Attribute filter (concept) - selecting concepts

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to the configured language

  Scenario Outline: Selecting a concept adds it to the selection
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    When I search for the concept "<term>"
    And I select the concept "<first>"
    Then the selected concepts are:
      | code    | system   |
      | <first> | <system> |

    Examples:
      | criterium      | criteriumCode | tab        | term       | first | system                         |
      | Cause of death | 79378-6       | ICD-10-WHO | pneumoniae | J13   | http://hl7.org/fhir/sid/icd-10 |

  Scenario Outline: Selecting several concepts keeps all of them
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    When I search for the concept "<term>"
    And I select the concept "<first>"
    And I select the concept "<second>"
    Then the selected concepts are:
      | code     | system   |
      | <first>  | <system> |
      | <second> | <system> |

    Examples:
      | criterium      | criteriumCode | tab        | term       | first | second | system                         |
      | Cause of death | 79378-6       | ICD-10-WHO | pneumoniae | J13   | J15.0  | http://hl7.org/fhir/sid/icd-10 |

  Scenario Outline: Deselecting a concept in the search results removes it from the selection
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
    When I search for the concept "<term>"
    And I deselect the concept "<first>"
    Then the selected concepts are:
      | code     |
      | <second> |

    Examples:
      | criterium      | criteriumCode | tab        | term       | first | second |
      | Cause of death | 79378-6       | ICD-10-WHO | pneumoniae | J13   | J15.0  |

  Scenario Outline: The selection persists after closing and reopening the editor
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
    When I click on the button "Close"
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    Then the selected concepts are:
      | code     |
      | <first>  |
      | <second> |

    Examples:
      | criterium      | criteriumCode | tab        | first | second |
      | Cause of death | 79378-6       | ICD-10-WHO | J13   | J15.0  |

  # A concept chip shows the concept's DISPLAY text, not its code. The ontology only has the
  # German original for these concepts, so the chip text is German in the English UI too.
  # <firstChip> / <secondChip> must belong to <first> / <second>.
  Scenario Outline: Selected concepts are shown as filter chips on the criterium
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concepts:
      | <first>  |
      | <second> |
    When I click on the button "Close"
    Then the criterium "<criterium>" shows a filter chip for "<firstChip>"
    And the criterium "<criterium>" shows a filter chip for "<secondChip>"

    Examples:
      | criterium      | criteriumCode | tab        | first | second | firstChip                              | secondChip                            |
      | Cause of death | 79378-6       | ICD-10-WHO | J13   | J15.0  | Pneumonie durch Streptococcus pneumoniae | Pneumonie durch Klebsiella pneumoniae |
