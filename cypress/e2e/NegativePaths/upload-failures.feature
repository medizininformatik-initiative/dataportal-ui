# Uploading a file that is not a valid data definition. The cohort that is already loaded must
# survive a failed upload. `{}` and unknown properties are rejected by the backend's schema
# validation (VALIDATION-10000) and listed in the error log dialog; text that is not JSON never
# reaches the backend and surfaces through the global error dialog.
@area:data-query
Feature: Upload - invalid files

  Background:
    Given I am logged in as a user
    And I am on the "Data Query - Cohort Definition" page
    And I set the language to English
    And I upload the file "Single_Inclusion_Criteria_With_Patient"
    And I should see "<kept>" in the cohort definition editor

  @component:upload @behavior:reject-invalid-file
  Scenario Outline: A file that is not JSON is reported and the cohort is kept
    When I upload a file named "<fileName>" containing "<contents>"
    Then an error dialog is shown
    And the error dialog shows "<message>"
    When I close the error dialog
    Then I should see "<kept>" in the cohort definition editor

    Examples:
      | fileName      | contents         | message           | kept              |
      | not-json.json | this is not json | is not valid JSON | 18-Oxydase-Mangel |

  @component:upload @behavior:reject-invalid-file
  Scenario Outline: A JSON file without a data definition is rejected by validation
    When I upload a file named "<fileName>" containing '<contents>'
    Then the error log dialog is open
    And the error log shows "<message>"
    When I close the error log dialog
    Then I should see "<kept>" in the cohort definition editor

    Examples:
      | fileName          | contents                | message                                        | kept              |
      | empty-object.json | {}                      | required property 'cohortDefinition' not found | 18-Oxydase-Mangel |
      | unknown-prop.json | {"inclusionCriteria":1} | is not defined in the schema                   | 18-Oxydase-Mangel |

  # DEFECT: the dialog for a non-JSON file is titled `GENERIC_ERROR` and shows the raw
  # SyntaxError text. Expected: a translated title and a sentence naming the file.
  @component:upload @behavior:reject-invalid-file
  @pending
  Scenario Outline: A file that is not JSON gets a readable message
    When I upload a file named "<fileName>" containing "<contents>"
    Then an error dialog is shown
    And the error dialog does not show "<text>"

    Examples:
      | fileName      | contents         | text          |
      | not-json.json | this is not json | GENERIC_ERROR |
