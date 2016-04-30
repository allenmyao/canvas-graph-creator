import PolygonNode from './polygon-node';

/**
 * Node subclass for diamond nodes.
 * @class DiamondNode
 */
class DiamondNode extends PolygonNode {

  /**
   * Constructs a DiamondNode instance.
   * @param  {number} x - x-coordinate of the node.
   * @param  {number} y - y-coordinate of the node.
   * @constructs DiamondNode
   */
  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 0, 90, 180, 270 ];
    this.separation = 90;
  }

}

export { DiamondNode };
export default DiamondNode;
