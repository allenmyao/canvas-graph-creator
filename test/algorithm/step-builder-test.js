import chai from 'chai';
let should = chai.should();

import StepBuilder from '../../src/js/algorithm/step-builder';
import AlgorithmResult from '../../src/js/algorithm/algorithm-result';
import Step from '../../src/js/algorithm/step';
import Node from '../../src/js/data/node/circle-node';
import Edge from '../../src/js/data/edge/solid-edge';

/** @test {StepBuilder} **/
describe('StepBuilder', () => {
  /** @test {StepBuilder#constructor} **/
  describe('#constructor()', () => {
    it('should be instance of StepBuilder', () => {
      let stepBuilder = new StepBuilder();
      stepBuilder.should.be.instanceof(StepBuilder);
    });
  });

  /** @test {StepBuilder#newStep} **/
  describe('#newStep', () => {
    it('should create a new Step object in the "step" field', () => {
      let stepBuilder = new StepBuilder();
      stepBuilder.newStep();
      (stepBuilder.step).should.be.instanceof(Step);
      (stepBuilder.step.changes.size).should.be.equal(0);
    });

    it('should store parameter as step description', () => {
      let stepBuilder = new StepBuilder();
      let description = 'test';
      stepBuilder.newStep(description);
      (stepBuilder.step.description).should.be.equal(description);
    });
  });

  /** @test {StepBuilder#addChange} **/
  describe('#addChange', () => {
    it('should throw error if no Step has been created yet', () => {
      let stepBuilder = new StepBuilder();
      (() => {
        stepBuilder.addChange(null, {}, {}, {});
      }).should.throw(Error);
    });

    it('should add change with nodeFields if given a Node', () => {
      let stepBuilder = new StepBuilder([ 'x' ], [], null);
      let node = new Node(0, 0);
      stepBuilder.step = new Step();
      stepBuilder.addChange(node, { x: 1 }, { x: 2 }, { x: 3 });
      for (let change of stepBuilder.step.changes) {
        (change.preStepValues.x).should.be.equal(1);
        (change.duringStepValues.x).should.be.equal(2);
        (change.postStepValues.x).should.be.equal(3);
      }
    });

    it('should add change with edgeFields if given an Edge', () => {
      let stepBuilder = new StepBuilder([], [ 'color' ], null);
      let edge = new Edge(new Node(0, 0), new Node(100, 0));
      stepBuilder.step = new Step();
      stepBuilder.addChange(edge, { color: '#ff0000' }, { color: '#00ff00' }, { color: '#0000ff' });
      for (let change of stepBuilder.step.changes) {
        (change.preStepValues.color).should.be.equal('#ff0000');
        (change.duringStepValues.color).should.be.equal('#00ff00');
        (change.postStepValues.color).should.be.equal('#0000ff');
      }
    });

    it('should throw error if object is not a Node or Edge', () => {
      let stepBuilder = new StepBuilder([], [], null);
      stepBuilder.step = new Step();
      (() => {
        stepBuilder.addChange(null, {}, {}, {});
      }).should.throw(Error);
    });
  });

  /** @test {StepBuilder#completeStep} **/
  describe('#completeStep', () => {
    it('should add the step to the algorithm results', () => {
      let algorithmResult = new AlgorithmResult();
      let stepBuilder = new StepBuilder([], [], algorithmResult);
      let step = new Step('test');
      stepBuilder.step = step;
      stepBuilder.completeStep();
      (algorithmResult.timeline[0]).should.be.equal(step);
    });

    it('should set the "step" field to null', () => {
      let algorithmResult = new AlgorithmResult();
      let stepBuilder = new StepBuilder([], [], algorithmResult);
      stepBuilder.step = new Step('test');
      stepBuilder.completeStep();
      should.not.exist(stepBuilder.step);
    });
  });
});
