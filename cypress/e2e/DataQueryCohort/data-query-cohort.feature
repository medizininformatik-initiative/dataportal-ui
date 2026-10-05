@area:data-query
Feature: Data Query Cohort
    Background: I am logged in and on the Data Query Cohort page
        Given I am logged in as a user
        And I am on the "Data Query - Cohort Definition" page
        And I set the language to English

    Scenario Outline: User uploads file "<fileName>"
        Given I upload the file "<fileName>"
        Then I download the file "<fileName>"


        Examples:
            | fileName                                 |
            | Single_Inclusion_Criteria_With_Patient |

    Scenario Outline: Defining a cohort and advancing to the Data Selection step
        Given I am on the "Feasibility Search" page
        And I set the language to English
        And I add the criterium "<criterium>" via code "<code>" to the editor
        And I drag "<criterium>" criterium to the "Inclusion" list
        When I navigate to the "Data Definition" page
        Then I should see "<criterium>" in the cohort definition editor
        When I click on the button "To Feature Selection"
        Then I am on the "Data Query - Data Selection" page

        Examples:
            | criterium | code               |
            | Pneumonia | {{pneumonia.code}} |
