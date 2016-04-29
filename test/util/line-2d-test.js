import chai from 'chai';
chai.should();

import Point2D from '../../src/js/util/point-2d';
import Line2D from '../../src/js/util/line-2d';

/** @test {Line2D} **/
describe('Line2D', () => {
  /** @test {Line2D#constructor} **/
  describe('#constructor(a, b)', () => {
    it('creates instance of Line2D', () => {
      (new Line2D()).should.be.instanceof(Line2D);
    });
  });

  /** @test {Line2D#hasPoint} **/
  describe('#hasPoint(c)', () => {
    let a;
    let b;
    let line;

    beforeEach(() => {
      a = new Point2D(0, 0);
      b = new Point2D(10, 0);
      line = new Line2D(a, b);
    });

    it('should return true if point is between a and b', () => {
      let c = new Point2D(5, 0);
      (line.hasPoint(c)).should.be.true;
    });

    it('should return true if point is on the line but not between a and b', () => {
      let c = new Point2D(20, 0);
      (line.hasPoint(c)).should.be.true;
    });

    it('should return true if point has same coordinates as a', () => {
      let c = new Point2D(0, 0);
      (line.hasPoint(c)).should.be.true;
    });

    it('should return true if point has same coordinates as b', () => {
      let c = new Point2D(10, 0);
      (line.hasPoint(c)).should.be.true;
    });

    it('should return false if point is not on the line', () => {
      let c = new Point2D(0, 10);
      (line.hasPoint(c)).should.be.false;
    });
  });
});
