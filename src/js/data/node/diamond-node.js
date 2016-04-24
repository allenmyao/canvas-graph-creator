import PolygonNode from './polygon-node';

class DiamondNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 0, 90, 180, 270 ];
    this.separation = 90;
  }

}

export { DiamondNode };
export default DiamondNode;
