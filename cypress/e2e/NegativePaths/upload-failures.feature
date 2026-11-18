# Uploading a file that is not a valid data definition. The cohort that is already loaded must
# survive a failed upload. `{}` and unknown properties are rejected by the backend's schema
# validation (VALIDATION-10000) and listed in the error log dialog; text that is not JSON never
# reaches the backend and surfaces through the global error dialog.
@area:data-query
Feature: Upload - invalid files

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.dataQueryCohortDefinition}}" page
    And I set the language to English
    And I upload the file "{{files.singleInclusion}}"
    And I should see "{{files.singleInclusionCriterium}}" in the cohort definition editor

  @component:upload @behavior:reject-invalid-file
  Scenario Outline: A file that is not JSON is reported and the cohort is kept
    When I upload a file named "<fileName>" containing "<contents>"
    Then an error dialog is shown
    And the error dialog shows "<message>"
    When I close the error dialog
    Then I should see "<kept>" in the cohort definition editor

    Examples:
      | fileName                       | contents                         | message                           | kept                               |
      | {{uploadFailures.notJsonJson}} | {{uploadFailures.thisIsNotJson}} | {{uploadFailures.isNotValidJSON}} | {{files.singleInclusionCriterium}} |

  @component:upload @behavior:reject-invalid-file
  Scenario Outline: A JSON file without a data definition is rejected by validation
    When I upload a file named "<fileName>" containing '<contents>'
    Then the error log dialog is open
    And the error log shows "<message>"
    When I close the error log dialog
    Then I should see "<kept>" in the cohort definition editor

    Examples:
      | fileName                           | contents                              | message                                                     | kept                               |
      | {{uploadFailures.emptyObjectJson}} | {{uploadFailures.value}}              | {{uploadFailures.requiredPropertyCohortDefinitionNotFound}} | {{files.singleInclusionCriterium}} |
      | {{uploadFailures.unknownPropJson}} | {{uploadFailures.inclusionCriteria1}} | {{uploadFailures.isNotDefinedInTheSchema}}                  | {{files.singleInclusionCriterium}} |

  # The dialog title is translated. The body still shows the raw SyntaxError text; a sentence
  # naming the file would be better.
  @component:upload @behavior:reject-invalid-file
  Scenario Outline: A file that is not JSON gets a readable message
    When I upload a file named "<fileName>" containing "<contents>"
    Then an error dialog is shown
    And the error dialog does not show "<text>"

    Examples:
      | fileName                       | contents                         | text                            |
      | {{uploadFailures.notJsonJson}} | {{uploadFailures.thisIsNotJson}} | {{searchFailures.gENERICERROR}} |

  # Generated mutants (`MUTANTS` in cypress/support/crtdl/cases.ts): one wrong detail in a
  # reference filter each.
  @component:upload @behavior:reject-invalid-file @filter:attribute-filter @type:reference
  Scenario Outline: A data definition with a broken reference filter is rejected (<case>)
    When I upload the generated data definition "<case>"
    Then the error log dialog is open
    When I close the error log dialog
    Then I should see "<kept>" in the cohort definition editor

    Examples:
      | case                                        | kept                               |
      | reference to criterion outside criteria set | {{files.singleInclusionCriterium}} |
      | reference to unknown diagnosis code         | {{files.singleInclusionCriterium}} |
      | reference without criteria                  | {{files.singleInclusionCriterium}} |
      | reference with concepts instead of criteria | {{files.singleInclusionCriterium}} |

    # DEFECT: `validation/crtdl` accepts a reference filter whose attribute code the profile
    # does not have (200), and the upload drops the filter silently - widening the cohort.
    # Expected: rejected like the rows above.
    @pending
    Examples: Accepted by the backend
      | case                                  | kept                               |
      | reference with unknown attribute code | {{files.singleInclusionCriterium}} |
