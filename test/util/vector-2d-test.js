import chai from 'chai';
chai.should();

import Vector2D from '../../src/js/util/vector-2d';

/** @test {Vector2D} **/
describe('Vector2D', () => {
  /** @test {Vector2D#constructor} **/
  describe('#constructor(a, b)', () => {
    it('creates instance of Vector2D', () => {
      (new Vector2D()).should.be.instanceof(Vector2D);
    });
  });

  /** @test {Vector2D#length} **/
  describe('.length', () => {
    it('should return the magnitude of the vector', () => {
      let vector = new Vector2D(3, 4);
      (vector.length).should.be.equal(5);
    });
  });

  /** @test {Vector2D#equals} **/
  describe('#equals(vec)', () => {
    it('should return true if the same vector object is passed in', () => {
      let vector = new Vector2D(0, 0);
      (vector.equals(vector)).should.be.true;
    });

    it('should return true if the x- and y-components are equal', () => {
      let vectorA = new Vector2D(0, 0);
      let vectorB = new Vector2D(0, 0);
      (vectorA.equals(vectorB)).should.be.true;
    });

    it('should return false if the x-components are not equal', () => {
      let vectorA = new Vector2D(0, 0);
      let vectorB = new Vector2D(1, 0);
      (vectorA.equals(vectorB)).should.be.false;
    });

    it('should return false if the y-components are not equal', () => {
      let vectorA = new Vector2D(0, 0);
      let vectorB = new Vector2D(0, 1);
      (vectorA.equals(vectorB)).should.be.false;
    });
  });

  /** @test {Vector2D#add} **/
  describe('#add(vec)', () => {
    it('should add the x- and y-components', () => {
      let vectorA = new Vector2D(0, 0);
      let vectorB = new Vector2D(1, 1);
      let vectorAB = vectorA.add(vectorB);
      (vectorAB.x).should.be.equal(1);
      (vectorAB.y).should.be.equal(1);
    });

    it('should work with negative x- and y- components', () => {
      let vectorA = new Vector2D(0, 0);
      let vectorB = new Vector2D(-1, -1);
      let vectorAB = vectorA.add(vectorB);
      (vectorAB.x).should.be.equal(-1);
      (vectorAB.y).should.be.equal(-1);
    });

    it('should not modify original vectors', () => {
      let vectorA = new Vector2D(1, 1);
      let vectorB = new Vector2D(1, 1);
      vectorA.add(vectorB);
      (vectorA.x).should.be.equal(1);
      (vectorA.y).should.be.equal(1);
      (vectorB.x).should.be.equal(1);
      (vectorB.y).should.be.equal(1);
    });
  });

  /** @test {Vector2D#sub} **/
  describe('#sub(vec)', () => {
    it('should add the x- and y-components', () => {
      let vectorA = new Vector2D(0, 0);
      let vectorB = new Vector2D(1, 1);
      let vectorAB = vectorA.sub(vectorB);
      (vectorAB.x).should.be.equal(-1);
      (vectorAB.y).should.be.equal(-1);
    });

    it('should work with negative x- and y- components', () => {
      let vectorA = new Vector2D(0, 0);
      let vectorB = new Vector2D(-1, -1);
      let vectorAB = vectorA.sub(vectorB);
      (vectorAB.x).should.be.equal(1);
      (vectorAB.y).should.be.equal(1);
    });

    it('should not modify original vectors', () => {
      let vectorA = new Vector2D(1, 1);
      let vectorB = new Vector2D(1, 1);
      vectorA.sub(vectorB);
      (vectorA.x).should.be.equal(1);
      (vectorA.y).should.be.equal(1);
      (vectorB.x).should.be.equal(1);
      (vectorB.y).should.be.equal(1);
    });
  });

  /** @test {Vector2D#dot} **/
  describe('#dot(vec)', () => {
    it('should find the dot product between two vectors', () => {
      let vectorA = new Vector2D(1, 0);
      let vectorB = new Vector2D(1, 1);
      let dotProduct = vectorA.dot(vectorB);
      (dotProduct).should.be.equal(1);
    });

    it('should be zero if the vectors are orthogonal', () => {
      let vectorA = new Vector2D(1, 0);
      let vectorB = new Vector2D(0, 1);
      let dotProduct = vectorA.dot(vectorB);
      (dotProduct).should.be.equal(0);
    });

    it('should be equal to product of magnitudes if the vectors are in the same direction', () => {
      let vectorA = new Vector2D(2, 0);
      let vectorB = new Vector2D(3, 0);
      let dotProduct = vectorA.dot(vectorB);
      (dotProduct).should.be.equal(6);
    });

    it('should be equal to negative product of magnitudes if the vectors are in the opposite direction', () => {
      let vectorA = new Vector2D(2, 0);
      let vectorB = new Vector2D(-3, 0);
      let dotProduct = vectorA.dot(vectorB);
      (dotProduct).should.be.equal(-6);
    });

    it('should not modify original vectors', () => {
      let vectorA = new Vector2D(1, 1);
      let vectorB = new Vector2D(1, 1);
      vectorA.dot(vectorB);
      (vectorA.x).should.be.equal(1);
      (vectorA.y).should.be.equal(1);
      (vectorB.x).should.be.equal(1);
      (vectorB.y).should.be.equal(1);
    });
  });

  /** @test {Vector2D#cross} **/
  describe('#cross(vec)', () => {
    it('should return the "cross product" of the two vectors', () => {
      let vectorA = new Vector2D(1, 0);
      let vectorB = new Vector2D(0, 1);
      let crossProduct = vectorA.cross(vectorB);
      (crossProduct).should.be.equal(1);
    });

    it('should return zero if the vectors are parallel', () => {
      let vectorA = new Vector2D(1, 0);
      let vectorB = new Vector2D(-2, 0);
      let crossProduct = vectorA.cross(vectorB);
      (crossProduct).should.be.equal(0);
    });

    it('should return zero if the vectors have zero length', () => {
      let vectorA = new Vector2D(0, 0);
      let vectorB = new Vector2D(0, 0);
      let crossProduct = vectorA.cross(vectorB);
      (crossProduct).should.be.equal(0);
    });

    it('should not modify original vectors', () => {
      let vectorA = new Vector2D(1, 1);
      let vectorB = new Vector2D(1, 1);
      vectorA.cross(vectorB);
      (vectorA.x).should.be.equal(1);
      (vectorA.y).should.be.equal(1);
      (vectorB.x).should.be.equal(1);
      (vectorB.y).should.be.equal(1);
    });
  });

  /** @test {Vector2D#scale} **/
  describe('#scale(n)', () => {
    it('should scale vector by the number', () => {
      let vector = new Vector2D(1, 1);
      let scaledVector = vector.scale(2);
      (scaledVector.x).should.be.equal(2);
      (scaledVector.y).should.be.equal(2);
    });

    it('should scale vector by fractions', () => {
      let vector = new Vector2D(1, 1);
      let scaledVector = vector.scale(0.5);
      (scaledVector.x).should.be.equal(0.5);
      (scaledVector.y).should.be.equal(0.5);
    });

    it('should scale vector by negative numbers', () => {
      let vector = new Vector2D(1, 1);
      let scaledVector = vector.scale(-1);
      (scaledVector.x).should.be.equal(-1);
      (scaledVector.y).should.be.equal(-1);
    });

    it('should not modify original vector', () => {
      let vector = new Vector2D(1, 1);
      vector.scale(2);
      (vector.x).should.be.equal(1);
      (vector.y).should.be.equal(1);
    });
  });

  /** @test {Vector2D#rotateDegrees} **/
  describe('#rotateDegrees(deg)', () => {
    it('should rotate vector by the given number of degrees', () => {
      let vector = new Vector2D(Math.sqrt(2), 0);
      let rotatedVector = vector.rotateDegrees(45);
      (rotatedVector.x).should.be.within(1 - Vector2D.EPSILON, 1 + Vector2D.EPSILON);
      (rotatedVector.y).should.be.within(1 - Vector2D.EPSILON, 1 + Vector2D.EPSILON);
    });

    it('should not modify original vector', () => {
      let vector = new Vector2D(1, 1);
      vector.rotateDegrees(45);
      (vector.x).should.be.equal(1);
      (vector.y).should.be.equal(1);
    });
  });

  /** @test {Vector2D#rotateRadians} **/
  describe('#rotateRadians(rad)', () => {
    it('should rotate vector by the given number of radians', () => {
      let vector = new Vector2D(1, 1);
      let rotatedVector = vector.rotateRadians(Math.PI);
      (rotatedVector.x).should.be.within(-1 - Vector2D.EPSILON, -1 + Vector2D.EPSILON);
      (rotatedVector.y).should.be.within(-1 - Vector2D.EPSILON, -1 + Vector2D.EPSILON);
    });

    it('should not modify original vector', () => {
      let vector = new Vector2D(1, 1);
      vector.rotateRadians(45);
      (vector.x).should.be.equal(1);
      (vector.y).should.be.equal(1);
    });
  });

  /** @test {Vector2D#degreesTo} **/
  describe('#degreesTo(vec)', () => {
    it('should return the degrees between the vectors', () => {
      let vectorA = new Vector2D(1, 0);
      let vectorB = new Vector2D(0, 1);
      let angle = vectorA.degreesTo(vectorB);
      (angle).should.be.equal(90);
    });

    it('should not return a negative value', () => {
      let vectorA = new Vector2D(1, 0);
      let vectorB = new Vector2D(0, -1);
      let angle = vectorA.degreesTo(vectorB);
      (angle).should.be.equal(270);
    });

    it('should handle floating point precision errors', () => {
      let vectorA = new Vector2D(1, 0);
      let vectorB = new Vector2D(0.17364817766, 0.9848077530);
      let angle = vectorA.degreesTo(vectorB);
      (angle).should.be.equal(80);
    });

    it('should return zero if vectors are in same direction', () => {
      let vectorA = new Vector2D(1, 0);
      let vectorB = new Vector2D(2, 0);
      let angle = vectorA.degreesTo(vectorB);
      (angle).should.be.equal(0);
    });
  });

  /** @test {Vector2D#projectOnto} **/
  describe('#projectOnto(vec)', () => {
    it('should return a projection of the current vector onto the given vector', () => {
      let vectorA = new Vector2D(1, 1);
      let vectorB = new Vector2D(1, 0);
      let projection = vectorA.projectOnto(vectorB);
      (projection.x).should.be.equal(1);
      (projection.y).should.be.equal(0);
    });

    it('should not modify original vectors', () => {
      let vectorA = new Vector2D(1, 1);
      let vectorB = new Vector2D(1, 0);
      vectorA.projectOnto(vectorB);
      (vectorA.x).should.be.equal(1);
      (vectorA.y).should.be.equal(1);
      (vectorB.x).should.be.equal(1);
      (vectorB.y).should.be.equal(0);
    });
  });
});
