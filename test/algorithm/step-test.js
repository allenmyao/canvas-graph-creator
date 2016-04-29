import chai from 'chai';
chai.should();

import Step from '../../src/js/algorithm/step';
import Change from '../../src/js/algorithm/change';
import Node from '../../src/js/data/node/circle-node';

/** @test {Step} **/
describe('Step', () => {
  /** @test {Step#constructor} **/
  describe('#constructor()', () => {
    it('should be instance of Step', () => {
      let step = new Step();
      (step).should.be.instanceof(Step);
    });

    it('should store the parameter in "description" field', () => {
      let description = 'test';
      let step = new Step(description);
      (step.description).should.be.equal(description);
    });

    it('should have default description', () => {
      let step = new Step();
      (step.description).should.be.a('string');
    });
  });

  /** @test {Step#addChange} **/
  describe('#addChange()', () => {
    it('should add change object to "changes" field', () => {
      let change = new Change(null, []);
      let step = new Step();
      step.addChange(change);
      (step.changes.has(change)).should.be.true;
    });
  });

  /** @test {Step#applyPre} **/
  describe('#applyPre', () => {
    it('should apply the "pre" step values for all change objects', () => {
      let node = new Node(0, 0);
      let change = new Change(node, [ 'x' ], { x: 1 }, { x: 2 }, { x: 3 });
      let step = new Step();
      step.addChange(change);
      step.applyPre();
      (node.x).should.be.equal(1);
    });
  });

  /** @test {Step#applyDuring} **/
  describe('#applyDuring', () => {
    it('should apply the "during" step values for all change objects', () => {
      let node = new Node(0, 0);
      let change = new Change(node, [ 'x' ], { x: 1 }, { x: 2 }, { x: 3 });
      let step = new Step();
      step.addChange(change);
      step.applyDuring();
      (node.x).should.be.equal(2);
    });
  });

  /** @test {Step#applyPost} **/
  describe('#applyPost', () => {
    it('should apply the "post" step values for all change objects', () => {
      let node = new Node(0, 0);
      let change = new Change(node, [ 'x' ], { x: 1 }, { x: 2 }, { x: 3 });
      let step = new Step();
      step.addChange(change);
      step.applyPost();
      (node.x).should.be.equal(3);
    });
  });
});
