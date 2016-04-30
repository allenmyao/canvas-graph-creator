/**
 * Data representation of a graph node.
 * @class Node
 */
class Node {

  static numNodes = 0;
  id = Node.numNodes++;

  // graph data
  x;
  y;
  edges = new Set();
  isAcceptingState = false;  // boolean for DFA/NFA purposes, indicated by double circle
  isStartingState = false;  // boolean for DFA/NFA purposes, idicated by incoming arrow

  // status
  isSelected = false;

  // label
  label;

  // appearance
  color = '#000000'; // string Format as hex Color
  fillColor = '#FFFFFF'; // string Format as hex Color
  selectedColor = '#FF0000';
  lineWidth = 1; // numerical value for thickenss of line

  /**
   * Constructs a Node instance. Should not be called directly.
   * @param  {number} x - x-coordinate of the node.
   * @param  {number} y - y-coordinate of the node.
   * @constructs Node
   */
  constructor(x, y) {
    if (typeof x === 'undefined' || typeof y === 'undefined') {
      throw Error(`Node constructor requires two arguments: x, y. Actually passed in: ${x}, ${y}`);
    }
    this.x = x;
    this.y = y;
  }

  /**
   * Update the node position.
   * @param {number} x - The new x-coordinate.
   * @param {number} y - The new y-coordinate.
   */
  setPos(x, y) {
    this.label.x += (x - this.x);
    this.label.y += (y - this.y);
    this.x = x;
    this.y = y;
    for (let edge of this.edges) {
      edge.updateEndpoints();
    }
  }

  /**
   * Check if the node contains the given point.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @throws {Error} - Throws error if called.
   * @abstract
   */
  containsPoint(x, y) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  /**
   * Find the distance from the node's coordinates to a given point.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @throws {Error} - Throws error if called.
   * @abstract
   */
  distanceToPoint(x, y) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  /**
   * Find the point on the edge of the node in the direction of the given point.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @throws {Error} - Throws error if called.
   * @abstract
   */
  edgePointInDirection(x, y) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  /**
   * Draw the node on the given canvas context.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   * @throws {Error} - Throws error if called.
   * @abstract
   */
  draw(context) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  /**
   * Get the point on the edge of the node at the given angle.
   * @param  {number} angle - The angle (clockwise from +x axis).
   * @throws {Error} - Throws error if called.
   * @abstract
   */
  getAnglePoint(angle) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  /**
   * Draw the Label object associated with this node.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   */
  drawLabel(context) {
    this.label.draw(context);
  }

}

export { Node };
export default Node;
