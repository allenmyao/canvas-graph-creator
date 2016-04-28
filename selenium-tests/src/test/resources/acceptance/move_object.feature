Feature: Move
  As a user I want to be able to move nodes
  Background:
  	Given I navigate to the home page

  Scenario: Nodes and edges should move when I drag them
	When I create a node named Node 1 at 500, 500
		And another node named Node 2 at 600, 600
		And add an edge between Node 1 and Node 2
		And I select the Select tool
		And I click and drag from (600, 600) to (550, 550)
	Then the screen should match 'edge.png'

  Scenario: Edges cannot be moved independently
	When I create a node named Node 1 at 500, 500
		And another node named Node 2 at 550, 550
		And add an edge between Node 1 and Node 2
		And I select the Select tool
		And I click and drag from (550, 550) to (600, 600)
	Then the screen should match 'edge.png'

  Scenario: Nodes cannot be dropped on top of each other
	When I create a node named Node 1 at 500, 500
		And another node named Node 2 at 550, 550
		And add an edge between Node 1 and Node 2
		And I select the Select tool
		And I click and drag from (550, 550) to (500, 500)
	Then the screen should match 'edge.png'
