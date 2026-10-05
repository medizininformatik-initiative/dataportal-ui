# Regression for https://github.com/medizininformatik-initiative/dataportal-ui/issues/626
# (fix: commit 88b62fa9 on develop - concept identity = code AND system).
#
# BLOCKED: needs a criterium whose concept filter offers the SAME code in two
# systems. J13 etc. exist in both http://hl7.org/fhir/sid/icd-10 and
# http://fhir.de/CodeSystem/bfarm/icd-10-gm, but they never meet in one table.
# Re-checked against GET terminology/ui-profile (all profiles): NO concept filter
# (attribute or value) has more than one value set, and the two ICD value sets sit in
# different profiles:
#   http://hl7.org/fhir/sid/icd-10/vs       -> MII_PR_Person_Todesursache(1)  (attr "ICD-10-WHO")
#   http://fhir.de/ValueSet/bfarm/icd-10-gm -> MII_PR_Onko_Tod                (attr "Actual result")
# So no single concept editor can show both. Open options: a profile with a combined
# value set, or reproducing it at the unit level. Until then replace the TBD cells in
# Examples and drop @pending.
# All data is in the Examples tables, so only those need to change once a criterium exists.
@pending
Feature: Attribute filter (concept) - same code in different code systems

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to the configured language

  Scenario Outline: Selecting a code does not select the same code from another system
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    When I search for the concept "<code>"
    And I select the concept "<code>" with system "<firstSystem>"
    Then the selected concepts list has 1 entry
    And the concept "<code>" with system "<secondSystem>" is not checked in the search results

    Examples:
      | criterium | criteriumCode | tab | code | firstSystem                    | secondSystem                                 |
      | TBD       | TBD           | TBD | J13  | http://hl7.org/fhir/sid/icd-10 | http://fhir.de/CodeSystem/bfarm/icd-10-gm    |

  Scenario Outline: The same code in two systems keeps both entries until each is removed
    Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor
    And I open the editor of the added criterium
    And I open the editor tab "<tab>"
    And I have selected the concept "<code>" with system "<firstSystem>"
    And I have selected the concept "<code>" with system "<secondSystem>"
    When I open the concept filter tab "Selected Concepts"
    Then the selected concepts list has 2 entries
    When I remove the concept "<code>" with system "<firstSystem>" from the selected concepts list
    Then the selected concepts list has 1 entry

    Examples:
      | criterium | criteriumCode | tab | code | firstSystem                    | secondSystem                                 |
      | TBD       | TBD           | TBD | J13  | http://hl7.org/fhir/sid/icd-10 | http://fhir.de/CodeSystem/bfarm/icd-10-gm    |
