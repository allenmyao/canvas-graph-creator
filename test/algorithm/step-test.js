import chai from 'chai';
chai.should();

import Step from '../../src/js/algorithm/step';

describe('Step', () => {
  describe('#constructor()', () => {
    it('should be instance of Step', () => {
      let step = new Step();
      step.should.be.instanceof(Step);
    });
  });

  describe('#addChange()', () => {

  });

  describe('#applyPre', () => {

  });

  describe('#applyDuring', () => {

  });

  describe('#applyPost', () => {

  });
});
