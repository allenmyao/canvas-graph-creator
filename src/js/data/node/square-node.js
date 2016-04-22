import PolygonNode from './polygon-node';

class SquareNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 45, 135, 225, 315 ];
    this.separation = 90;
  }

}

export { SquareNode };
export default SquareNode;
