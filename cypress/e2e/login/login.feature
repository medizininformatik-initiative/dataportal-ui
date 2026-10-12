@cross-cutting
Feature: Login
@component:login @behavior:login
Scenario: I Login Successfully
    When I go to the login page
    Then I fill in the login form with valid credentials