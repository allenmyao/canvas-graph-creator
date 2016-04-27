Feature: Move Object
  As a user I want to save my current graph and reload it 

  Background:
    Given I navigate to the home page

  Scenario: There should initially be no nodes
    When I do nothing
      And I Quicksave
      And I Quickload
    Then there should be no nodes

  Scenario: Save and load a single node after alteration
    When I create a node at 600, 600 
      And I Quicksave
      And I create a node at 500, 500
      And I Quickload
    Then the screen should match circle_node.png

  Scenario: Save and load graph node after alteration
    When I create a node named Node 1 at 500, 500
      And another node named Node 2 at 550, 550
      And I Quicksave
      And add an edge between Node 1 and Node 2
      And I Quickload
    Then the screen should match 'no_edge.png'