import PolygonNode from './polygon-node';

/**
 * Node subclass for diamond nodes.
 * @class PentagonNode
 */
class PentagonNode extends PolygonNode {

  /**
   * Constructs a PentagonNode instance.
   * @param  {number} x - x-coordinate of the node.
   * @param  {number} y - y-coordinate of the node.
   * @constructs PentagonNode
   */
  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 54, 126, 198, 270, 342 ];
    this.separation = 72;
  }

}

export { PentagonNode };
export default PentagonNode;
