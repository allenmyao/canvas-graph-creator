Feature: Move Object
  As a user I want to be able to move an element of the graph

  Background:
    Given I navigate to the home page
    And I create a node at 400, 400

  Scenario: Dragging node 
    When I select the SelectMove Tool
    And I click and drag from (400, 400) to (500, 500)
    Then the screen should match circle_node.png

  Scenario: Draggin Graph
    When I create a node named Node 1 at 500, 500
      And another node named Node 2 at 550, 550
      And I open the context menu at 500, 500
      And choose the Add Edge option
      And click on Node 2
      And I select the SelectMove Tool
      And I click and drag from (500, 500) to (600, 600)
    Then the screen should match 'edge.png'
