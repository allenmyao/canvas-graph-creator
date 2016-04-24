import PolygonNode from './polygon-node';

class OctagonNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5 ];
    this.separation = 45;
  }

}

export { OctagonNode };
export default OctagonNode;