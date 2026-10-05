# Corner case: Criterion.attributeFilters[] with SEVERAL ConceptFilters.
# Every criterium in context "Fall" (ambulatory, home health, inpatient
# encounter, pre-admission, short stay, virtual) uses profile
# MII_PR_Fall_KontaktGesundheitseinrichtung with four concept attributes:
#   Type of encounter (Kontaktart)                           kontaktart-de        konsil, nachstationaer, ...
#   Kontaktebene                         kontaktebene-de      abteilungskontakt, einrichtungskontakt, versorgungsstellenkontakt
#   Fachabteilungsschlüssel              dkgev/Fachabteilungsschluessel (39)   e.g. 1500
#   Erweiterter Fachabteilungsschlüssel  dkgev/...-erweitert
# Each attribute must keep its own selection — nothing may be shared between
# them (a root-scoped selection service would break this).
# Each concept attribute is its own tab in the criterion editor, named after the
# attribute (English display, shown upper-case via CSS): Department key, Extended
# department key, Level of encounter, Type of encounter - plus Time restriction.
# The criteria, the filter names and the concept codes are Examples data, so another
# profile with several concept filters can be tried by changing the tables only.
Feature: Attribute filter (concept) - criterium with several concept filters

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to the configured language

  Scenario Outline: Each attribute keeps its own selection
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<firstFilter>"
    And I have selected the concepts in the filter "<firstFilter>":
      | <firstConcept> |
    And I have selected the concepts in the filter "<secondFilter>":
      | <secondConcept> |
    Then the selected concepts in the filter "<firstFilter>" are:
      | code           |
      | <firstConcept> |
    And the selected concepts in the filter "<secondFilter>" are:
      | code            |
      | <secondConcept> |

    Examples:
      | criterium           | criteriumCode | firstFilter       | firstConcept | secondFilter       | secondConcept     |
      | inpatient encounter | IMP           | Type of encounter | konsil       | Level of encounter | abteilungskontakt |

  Scenario Outline: Removing a concept in one attribute does not touch the others
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<firstFilter>"
    And I have selected the concepts in the filter "<firstFilter>":
      | <firstConcept>  |
      | <thirdConcept>  |
    And I have selected the concepts in the filter "<secondFilter>":
      | <secondConcept> |
    When I remove the concept "<firstConcept>" from the selected concepts of the filter "<firstFilter>"
    Then the selected concepts in the filter "<firstFilter>" are:
      | code           |
      | <thirdConcept> |
    And the selected concepts in the filter "<secondFilter>" are:
      | code            |
      | <secondConcept> |

    Examples:
      | criterium           | criteriumCode | firstFilter       | firstConcept | thirdConcept   | secondFilter       | secondConcept     |
      | inpatient encounter | IMP           | Type of encounter | konsil       | nachstationaer | Level of encounter | abteilungskontakt |

  Scenario Outline: Selections of all four attributes survive closing and reopening
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<firstFilter>"
    And I have selected one concept in each of these concept filters:
      | filter         | code         |
      | <firstFilter>  | <firstCode>  |
      | <secondFilter> | <secondCode> |
      | <thirdFilter>  | <thirdCode>  |
      | <fourthFilter> | <fourthCode> |
    When I click on the button "Close"
    And I open the editor of the added criterium
    And I open the editor tab "<firstFilter>"
    Then each of these concept filters has <count> selected concept:
      | filter         |
      | <firstFilter>  |
      | <secondFilter> |
      | <thirdFilter>  |
      | <fourthFilter> |

    Examples:
      | criterium           | criteriumCode | firstFilter       | firstCode | secondFilter       | secondCode        | thirdFilter    | thirdCode | fourthFilter            | fourthCode | count |
      | inpatient encounter | IMP           | Type of encounter | konsil    | Level of encounter | abteilungskontakt | Department key | 1500      | Extended department key | 1500       | 1     |

  Scenario Outline: Two criteria of the same profile keep separate selections
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<filter>"
    And I have selected the concepts in the filter "<filter>":
      | <concept> |
    When I click on the button "Close"
    And I am on the "Feasibility Search" page
    And I set the language to the configured language
    And I add the criterium "<otherCriterium>" via code "<otherCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<filter>"
    Then the filter "<filter>" has no selected concepts

    Examples:
      | criterium           | criteriumCode | filter            | concept | otherCriterium | otherCode |
      | inpatient encounter | IMP           | Type of encounter | konsil  | ambulatory     | AMB       |
