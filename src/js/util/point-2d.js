import Vector2D from './vector-2d';
import Line2D from './line-2d';

/**
 * Class representing 2D points.
 * @class Point2D
 */
class Point2D {

  static EPSILON = 1e-8;

  /**
   * x-coordinate of the point.
   * @type {number}
   */
  x;

  /**
   * y-coordinate of the point.
   * @type {number}
   */
  y;

  /**
   * Constructs a Point2D object.
   * @param {number} x - x-coordinate of the point.
   * @param {number} y - y-coordinate of the point.
   * @constructs Point2D
   */
  constructor(x, y) {
    this.x = Math.abs(x) < Point2D.EPSILON ? 0 : x;
    this.y = Math.abs(y) < Point2D.EPSILON ? 0 : y;
  }

  /**
   * Checks if this point and another point are equal. Returns true if the x- and y-coordinates are equal.
   * @param  {Point2D} point - Point to compare with.
   * @return {boolean} - Whether or not the points are equivalent.
   */
  equals(point) {
    return Math.abs(this.x - point.x) < Point2D.EPSILON && Math.abs(this.y - point.y) < Point2D.EPSILON;
  }

  /**
   * Finds the distance between this point and another point.
   * @param  {Point2D} point - Point to find the distance to.
   * @return {number} - Distance between the points.
   */
  distanceTo(point) {
    let dx = point.x - this.x;
    let dy = point.y - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    return Math.abs(dist) < Point2D.EPSILON ? 0 : dist;
  }

  /**
   * Finds the coordinates this point should have relative to a triangle.
   * @param  {Triangle2D} oldTriangle - Triangle2D object containing the triangle's old position.
   * @param  {Triangle2D} newTriangle - Triangle2D object containing the triangle's new position.
   * @return {Point2D} - Point representing the point's location relative the the triangle's new position.
   */
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

  /**
   * Translates the point using a vector.
   * @param  {Vector2D} vec - The vector to translate the point by.
   * @return {Point2D} - Point resulting from the translation.
   */
  translateVec(vec) {
    return new Point2D(this.x + vec.x, this.y + vec.y);
  }

  /**
   * Creates and returns a Line2D object using this point as the start point and another point as the end point.
   * @param  {Point2D} point - Point to be used as the end point.
   * @return {Line2D} - Line2D object created.
   */
  lineTo(point) {
    return new Line2D(this, point);
  }

  /**
   * Finds the vector distance from this point to another point.
   * @param  {Point2D} point - Point to find the vector distance to.
   * @return {Vector2D} - Vector2D object representing the vector distance.
   */
  vectorTo(point) {
    return new Vector2D(point.x - this.x, point.y - this.y);
  }
}

export { Point2D };
export default Point2D;
