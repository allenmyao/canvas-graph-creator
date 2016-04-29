/**
 * Class for representing 2D vectors.
 * @class Vector2D
 */
class Vector2D {

  static EPSILON = 1e-8;

  /**
   * x component of the vector.
   * @type {number}
   */
  x;

  /**
   * y component of the vector.
   * @type {number}
   */
  y;

  /**
   * Constructs a Vector2D object.
   * @param  {number} x - x-component of the vector.
   * @param  {number} y - y-component of the vector.
   * @constructs Vector2D
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Getter for vector length.
   * @return {number} - The length of the vector.
   */
  get length() {
    let len = Math.sqrt(this.x * this.x + this.y * this.y);
    return Math.abs(len) < Vector2D.EPSILON ? 0 : len;
  }

  /**
   * Checks if this vector and another vector are equal. Returns true if the x- and y-components are equal.
   * @param  {Vector2D} vec - Vector to compare with.
   * @return {boolean} - Whether or not the vectors are equivalent.
   */
  equals(vec) {
    return Math.abs(this.x - vec.x) < Vector2D.EPSILON && Math.abs(this.y - vec.y) < Vector2D.EPSILON;
  }

  /**
   * Finds the result of addition with another vector.
   * @param {Vector2D} vec - The vector to add.
   * @return {Vector2D} - The result of vector addition.
   */
  add(vec) {
    return new Vector2D(this.x + vec.x, this.y + vec.y);
  }

  /**
   * Finds the result of subtracting another vector.
   * @param {Vector2D} vec - The vector to subtract.
   * @return {Vector2D} - The result of vector subtraction.
   */
  sub(vec) {
    return new Vector2D(this.x - vec.x, this.y - vec.y);
  }

  /**
   * Finds the dot product between this vector and another vector.
   * @param  {Vector2D} vec - Vector to find a dot product with.
   * @return {number} - The value of the dot product.
   */
  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  /**
   * Finds the "cross product" between this vector and another vector.
   * @param  {Vector2D} vec - Vector to find the cross product with.
   * @return {number} - The value of the cross product. Zero means the vectors are parallel.
   */
  cross(vec) {
    return this.x * vec.y - this.y * vec.x;
  }

  /**
   * Finds the vector resulting from multiplication by a scalar.
   * @param  {number} n - The scalar to multiply by.
   * @return {Vector2D} - Vector resulting from the scale.
   */
  scale(n) {
    return new Vector2D(this.x * n, this.y * n);
  }

  /**
   * Finds the vector resulting from a rotation in degrees.
   * @param  {number} deg - Angle (in degrees) to rotate.
   * @return {Vector2D} - Vector resulting from the rotation.
   */
  rotateDegrees(deg) {
    return this.rotateRadians(deg * (Math.PI / 180));
  }

  /**
   * Finds the vector resulting from a rotation in radians.
   * @param  {number} rad - Angle (in radians) to rotate.
   * @return {Vector2D} - Vector resulting from the rotation.
   */
  rotateRadians(rad) {
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    return new Vector2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  /**
   * Finds the angle between two vectors (in degrees).
   * @param  {Vector2D} vec - Vector to find the angle to.
   * @return {number} - Angle between the vectors in degrees.
   */
  degreesTo(vec) {
    let angle = Math.atan2(vec.y, vec.x) - Math.atan2(this.y, this.x);
    angle *= 180 / Math.PI;
    angle = (angle + 360) % 360;
    if (Math.round(angle) !== angle && Math.abs(Math.round(angle) - angle) < Vector2D.EPSILON) {
      return Math.round(angle);
    }
    return angle;
  }

  /**
   * Finds the vector projection of this vector onto another vector.
   * @param  {Vector2D} vec - Vector to project onto.
   * @return {Vector2D} - Vector resulting from the vector projection.
   */
  projectOnto(vec) {
    return vec.scale(this.dot(vec) / vec.dot(vec));
  }
}

export { Vector2D };
export default Vector2D;
