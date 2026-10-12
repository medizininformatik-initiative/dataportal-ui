# A bulk search adds ONE criterium that carries several termcodes (shown as the first code's
# display). The staging area must show all codes, and the criterion editor must list them and
# let the user remove them one by one; at a single code the termcode tab disappears.
@area:feasibility-query
Feature: Bulk search - criterium with several termcodes

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Bulk Search" page
    And I set the language to English
    When I enter the bulk search codes "{{bulk.codes}}"
    And I select the bulk search terminology "{{bulk.terminology}}"
    And I select the bulk search context "{{bulk.context}}"
    And I run the bulk search
    And I add the bulk search result as one criterium
    And I view the cohort selection
    Then I should arrive on the "Feasibility Editor" page

  @component:feasibility-editor @behavior:display
  Scenario Outline: The staging area shows one criterium with all termcodes
    Then I should see 1 criteria named "<criterium>" in the editor
    And I see the criterium "<criterium>" with filter chip block "Terminology Codes"
    And I see the criterium "<criterium>" with filter chip "<first>" in the block "Terminology Codes"
    And I see the criterium "<criterium>" with filter chip "<second>" in the block "Terminology Codes"
    And I see the criterium "<criterium>" with filter chip "<third>" in the block "Terminology Codes"

    Examples:
      | criterium          | first          | second          | third          |
      | {{bulk.criterium}} | {{bulk.first}} | {{bulk.second}} | {{bulk.third}} |

  @component:criterion-editor @behavior:edit-termcodes
  Scenario Outline: The editor lists the termcodes and allows removing them down to one
    When I open the editor of the added criterium
    Then I should arrive on the "Query Editor - Criteria" page
    And the editor has the tab "Terminology Codes"
    And the editor has the tab "Time restriction"
    And the editor lists the termcodes "<all>"
    When I remove the termcode "<removed>" in the editor
    Then the editor lists the termcodes "<remaining>"
    When I remove the termcode "<second>" in the editor
    Then the editor has no tab "Terminology Codes"
    And the editor has the tab "Time restriction"

    Examples:
      | all             | removed          | remaining          | second          |
      | {{bulk.codes3}} | {{bulk.removed}} | {{bulk.remaining}} | {{bulk.second}} |
