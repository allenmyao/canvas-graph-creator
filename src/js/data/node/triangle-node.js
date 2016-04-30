import PolygonNode from './polygon-node';

/**
 * Node subclass for diamond nodes.
 * @class TriangleNode
 */
class TriangleNode extends PolygonNode {

  /**
   * Constructs a TriangleNode instance.
   * @param  {number} x - x-coordinate of the node.
   * @param  {number} y - y-coordinate of the node.
   * @constructs TriangleNode
   */
  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 30, 150, 270 ];
    this.separation = 120;
  }

}

export { TriangleNode };
export default TriangleNode;
