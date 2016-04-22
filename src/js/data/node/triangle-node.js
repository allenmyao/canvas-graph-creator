import { PolygonNode } from './polygon-node';

export class TriangleNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.inscribed = [ 30, 150, 270 ];
    this.separation = 120;
  }

}
