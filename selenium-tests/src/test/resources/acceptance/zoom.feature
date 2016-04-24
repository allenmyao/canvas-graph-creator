Feature: Canvas Zoom
  As a user I want to be able to zoom in and out of the canvas while retaining visibility and proportions

  Background:
    Given I navigate to the home page
    And I create a node at 500, 500

  Scenario: Zoom should initially be 100%
    When I do nothing
    Then the screen should match 'no_zoom.png'

  Scenario: Scrolling out should zoom out
    When I scroll out by 50 ticks
    Then the screen should match 'zoom_out.png'

  Scenario: Scrolling in should zoom in
    When I scroll in by 50 ticks
    Then the screen should match 'zoom_in.png'

  Scenario: Pressing the reset button should reset the zoom
    When I scroll out by 50 ticks
    And I press the reset button
    Then the screen should match 'no_zoom.png'
