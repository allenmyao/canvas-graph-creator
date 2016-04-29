import chai from 'chai';
chai.should();

import Point2D from '../../src/js/util/point-2d';
import Vector2D from '../../src/js/util/vector-2d';
import Triangle2D from '../../src/js/util/triangle-2d';

/** @test {Point2D} **/
describe('Point2D', () => {
  /** @test {Point2D#constructor} **/
  describe('#constructor(x, y)', () => {
    it('creates instance of Point2D', () => {
      (new Point2D()).should.be.instanceof(Point2D);
    });

    it('should set values below the defined epsilon to zero', () => {
      let point = new Point2D(Point2D.EPSILON / 2, Point2D.EPSILON / 2);
      (point.x).should.be.equal(0);
      (point.y).should.be.equal(0);
    });
  });

  /** @test {Point2D#equals} **/
  describe('#equals(point)', () => {
    it('should return true if the same point object is passed in', () => {
      let point = new Point2D(0, 0);
      (point.equals(point)).should.be.true;
    });

    it('should return true if coordinates are equal', () => {
      let pointA = new Point2D(0, 0);
      let pointB = new Point2D(0, 0);
      (pointA.equals(pointB)).should.be.true;
    });

    it('should return false if x-coordinates are not equal', () => {
      let pointA = new Point2D(0, 0);
      let pointB = new Point2D(1, 0);
      (pointA.equals(pointB)).should.be.false;
    });

    it('should return false if y-coordinates are not equal', () => {
      let pointA = new Point2D(0, 0);
      let pointB = new Point2D(0, 1);
      (pointA.equals(pointB)).should.be.false;
    });
  });

  /** @test {Point2D#distanceTo} **/
  describe('#distanceTo(point)', () => {
    let pointA;
    let pointB;

    it('should return the Euclidian distance (i.e. straight line distance)', () => {
      pointA = new Point2D(0, 0);
      pointB = new Point2D(1, 0);
      (pointA.distanceTo(pointB)).should.be.equal(1);

      pointA = new Point2D(0, 0);
      pointB = new Point2D(3, 4);
      (pointA.distanceTo(pointB)).should.be.equal(5);

      pointA = new Point2D(-1, -1);
      pointB = new Point2D(-6, -13);
      (pointA.distanceTo(pointB)).should.be.equal(13);
    });

    it('should return zero if distance less than the defined epsilon', () => {
      pointA = new Point2D(0, 0);
      pointB = new Point2D(0, 0);
      pointB.x = Point2D.EPSILON / 2;
      (pointA.distanceTo(pointB)).should.be.equal(0);
    });
  });

  /** @test {Point2D#relativePositionToTriangle2D} **/
  describe('#relativePositionToTriangle2D(oldTriangle, newTriangle)', () => {
    let oldA;
    let oldB;
    let oldC;
    let newA;
    let newB;
    let newC;
    let oldTriangle;
    let newTriangle;
    let oldPoint;
    let newPoint;

    beforeEach(() => {
      oldA = new Point2D(1, 0);
      oldB = new Point2D(-1, 0);
      oldC = new Point2D(0, 3);
      newA = new Point2D(2, -1);
      newB = new Point2D(-2, -1);
      newC = new Point2D(0, 5);
      oldTriangle = new Triangle2D(oldA, oldB, oldC);
      newTriangle = new Triangle2D(newA, newB, newC);
    });

    it('should not change the coordinates of the original point', () => {
      oldPoint = new Point2D(0, 0);
      newPoint = oldPoint.relativePositionToTriangle2D(oldTriangle, newTriangle);
      (newPoint === oldPoint).should.be.false;
    });

    it('should return vertex A on new triangle if on vertex A of old triangle', () => {
      oldPoint = new Point2D(oldA.x, oldA.y);
      newPoint = oldPoint.relativePositionToTriangle2D(oldTriangle, newTriangle);
      (newPoint.x).should.be.equal(newA.x);
      (newPoint.y).should.be.equal(newA.y);
    });

    it('should return vertex B on new triangle if on vertex B of old triangle', () => {
      oldPoint = new Point2D(oldB.x, oldB.y);
      newPoint = oldPoint.relativePositionToTriangle2D(oldTriangle, newTriangle);
      (newPoint.x).should.be.equal(newB.x);
      (newPoint.y).should.be.equal(newB.y);
    });

    it('should return vertex C on new triangle if on vertex C of old triangle', () => {
      oldPoint = new Point2D(oldC.x, oldC.y);
      newPoint = oldPoint.relativePositionToTriangle2D(oldTriangle, newTriangle);
      (newPoint.x).should.be.equal(newC.x);
      (newPoint.y).should.be.equal(newC.y);
    });

    it('should return the centroid of new triangle if on centroid of old triangle', () => {
      let oldx = (oldA.x + oldB.x + oldC.x) / 3;
      let oldy = (oldA.y + oldB.y + oldC.y) / 3;
      oldPoint = new Point2D(oldx, oldy);
      newPoint = oldPoint.relativePositionToTriangle2D(oldTriangle, newTriangle);
      let newx = (newA.x + newB.x + newC.x) / 3;
      let newy = (newA.y + newB.y + newC.y) / 3;
      (newPoint.x).should.be.within(newx - Point2D.EPSILON, newx + Point2D.EPSILON);
      (newPoint.y).should.be.within(newy - Point2D.EPSILON, newy + Point2D.EPSILON);
    });

    it('should return point on side of new triangle if on side of old triangle', () => {
      oldPoint = new Point2D((oldA.x + oldB.x) / 2, (oldA.y + oldB.y) / 2);
      newPoint = oldPoint.relativePositionToTriangle2D(oldTriangle, newTriangle);
      (newPoint.x).should.be.equal((newA.x + newB.x) / 2);
      (newPoint.y).should.be.equal((newA.y + newB.y) / 2);
    });

    it('should be able to handle triangle vertex order rotations', () => {
      newC = new Point2D(oldA.x, oldA.y);
      newA = new Point2D(oldB.x, oldB.y);
      newB = new Point2D(oldC.x, oldC.y);
      newTriangle = new Triangle2D(newA, newB, newC);
      oldPoint = new Point2D(oldA.x, oldA.y);
      newPoint = oldPoint.relativePositionToTriangle2D(oldTriangle, newTriangle);
      (newPoint.equals(newA)).should.be.true;
    });
  });

  /** @test {Point2D#translateVec} **/
  describe('#translateVec(vec)', () => {
    let vector;
    let point;

    beforeEach(() => {
      vector = new Vector2D(1, 1);
      point = new Point2D(0, 0);
    });

    it('should be translated in the vector direction', () => {
      (point.translateVec(vector).x).should.be.equal(1);
      (point.translateVec(vector).y).should.be.equal(1);
    });

    it('should not modify values of the original point object', () => {
      (point.x).should.be.equal(0);
      (point.y).should.be.equal(0);
    });
  });

  /** @test {Point2D#lineTo} **/
  describe('#lineTo(point)', () => {
    let pointA;
    let pointB;
    let line;

    beforeEach(() => {
      pointA = new Point2D(0, 0);
      pointB = new Point2D(1, 1);
      line = pointA.lineTo(pointB);
    });

    it('should create line with current point as first point', () => {
      (line.a.equals(pointA)).should.be.true;
    });

    it('should create line with other point as second point', () => {
      (line.b.equals(pointB)).should.be.true;
    });

    it('should create line using references to the original point objects', () => {
      (line.a === pointA).should.be.true;
      (line.b === pointB).should.be.true;
    });
  });

  /** @test {Point2D#vectorTo} **/
  describe('#vectorTo(point)', () => {
    let pointA;
    let pointB;
    let vector;

    it('should create vector from first point to second point', () => {
      pointA = new Point2D(0, 0);
      pointB = new Point2D(1, 1);
      vector = pointA.vectorTo(pointB);
      (vector.x).should.be.equal(1);
      (vector.y).should.be.equal(1);
    });

    it('should be able to return vectors with negative components', () => {
      pointA = new Point2D(0, 0);
      pointB = new Point2D(-1, -1);
      vector = pointA.vectorTo(pointB);
      (vector.x).should.be.equal(-1);
      (vector.y).should.be.equal(-1);
    });
  });
});
