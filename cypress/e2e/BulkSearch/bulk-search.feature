# Route: /feasibility-query/bulk-search. The "Search" button needs the codes AND both
# filters (context and terminology). Codes may be separated by commas, spaces or
# line breaks. All data lives in the Examples tables, so a code, terminology or context
# can be swapped without touching a step. The defaults are ICD-10-GM category codes
# in the context Diagnose.
Feature: Bulk search

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Bulk Search" page
    And I set the language to English

  Scenario Outline: The search button stays disabled until codes, context and terminology are set
    Then the bulk search button should be disabled
    When I enter the bulk search codes "<codes>"
    Then the bulk search button should be disabled
    When I select the bulk search terminology "<terminology>"
    Then the bulk search button should be disabled
    When I select the bulk search context "<context>"
    Then the bulk search button should be enabled

    Examples:
      | codes         | terminology | context  |
      | E10, E11, E66 | ICD-10-GM   | Diagnose |

  Scenario Outline: Codes can be separated by different delimiters
    When I enter the bulk search codes "<codes>"
    And I select the bulk search terminology "<terminology>"
    And I select the bulk search context "<context>"
    And I run the bulk search
    Then the bulk search should have found <count> codes
    And the bulk search result should list the code "<first>"
    And the bulk search result should list the code "<second>"
    And the bulk search result should list the code "<third>"

    Examples:
      | codes         | terminology | context  | count | first | second | third |
      | E10,E11,E66   | ICD-10-GM   | Diagnose | 3     | E10   | E11    | E66   |
      | E10 E11 E66   | ICD-10-GM   | Diagnose | 3     | E10   | E11    | E66   |
      | E10\nE11\nE66 | ICD-10-GM   | Diagnose | 3     | E10   | E11    | E66   |

  Scenario Outline: A code that does not exist is reported as not found
    When I enter the bulk search codes "<codes>"
    And I select the bulk search terminology "<terminology>"
    And I select the bulk search context "<context>"
    And I run the bulk search
    Then the bulk search should have found <found> codes
    And the bulk search should not have found <notFound> codes

    Examples:
      | codes      | terminology | context  | found | notFound |
      | E11, ZZZ99 | ICD-10-GM   | Diagnose | 1     | 1        |
