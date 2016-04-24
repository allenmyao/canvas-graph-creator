import Point2D from './point-2d';

class Triangle2D {

  a;
  b;
  c;

  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  // get signed area of triangle
  //
  //   1  | x1 y1 1 |
  //  --- | x2 y2 1 |
  //   2! | x3 y3 1 |
  //
  // http://mathworld.wolfram.com/TriangleArea.html
  get area() {
    return 0.5 * (-1 * this.b.y * this.c.x + this.a.y * (-1 * this.b.x + this.c.x) + this.a.x * (this.b.y - this.c.y) + this.b.x * this.c.y);
  }

  // http://stackoverflow.com/a/14382692/1418962
  // https://en.wikipedia.org/wiki/Barycentric_coordinate_system#Conversion_between_barycentric_and_Cartesian_coordinates
  getBarycentricCoordinates(point) {
    let area = this.area;
    let s = 1 / (2 * area) * (this.a.y * this.c.x - this.a.x * this.c.y + (this.c.y - this.a.y) * point.x + (this.a.x - this.c.x) * point.y);
    let t = 1 / (2 * area) * (this.a.x * this.b.y - this.a.y * this.b.x + (this.a.y - this.b.y) * point.x + (this.b.x - this.a.x) * point.y);
    return new Point2D(s, t);
  }

  getPointFromBarycentricCoordinates(point) {
    let s = point.x;
    let t = point.y;
    let x = (1 - s - t) * this.a.x + s * this.b.x + t * this.c.x;
    let y = (1 - s - t) * this.a.y + s * this.b.y + t * this.c.y;
    return new Point2D(x, y);
  }
}

export { Triangle2D };
export default Triangle2D;
