@area:data-selection
Feature: Data Selection Search

  Background: I am logged in and on the Data Selection Search page
    Given I am logged in as a user
    And I am on the "{{pages.dataSelectionSearch}}" page
    And I set the language to English

  @component:data-selection-search @behavior:select
  Scenario Outline: User selects a data selection feature
    Given I type "<feature>" in the search input field
    And I select the checkbox in the row containing "<feature>"
    Then the button "<button1>" should be enabled
    And the button "<button2>" should be enabled
    When I click on the button "<button1>"
    Then the button "<button1>" should be disabled
    When I click on the button "<button2>"
    Then I should arrive on the "{{pages.dataSelectionEditor}}" page
    And I should see a data selection box labeled "<feature>"
    When I click the edit button on the data selection box "<feature>"
    And I click on the menu item "{{labels.configure}}"
    Then I should arrive on the "{{pages.queryEditorProfile}}" page

    Examples: Selection Criteria
      | feature                   | button1                   | button2                  |
      | {{dataSelection.feature}} | {{labels.addToSelection}} | {{labels.showSelection}} |


  # NOTE (rewritten against the current UI):
  # - The feature is picked through the search box and a row checkbox; the old tree
  #   ("select the feature from the root category") no longer exists.
  # - The Code Filter concept is chosen by its CODE (<code>, here an ATC code), not by the
  #   old display text "Test". A code is the one thing a test author knows in advance, and
  #   the chip is asserted on the concept's display text (<concept>). To test another
  #   concept, change both columns in Examples; they must belong together.
  # - The editor action bar has no "Save" button any more (edits apply live), so the two
  #   "Save" clicks were removed.
  # - NOT COVERED here: the time restriction, see data-selection-time-restriction.feature.
  @component:data-selection-feature-editor @behavior:edit-filter
  Scenario Outline: User edits the feature "<feature>" and applies filters
    Given I type "<feature>" in the search input field
    And I select the checkbox in the row containing "<feature>"
    When I click on the button "<button1>"
    And I click on the button "<button2>"
    Then I should arrive on the "{{pages.dataSelectionEditor}}" page
    When I click the edit button on the data selection box "<feature>"
    And I click on the menu item "{{labels.configure}}"
    And I select the checkbox labeled "<field>"
    Then the field "<field>" should be in the selected fields list

    When I click the "<filterTab>" tab
    And I search for the concept "<code>"
    And I select the concept "<code>"
    Then a chip labeled "<concept>" should appear in the "{{labels.selectedFilters}}" section

    When I click the "{{labels.references}}" tab
    And I click the "{{labels.partOf}}" tab
    Then I should see the placeholder
    When I click to add a new reference
    Then the reference modal should be displayed
    When I add a reference named "<reference>"
    And I add the reference
    And I click on the button "{{labels.close}}"

    Examples: Selection Criteria
      | feature                   | button1                   | button2                  | field                        | filterTab                   | code                   | concept                   | reference                   |
      | {{dataSelection.feature}} | {{labels.addToSelection}} | {{labels.showSelection}} | {{dataSelectionSearch.note}} | {{dataSelection.filterTab}} | {{dataSelection.code}} | {{dataSelection.concept}} | {{dataSelection.reference}} |
