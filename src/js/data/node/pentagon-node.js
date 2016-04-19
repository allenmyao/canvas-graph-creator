import { PolygonNode } from './polygon-node';

export class PentagonNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.generateDefaultTextLocation();
    this.inscribed = [ 54, 126, 198, 270, 342 ];
    this.separation = 72;
  }

}
