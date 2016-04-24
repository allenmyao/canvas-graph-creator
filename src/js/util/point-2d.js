import Vector2D from './vector-2d';
import Line2D from './line-2d';

class Point2D {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(point) {
    return Math.abs(this.x - point.x) < 1e-8 && Math.abs(this.y - point.y) < 1e-8;
  }

  distanceTo(point) {
    let dx = point.x - this.x;
    let dy = point.y - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    return Math.abs(dist) < 1e-8 ? 0 : dist;
  }

  relativePositionToTriangle2D(oldTriangle, newTriangle) {
    if (this.equals(oldTriangle.a)) {
      return newTriangle.a;
    } else if (this.equals(oldTriangle.b)) {
      return newTriangle.b;
    } else if (this.equals(oldTriangle.c)) {
      return newTriangle.c;
    }
    let barycentricCoordinates = oldTriangle.getBarycentricCoordinates(this);
    let cartesianCoordiantes = newTriangle.getPointFromBarycentricCoordinates(barycentricCoordinates);
    return cartesianCoordiantes;
  }

  translatePoint(point) {
    return new Point2D(this.x + point.x, this.y + point.y);
  }

  translateVec(vec) {
    return new Point2D(this.x + vec.x, this.y + vec.y);
  }

  lineTo(point) {
    return new Line2D(this, point);
  }

  vectorTo(point) {
    return new Vector2D(point.x - this.x, point.y - this.y);
  }
}

export { Point2D };
export default Point2D;
