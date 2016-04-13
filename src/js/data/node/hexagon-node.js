import { PolygonNode } from './polygon-node';

export class HexagonNode extends PolygonNode {

  constructor(x, y) {
    super(x, y);
    this.generateDefaultTextLocation();
    this.inscribed = [ 0, 60, 120, 180, 240, 300 ];
    this.separation = 60;
  }

}
