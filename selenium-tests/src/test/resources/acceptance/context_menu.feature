Feature: Context Menu
  As a user I want to have a context menu that allows me to quickly 
access different tools. 
  Background:
    Given I navigate to the home page
    
  Scenario: Using the add node function of context menu should create a node
    When I open the context menu at 500, 500
      And choose the Add Circle Node option
    Then there should be 1 node
        
  Scenario: Using the delete node function of context menu should delete a node
    When I create a node named Node1 at 500, 500
      And I open the context menu at 500, 500
      And choose the Delete option
    Then there should be no nodes
        
  Scenario: Using toggle accept state should make a node an accepting node
    When I create a node named Node1 at 500, 500
      And I open the context menu at 500, 500
      And choose the Toggle Accepting State option
    Then the screen should match 'isAcceptingState_true.png'
        
  Scenario: Using toggle start state should make a node an starting node
    When I create a node named Node1 at 500, 500
      And I open the context menu at 500, 500
      And choose the Toggle Start State option
    Then the screen should match 'isStartingState_true.png'
        
  Scenario: Using the delete edge function of context menu should delete an edge
    When I create a node named Node 1 at 500, 500
      And another node named Node 2 at 550, 550
  	  And add an edge between Node 1 and Node 2
      And I open the context menu at 525, 525
      And choose the Delete option
    Then the screen should match 'no_edge.png'
    
  Scenario: Using toggle directed edge should make an edge a directed edge
    When I create a node named Node 1 at 500, 500
      And another node named Node 2 at 550, 550
  	  And add an edge between Node 1 and Node 2
      And I open the context menu at 525, 525
      And choose the Toggle Directed Edge option
    Then the screen should match 'directed_edge.png'
    
  Scenario: Using add edge function of context menu should create an edge
    When I create a node named Node 1 at 500, 500
      And another node named Node 2 at 550, 550
      And I open the context menu at 500, 500
      And choose the Add Edge option
      And click on Node 2
    Then the screen should match 'edge.png'
