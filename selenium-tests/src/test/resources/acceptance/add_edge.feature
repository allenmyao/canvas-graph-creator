Feature: Add Edge
  As a user I want to be able to draw and select nodes
  Background:
  	Given I navigate to the home page

  Scenario: Edge should not be created unless Edge tool is used
  	When I create a node named Node 1 at 500, 500
  		And another node named Node 2 at 550, 550
  		And I click on Node 1
  		And I click on Node 2
  	And the screen should match 'no_edge.png'

  Scenario: Edge should be created when Edge tool is used
  	When I create a node named Node 1 at 500, 500
  		And another node named Node 2 at 550, 550
  		And I select the Edge tool
  		And I click on Node 1
  		And I click on Node 2
  	Then the screen should match 'edge.png'

  Scenario: Integration
  	When I create a node named Node 1 at 500, 500
  		And another node named Node 2 at 550, 550
  		And finally another node named Node 3 at 320, 550
  		And add an edge between Node 1 and Node 2
  		And add an edge between Node 1 and Node 3
	Then the screen should match 'integration.png'
