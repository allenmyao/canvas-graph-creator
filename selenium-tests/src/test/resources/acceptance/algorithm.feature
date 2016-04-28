Feature: Run Algorithm
  As a user I want to be able to run algorithms on graphs I have created
  Background:
  	Given I navigate to the home page

  Scenario: Using the run algorithm tool of tool bar should run a traversal algorithm
  	When I create a node named Node 1 at 500, 500
  		And another node named Node 2 at 550, 550
      And another node named Node 3 at 525, 525
      And another node named Node 4 at 575, 575
  		And add an edge between Node 1 and Node 2
      And add an edge between Node 2 and Node 3
      And add an edge between Node 3 and Node 4
      And add an edge between Node 4 and node 1
  		And I select the Algorithm tool
  		And I select a source Node
  	Then the screen should match 'traversal.png'
