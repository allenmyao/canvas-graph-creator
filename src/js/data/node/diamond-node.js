import { PolygonNode } from './polygon-node';

export class DiamondNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.generateDefaultTextLocation();
    this.inscribed = [ 0, 90, 180, 270 ];
    this.separation = 90;
  }

}
