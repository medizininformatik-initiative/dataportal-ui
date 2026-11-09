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
@area:feasibility-query
Feature: Attribute filter (concept) - criterium with several concept filters

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to the configured language

  @component:criterion-editor @behavior:select @filter:attribute-filter @type:concept
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
      | criterium               | criteriumCode      | firstFilter           | firstConcept            | secondFilter           | secondConcept            |
      | {{encounter.criterium}} | {{encounter.code}} | {{encounter.typeTab}} | {{encounter.typeFirst}} | {{encounter.levelTab}} | {{encounter.levelFirst}} |

  @component:criterion-editor @behavior:remove @filter:attribute-filter @type:concept
  Scenario Outline: Removing a concept in one attribute does not touch the others
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<firstFilter>"
    And I have selected the concepts in the filter "<firstFilter>":
      | <firstConcept> |
      | <thirdConcept> |
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
      | criterium               | criteriumCode      | firstFilter           | firstConcept            | thirdConcept             | secondFilter           | secondConcept            |
      | {{encounter.criterium}} | {{encounter.code}} | {{encounter.typeTab}} | {{encounter.typeFirst}} | {{encounter.typeSecond}} | {{encounter.levelTab}} | {{encounter.levelFirst}} |

  @component:criterion-editor @behavior:persist @filter:attribute-filter @type:concept
  Scenario Outline: Selections of all four attributes survive closing and reopening
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<firstFilter>"
    And I have selected one concept from the value set of each of these attribute filters:
      | attribute filter | concept         |
      | <firstFilter>    | <firstConcept>  |
      | <secondFilter>   | <secondConcept> |
      | <thirdFilter>    | <thirdConcept>  |
      | <fourthFilter>   | <fourthConcept> |
    When I click on the button "{{labels.close}}"
    And I open the editor of the added criterium
    And I open the editor tab "<firstFilter>"
    Then each of these attribute filters has <count> selected concept:
      | attribute filter |
      | <firstFilter>    |
      | <secondFilter>   |
      | <thirdFilter>    |
      | <fourthFilter>   |

    Examples:
      | criterium               | criteriumCode      | firstFilter           | firstConcept            | secondFilter           | secondConcept            | thirdFilter                 | thirdConcept                  | fourthFilter                        | fourthConcept                 | count |
      | {{encounter.criterium}} | {{encounter.code}} | {{encounter.typeTab}} | {{encounter.typeFirst}} | {{encounter.levelTab}} | {{encounter.levelFirst}} | {{encounter.departmentTab}} | {{encounter.departmentFirst}} | {{encounter.extendedDepartmentTab}} | {{encounter.departmentFirst}} | 1     |

  @component:criterion-editor @behavior:isolate @filter:attribute-filter @type:concept
  Scenario Outline: Two criteria of the same profile keep separate selections
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<filter>"
    And I have selected the concepts in the filter "<filter>":
      | <concept> |
    When I click on the button "{{labels.close}}"
    And I navigate to the "{{languageSwitch.kohortenselektion}}" page
    And I add the criterium "<otherCriterium>" via code "<otherCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<filter>"
    Then the filter "<filter>" has no selected concepts
    When I click on the button "{{labels.close}}"
    Then I should see 1 criteria named "<criterium>" in the editor
    And I should see 1 criteria named "<otherCriterium>" in the editor

    Examples:
      | criterium               | criteriumCode      | filter                | concept                 | otherCriterium               | otherCode               |
      | {{encounter.criterium}} | {{encounter.code}} | {{encounter.typeTab}} | {{encounter.typeFirst}} | {{encounter.otherCriterium}} | {{encounter.otherCode}} |
