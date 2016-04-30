import PolygonNode from './polygon-node';

/**
 * Node subclass for diamond nodes.
 * @class HexagonNode
 */
class HexagonNode extends PolygonNode {

  /**
   * Constructs a HexagonNode instance.
   * @param  {number} x - x-coordinate of the node.
   * @param  {number} y - y-coordinate of the node.
   * @constructs HexagonNode
   */
  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 0, 60, 120, 180, 240, 300 ];
    this.separation = 60;
  }

}

export { HexagonNode };
export default HexagonNode;
