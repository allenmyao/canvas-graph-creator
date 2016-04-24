/* eslint no-unused-expressions: 0 */

import chai from 'chai';
chai.should();

import AlgorithmResult from '../../src/js/algorithm/algorithm-result';
import Step from '../../src/js/algorithm/step';

describe('AlgorithmResult', () => {
  describe('#constructor()', () => {
    it('should be instance of AlgorithmResult', () => {
      let algorithmResult = new AlgorithmResult();
      algorithmResult.should.be.instanceof(AlgorithmResult);
    });
  });

  describe('#addStep()', () => {
    it('should add the step to timeline', () => {
      let algorithmResult = new AlgorithmResult();
      let step = new Step('');
      algorithmResult.addStep(step);
      let timeline = algorithmResult.timeline;

      (timeline[timeline.length - 1]).should.be.equal(step);
    });
  });

  describe('#stepForward()', () => {
    it('should step forward in the timeline', () => {
      let algorithmResult = new AlgorithmResult();
      let step = new Step('');
      algorithmResult.addStep(step);
      algorithmResult.stepIndex = 0;
      algorithmResult.stepForward();
      (algorithmResult.stepIndex).should.be.equal(1);
    });

    it('should step forward from index before first step', () => {
      let algorithmResult = new AlgorithmResult();
      let step = new Step('');
      algorithmResult.addStep(step);
      algorithmResult.stepForward();
      (algorithmResult.stepIndex).should.be.equal(0);
    });

    it('should not step past the final step', () => {
      let algorithmResult = new AlgorithmResult();
      let step = new Step('');
      algorithmResult.addStep(step);
      algorithmResult.stepIndex = 1;
      algorithmResult.stepForward();
      (algorithmResult.stepIndex).should.be.equal(1);
    });
  });

  describe('#stepBackward()', () => {
    it('should step backward in the timeline', () => {
      let algorithmResult = new AlgorithmResult();
      let step = new Step('');
      algorithmResult.addStep(step);
      algorithmResult.stepIndex = 0;
      algorithmResult.stepBackward();
      (algorithmResult.stepIndex).should.be.equal(-1);
    });

    it('should step back from index past final step', () => {
      let algorithmResult = new AlgorithmResult();
      let step = new Step('');
      algorithmResult.addStep(step);
      algorithmResult.stepIndex = 1;
      algorithmResult.stepBackward();
      (algorithmResult.stepIndex).should.be.equal(0);
    });

    it('should not step past the initial step', () => {
      let algorithmResult = new AlgorithmResult();
      let step = new Step('');
      algorithmResult.addStep(step);
      algorithmResult.stepIndex = -1;
      algorithmResult.stepBackward();
      (algorithmResult.stepIndex).should.be.equal(-1);
    });
  });
});
