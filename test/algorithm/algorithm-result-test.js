import chai from 'chai';
chai.should();

import AlgorithmResult from '../../src/js/algorithm/algorithm-result';
import Step from '../../src/js/algorithm/step';

/** @test {AlgorithmResult} **/
describe('AlgorithmResult', () => {
  /** @test {AlgorithmResult#constructor} **/
  describe('#constructor()', () => {
    it('should be instance of AlgorithmResult', () => {
      let algorithmResult = new AlgorithmResult();
      algorithmResult.should.be.instanceof(AlgorithmResult);
    });

    it('should start with a step index of -1', () => {
      let algorithmResult = new AlgorithmResult();
      (algorithmResult.stepIndex).should.be.equal(-1);
    });
  });

  /** @test {AlgorithmResult#stepForward} **/
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

  /** @test {AlgorithmResult#stepBackward} **/
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

  /** @test {AlgorithmResult#addStep} **/
  describe('#addStep(step)', () => {
    it('should add the step to timeline', () => {
      let algorithmResult = new AlgorithmResult();
      let step = new Step('');
      algorithmResult.addStep(step);
      let timeline = algorithmResult.timeline;

      (timeline[timeline.length - 1]).should.be.equal(step);
    });
  });
});
