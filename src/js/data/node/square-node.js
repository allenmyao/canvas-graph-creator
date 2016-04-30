import PolygonNode from './polygon-node';

/**
 * Node subclass for diamond nodes.
 * @class SquareNode
 */
class SquareNode extends PolygonNode {

  /**
   * Constructs a SquareNode instance.
   * @param  {number} x - x-coordinate of the node.
   * @param  {number} y - y-coordinate of the node.
   * @constructs SquareNode
   */
  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 45, 135, 225, 315 ];
    this.separation = 90;
  }

}

export { SquareNode };
export default SquareNode;
