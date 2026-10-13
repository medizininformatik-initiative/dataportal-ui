@area:data-query
Feature: Data Query Cohort
    Background: I am logged in and on the Data Query Cohort page
        Given I am logged in as a user
        And I am on the "{{pages.dataQueryCohortDefinition}}" page
        And I set the language to English

    @component:cohort-definition @behavior:upload
    Scenario Outline: User uploads file "<fileName>"
        Given I upload the file "<fileName>"
        Then I download the file "<fileName>"


        Examples:
            | fileName                  |
            | {{files.singleInclusion}} |

    @component:cohort-definition @behavior:advance
    Scenario Outline: Defining a cohort and advancing to the Data Selection step
        Given I am on the "{{pages.feasibilitySearch}}" page
        And I set the language to English
        And I add the criterium "<criterium>" via code "<code>" to the editor
        And I drag "<criterium>" criterium to the "{{labels.inclusion}}" list
        When I navigate to the "{{labels.dataDefinition}}" page
        Then I should see "<criterium>" in the cohort definition editor
        When I click on the button "{{labels.toFeatureSelection}}"
        Then I am on the "{{pages.dataQueryDataSelection}}" page

        Examples:
            | criterium               | code               |
            | {{pneumonia.criterium}} | {{pneumonia.code}} |
