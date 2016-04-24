class Line2D {
  a;
  b;

  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  get length() {
    return this.a.distanceTo(this.b);
  }

  hasPoint(c) {
    let ab = this.a.vectorTo(this.b);
    let ac = this.a.vectorTo(c);
    let cross = ab.cross(ac);
    return Math.abs(cross) < 1e-8;
  }
}

export { Line2D };
export default Line2D;
