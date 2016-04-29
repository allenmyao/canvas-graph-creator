import chai from 'chai';
chai.should();

import Point2D from '../../src/js/util/point-2d';
import Triangle2D from '../../src/js/util/triangle-2d';

/** @test {Triangle2D} **/
describe('Triangle2D', () => {
  /** @test {Triangle2D#constructor} **/
  describe('#constructor(a, b, c)', () => {
    it('creates instance of Triangle2D', () => {
      (new Triangle2D()).should.be.instanceof(Triangle2D);
    });
  });

  /** @test {Triangle2D#area} **/
  describe('.area', () => {
    let a;
    let b;
    let c;
    let triangle;

    it('should return the area of the triangle', () => {
      a = new Point2D(0, 0);
      b = new Point2D(3, 0);
      c = new Point2D(0, 4);
      triangle = new Triangle2D(a, b, c);
      (triangle.area).should.be.equal(6);
    });

    it('should return a negative value if vertexes are oriented clockwise around triangle', () => {
      a = new Point2D(0, 0);
      b = new Point2D(0, 4);
      c = new Point2D(3, 0);
      triangle = new Triangle2D(a, b, c);
      (triangle.area).should.be.equal(-6);
    });
  });

  /** @test {Triangle2D#getBarycentricCoordinates} **/
  describe('#getBarycentricCoordinates', () => {
    let a;
    let b;
    let c;
    let triangle;
    let point;
    let barycentricCoordinates;

    beforeEach(() => {
      a = new Point2D(1, 0);
      b = new Point2D(-1, 0);
      c = new Point2D(0, 3);
      triangle = new Triangle2D(a, b, c);
    });

    it('should return (1/3, 1/3) for centroid', () => {
      let cx = (a.x + b.x + c.x) / 3;
      let cy = (a.y + b.y + c.y) / 3;
      point = new Point2D(cx, cy);
      barycentricCoordinates = triangle.getBarycentricCoordinates(point);
      (barycentricCoordinates.x).should.be.equal(1 / 3);
      (barycentricCoordinates.y).should.be.equal(1 / 3);
    });
  });

  /** @test {Triangle2D#getPointFromBarycentricCoordinates} **/
  describe('#getPointFromBarycentricCoordinates', () => {
    let a;
    let b;
    let c;
    let triangle;
    let point;
    let barycentricCoordinates;

    beforeEach(() => {
      a = new Point2D(1, 0);
      b = new Point2D(-1, 0);
      c = new Point2D(0, 3);
      triangle = new Triangle2D(a, b, c);
    });

    it('should return centroid for coordinates (1/3, 1/3)', () => {
      barycentricCoordinates = new Point2D(1 / 3, 1 / 3);
      point = triangle.getPointFromBarycentricCoordinates(barycentricCoordinates);
      let cx = (a.x + b.x + c.x) / 3;
      let cy = (a.y + b.y + c.y) / 3;
      (point.x).should.be.equal(cx);
      (point.y).should.be.equal(cy);
    });
  });
});
