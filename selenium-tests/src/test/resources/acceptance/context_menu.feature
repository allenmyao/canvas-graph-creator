Feature: Context Menu
  As a user I want to have a context menu for ease of use. 
  Background:
    Given I navigate to the home page
    
  Scenario: Using the add node function of context menu should create a node
    When I right click at 100, 100
      And choose the option Add Circle Node
    Then there should be 1 node
        
  Scenario: Using the delete node function of context menu should delete a node
    When I create a node named Node1 at 500, 500
      And I right click at 500, 500
      And choose the option Delete Node
    Then there should be no nodes
        
  Scenario: Using toggle accept state should make a node an accepting node
    When I create a node named Node1 at 500, 500
      And I right click at 500, 500
      And choose the option Toggle Accepting State
    Then the screen should match 'accept_node.png'
        
  Scenario: Using toggle start state should make a node an starting node
    When I create a node named Node1 at 500, 500
      And I right click at 500, 500
      And choose the option Toggle Start State
    Then the screen should match 'start_node.png'
        
  Scenario: Using the delete edge function of context menu should delete an edge
    When I create a node named Node 1 at 500, 500
      And another node named Node 2 at 550, 550
  		And I select the Edge tool
  		And I click on Node 1
  		And I click on Node 2
      And I right click at 525, 525
      And choose the option Delete Edge
    Then the screen should match 'no_edge.png'
    
  Scenario: Using toggle directed edge should make an edge a directed edge
    When I create a node named Node 1 at 500, 500
      And another node named Node 2 at 550, 550
  		And I select the Edge tool
  		And I click on Node 1
  		And I click on Node 2
      And I right click at 525, 525
      And choose the option Toggle Directed Edge
    Then the screen should match 'directed_edge.png'
  