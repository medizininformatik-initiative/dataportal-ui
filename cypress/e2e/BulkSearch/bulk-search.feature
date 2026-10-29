# Route: /feasibility-query/bulk-search. The "Search" button needs the codes AND both
# filters (context and terminology). Codes may be separated by commas, spaces or
# line breaks. All data lives in the Examples tables, so a code, terminology or context
# can be swapped without touching a step. The defaults are ICD-10-GM category codes
# in the context Diagnose.
@area:feasibility-query
Feature: Bulk search

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.feasibilityBulkSearch}}" page
    And I set the language to English

  @component:criteria-bulk-search @behavior:validate
  Scenario Outline: The search button stays disabled until codes, context and terminology are set
    Then the bulk search button should be disabled
    When I enter the bulk search codes "<codes>"
    Then the bulk search button should be disabled
    When I select the bulk search terminology "<terminology>"
    Then the bulk search button should be disabled
    When I select the bulk search context "<context>"
    Then the bulk search button should be enabled

    Examples:
      | codes          | terminology          | context          |
      | {{bulk.codes}} | {{bulk.terminology}} | {{bulk.context}} |

  @component:criteria-bulk-search @behavior:parse
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
      | codes                           | terminology          | context          | count | first          | second          | third          |
      | {{bulkSearch.commaSeparated}}   | {{bulk.terminology}} | {{bulk.context}} | 3     | {{bulk.first}} | {{bulk.second}} | {{bulk.third}} |
      | {{bulkSearch.spaceSeparated}}   | {{bulk.terminology}} | {{bulk.context}} | 3     | {{bulk.first}} | {{bulk.second}} | {{bulk.third}} |
      | {{bulkSearch.newlineSeparated}} | {{bulk.terminology}} | {{bulk.context}} | 3     | {{bulk.first}} | {{bulk.second}} | {{bulk.third}} |

  @component:criteria-bulk-search @behavior:report-not-found
  Scenario Outline: A code that does not exist is reported as not found
    When I enter the bulk search codes "<codes>"
    And I select the bulk search terminology "<terminology>"
    And I select the bulk search context "<context>"
    And I run the bulk search
    Then the bulk search should have found <found> codes
    And the bulk search should not have found <notFound> codes

    Examples:
      | codes                     | terminology          | context          | found | notFound |
      | {{bulkSearch.oneUnknown}} | {{bulk.terminology}} | {{bulk.context}} | 1     | 1        |
