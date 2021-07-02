@web @search
Feature: Searching for programs with extensions

  Background:
    Given there are users:
      | id | name     |
      | 1  | Catrobat |
      | 2  | User1    |
    And there are extensions:
      | id | internal_title | title_ltm_code |
      | 1  | arduino        | __arduino      |
      | 2  | drone          | __drone        |
      | 3  | lego           | __lego         |
      | 4  | phiro          | __phiro        |
      | 5  | raspberry_pi   | __raspberry    |
    And there are projects:
      | id | name      | owned by | extensions |
      | 1  | project 1 | Catrobat | lego,phiro |
      | 2  | project 2 | Catrobat | lego,drone |
      | 3  | project 3 | User1    | drone      |
    And I wait 1000 milliseconds

  Scenario: Searching other programs with the same extensions
    Given I am on "/app/project/1"
    And I wait for the page to be loaded
    And I should see "project 1"
    And I should see "__lego"
    And I should see "__raspberry"
    When I press on the extension "lego"
    And I wait for the page to be loaded
    Then I should see "Your search returned 2 results"
    Then I should see "project 1"
    And I should see "project 2"
    And I should not see "project 3"

  Scenario: search for programs should work
    When I am on "/app/search/lego"
    And I wait for the page to be loaded
    Then I should see "Your search returned 2 results"
    And I should see "project 1"
    And I should see "project 2"
    And I should not see "project 3"
