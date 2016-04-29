/**
 * Class representing 2D lines. Container for a pair of 2D points and some helper functions.
 * @class Line2D
 */
class Line2D {

  /**
   * First point on the line.
   * @type {Point2D}
   */
  a;

  /**
   * Second point on the line.
   * @type {Point2D}
   */
  b;

  /**
   * Constructs a Line2D object.
   * @param  {Point2D} a - First point of the line.
   * @param  {Point2D} b - Second point of the line.
   * @constructs Line2D
   */
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  /**
   * Checks if the given point is on the line.
   * @param  {Point2D} c - The point to check.
   * @return {boolean} - Whether or not the given point is on the line.
   */
  hasPoint(c) {
    let ab = this.a.vectorTo(this.b);
    let ac = this.a.vectorTo(c);
    let cross = ab.cross(ac);
    return Math.abs(cross) < 1e-8;
  }
}

export { Line2D };
export default Line2D;
