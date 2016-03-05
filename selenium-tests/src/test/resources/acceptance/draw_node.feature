Feature: Draw Node
  As a user I want to be able to draw and select nodes

  Background:
  	Given I navigate to the home page
  	
  Scenario: There should initially be no nodes
	When I do nothing
	Then there should be no nodes
	
  Scenario: Clicking on an node should not create a new node
	When I create a node at 33, 33
	And I try to create a node at 50, 50
	Then there should be 1 node

  Scenario: Clicking on an empty space should create a new node
  	When I create a node at 33, 33
  	And another node at 99, 99
  	Then there should be 2 nodes
