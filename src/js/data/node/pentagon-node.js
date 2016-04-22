import PolygonNode from './polygon-node';

class PentagonNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 54, 126, 198, 270, 342 ];
    this.separation = 72;
  }

}

export { PentagonNode };
export default PentagonNode;
