Feature: Add Node
  As a user I want to be able to add nodes
  Background:
  	Given I navigate to the home page

  Scenario Outline: Node tool should have mode for <shape> nodes
    When I select the Node tool
      And I change the tool mode to <shape>
      And I create a node at 500, 500
    Then the screen should match '<shape>_node.png'

    Examples:
      | shape     |
      |  circle   |
      |  triangle |
      |  square   |
      |  diamond  |
      |  pentagon |
      |  hexagon  |
      |  octagon  |

  Scenario Outline: Node tool should have input for <fieldname>
    When I select the Node tool
      And I set the <type> input for <fieldname> to <value>
      And I create a node at 500, 500
    Then the screen should match '<fieldname>_<value>.png'

    Examples:
      | fieldname          | type      | value    |
      |  isAcceptingState  |  checkbox |  true    |
      |  isStartingState   |  checkbox |  true    |
      |  radius            |  text     |  10      |
      |  color             |  color    |  #0000ff |
      |  fillColor         |  color    |  #00ff00 |
      |  lineWidth         |  text     |  3       |
