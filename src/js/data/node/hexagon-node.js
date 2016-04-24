import PolygonNode from './polygon-node';

class HexagonNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 0, 60, 120, 180, 240, 300 ];
    this.separation = 60;
  }

}

export { HexagonNode };
export default HexagonNode;
