import Point2D from './point-2d';

/**
 * Class representing a 2D triangle.
 * @class Triangle2D.
 */
class Triangle2D {

  /**
   * First endpoint of the triangle.
   * @type {Point2D}
   */
  a;

  /**
   * Second endpoint of the triangle.
   * @type {Point2D}
   */
  b;

  /**
   * Third endpoint of the triangle.
   * @type {Point2D}
   */
  c;

  /**
   * Constructs a Triangle2D object.
   * @param  {Point2D} a - First endpoint of the triangle.
   * @param  {Point2D} b - Second endpoint of the triangle.
   * @param  {Point2D} c - Third endpoint of the triangle.
   * @constructs Triangle2D
   */
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
  /**
   * Getter for the (signed) area of the triangle.
   *
   *          1  | x1 y1 1 |
   * area =  --- | x2 y2 1 |
   *          2  | x3 y3 1 |
   *
   * Source: http://mathworld.wolfram.com/TriangleArea.html
   * @return {number} - Signed area of the triangle.
   */
  get area() {
    return 0.5 * (-1 * this.b.y * this.c.x + this.a.y * (-1 * this.b.x + this.c.x) + this.a.x * (this.b.y - this.c.y) + this.b.x * this.c.y);
  }

  /**
   * Find the barycentric coordinates of a point relative to this triangle.
   * Source: http://stackoverflow.com/a/14382692/1418962
   * More info: https://en.wikipedia.org/wiki/Barycentric_coordinate_system#Conversion_between_barycentric_and_Cartesian_coordinates
   * @param  {Point2D} point - The point to find the barycentric coordinates of.
   * @return {Point2D} - Point object containing the barycentric coordinates.
   */
  getBarycentricCoordinates(point) {
    let area = this.area;
    let s = 1 / (2 * area) * (this.a.y * this.c.x - this.a.x * this.c.y + (this.c.y - this.a.y) * point.x + (this.a.x - this.c.x) * point.y);
    let t = 1 / (2 * area) * (this.a.x * this.b.y - this.a.y * this.b.x + (this.a.y - this.b.y) * point.x + (this.b.x - this.a.x) * point.y);
    return new Point2D(s, t);
  }

  /**
   * Find the cartesian coordinates of a point given its barycentric coordinates.
   * @param  {Point2D} point - The point to find the coordinates of.
   * @return {Point2D} - Point object containing the cartesian coordinates.
   */
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
