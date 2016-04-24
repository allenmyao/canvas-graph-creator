import Point2D from './point-2d';

class Vector2D {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    let len = Math.sqrt(this.x * this.x + this.y * this.y);
    return Math.abs(len) < 1e-8 ? 0 : len;
  }

  equals(vec) {
    return Math.abs(this.x - vec.x) < 1e-8 && Math.abs(this.y - vec.y) < 1e-8;
  }

  add(vec) {
    return new Vector2D(this.x + vec.x, this.y + vec.y);
  }

  sub(vec) {
    return new Vector2D(this.x - vec.x, this.y - vec.y);
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  cross(vec) {
    return this.x * vec.y - this.y * vec.x;
  }

  scale(n) {
    return new Vector2D(this.x * n, this.y * n);
  }

  rotateDegrees(deg) {
    return this.rotateRadians(deg * (Math.PI / 180));
  }

  rotateRadians(rad) {
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    return new Vector2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  degreesTo(vec) {
    let angle = Math.atan2(vec.y, vec.x) - Math.atan2(this.y, this.x);
    angle *= 180 / Math.PI;
    angle = (angle + 360) % 360;
    if (Math.abs(Math.round(angle) - angle) < 1e-8) {
      return Math.round(angle);
    }
    return angle;
  }

  projectOnto(vec) {
    return vec.scale(this.dot(vec) / vec.dot(vec));
  }

  toPoint() {
    return new Point2D(this.x, this.y);
  }
}

export { Vector2D };
export default Vector2D;
