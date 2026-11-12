# A data definition the backend rejects as outdated is sent to the upgrade endpoint (POST
# /upgrade/crtdl). The upgraded definition replaces the upload, the upgrade log lists what changed.
# The fixture filters Diagnosis on `onset-date` with only a `start`; the ontology now calls the
# filter `recorded-date` (UPGRADE-1000001).
@area:data-query
Feature: CRTDL upload with upgrade

  Background:
    Given I am logged in as a user
    And I am on the "{{pages.dataQueryCohortDefinition}}" page
    And I set the language to English

  @component:crtdl @behavior:upload @filter:attribute-filter
  Scenario: An outdated date filter with only a start date is upgraded on upload
    When I upload the outdated data definition "{{upgradeDateFilter.fixture}}"
    Then the error log dialog is open
    And the error log shows "{{upgradeDateFilter.logText}}"
    When I close the error log dialog
    And I am on the "{{pages.dataQueryCohortDefinition}}" page
    And I download the file "{{files.roundtrip}}"
    Then the filter "{{upgradeDateFilter.newName}}" starting "{{upgradeDateFilter.start}}" is in group "{{upgradeDateFilter.group}}" of the downloaded file "{{files.roundtrip}}"
    And the filter "{{upgradeDateFilter.oldName}}" is not in group "{{upgradeDateFilter.group}}" of the downloaded file "{{files.roundtrip}}"
