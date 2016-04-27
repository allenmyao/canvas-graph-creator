Feature: Erase
  As a user I want to be able to erase nodes and edges
  Background:
  	Given I navigate to the home page

  Scenario: Nothing should be erased when clicking empty space
  	When I create a node named Node 1 at 500, 500
  		And another node named Node 2 at 550, 550
  		And add an edge between Node 1 and Node 2
  		And I select the Erase tool
  		And I click and drag from (350, 350) to (400, 400)
  	Then the screen should match 'edge.png'

   Scenario: Edge should be erased when dragging over it
  	When I create a node named Node 1 at 500, 500
  		And another node named Node 2 at 550, 550
  		And add an edge between Node 1 and Node 2
  		And I select the Erase tool
  		And I click and drag from (520, 530) to (530, 520)
  	Then the screen should match 'no_edge.png'

   Scenario: Node and its connected edges should be erased when clicking on it
  	When I create a node named Node 1 at 500, 500
  		And another node named Node 2 at 550, 550
  		And add an edge between Node 1 and Node 2
  		And I select the Erase tool
  		And I click on Node 2
  	Then the screen should match 'circle_node.png'

   Scenario: Eraser should be able to delete multiple objects in one drag
  	When I create a node named Node 1 at 500, 500
  		And another node named Node 2 at 550, 550
  		And I select the Erase tool
  		And I click and drag from (500, 500) to (550, 550)
  	Then there should be no nodes