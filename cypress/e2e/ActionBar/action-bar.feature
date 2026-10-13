# num-action-bar shows upload, download and save by default. Only the query editor and the
# feasibility result hide them (`[showUpload]="false"` etc.), so every other page must offer all three.
@cross-cutting
Feature: Action bar - upload, download and save
  Background:
    Given I am logged in as a user
    And I set the language to English

  @component:action-bar @behavior:show-file-actions
  Scenario Outline: The action bar offers upload, download and save
    Given I am on the "<page>" page
    Then the action bar offers upload, download and save
    Examples:
      | page                                |
      | {{pages.feasibilitySearch}}         |
      | {{pages.feasibilityBulkSearch}}     |
      | {{pages.feasibilityEditor}}         |
      | {{pages.dataSelectionSearch}}       |
      | {{pages.dataSelectionEditor}}       |
      | {{pages.dataQueryCohortDefinition}} |
      | {{pages.dataQueryDataSelection}}    |

  @component:action-bar @behavior:hide-file-actions
  Scenario Outline: The query editor hides upload, download and save
    Given I am on the "{{pages.feasibilitySearch}}" page
    And I set the language to English
    And I add the criterium "<criterium>" via code "<code>" to the editor
    When I open the menu
    And I click on the menu item "{{labels.configure}}"
    Then I am on the "{{pages.queryEditorCriteria}}" page
    And the action bar offers no upload, download or save
    Examples:
      | criterium               | code               |
      | {{pneumonia.criterium}} | {{pneumonia.code}} |
