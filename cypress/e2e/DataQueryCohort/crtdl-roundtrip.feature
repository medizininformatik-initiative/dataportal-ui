# Uploading a data definition and downloading it again must not lose or change anything.
# The CRTDLs are generated (cypress/support/crtdl/cases.ts) from seeds checked against the
# ontology, so a filter combination is one row below.
@area:data-query
Feature: CRTDL upload and download roundtrip

  Background:
    Given I am logged in as a user
    And I am on the "Data Query - Cohort Definition" page
    And I set the language to English

  Scenario Outline: A data definition with <case> survives upload and download
    When I upload the generated data definition "<case>"
    And I am on the "Data Query - Cohort Definition" page
    And I download the file "roundtrip"
    Then the downloaded file "roundtrip" matches the generated data definition "<case>"

    Examples: Time restrictions
      | case         |
      | no filters   |
      | time before  |
      | time after   |
      | time between |
      | time at      |

    Examples: Attribute and value filters
      | case                        |
      | one concept                 |
      | several concepts            |
      | concept and time            |
      | age greater than            |
      | age range                   |
      | gender concept              |

    Examples: Cohort structure
      | case                      |
      | exclusion with filter     |
      | alternatives in one group |
      | two groups                |

    Examples: Feature selection
      | case                     |
      | features with must have  |
      | feature with date filter |
      | feature with code filter |

    Examples: Linked features
      | case                                       |
      | linked feature                             |
      | linked feature with must have              |
      | linked feature included only if referenced |

    Examples: Everything combined
      | case               |
      | everything at once |

  Scenario Outline: A quantity filter with comparator <case> keeps its comparator and unit
    When I upload the generated data definition "<case>"
    And I am on the "Data Query - Cohort Definition" page
    And I download the file "roundtrip"
    Then the downloaded file "roundtrip" matches the generated data definition "<case>"

    @doc-collapse
    Examples: Comparators the editor offers
      | case      |
      | age gt a  |
      | age lt a  |
      | age eq a  |
      | age gt mo |
      | age lt mo |
      | age eq mo |

    # DEFECT: `ge` and `le` are accepted by the backend, but
    # `AbstractQuantityFilter.mapComparatorToQuantityComparison` (and its inverse) only knows
    # none/eq/lt/gt/between, so they fall through to NONE and the whole value filter is
    # dropped (`ne` is not tested: the backend answers 500 to it) - silently widening the cohort. Expected: the filter survives (or the upload is
    # rejected with a message).
    @pending
    Examples: Comparators the editor does not know
      | case      |
      | age ge a  |
      | age le a  |
      | age ge mo |
      | age le mo |
