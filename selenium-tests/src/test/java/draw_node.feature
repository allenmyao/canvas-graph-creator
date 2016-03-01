Feature: Add Node
  As a user
 
  Scenario: Go to website
  	Given I navigate to the home page on Chrome
  	When I create a node named 'Alice' at 33, 33
  	When another node named 'Bob' at 66, 6
	Then Foo