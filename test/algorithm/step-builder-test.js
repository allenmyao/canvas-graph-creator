/* eslint no-unused-expressions: 0 */

import chai from 'chai';
chai.should();

import StepBuilder from '../../src/js/algorithm/step-builder';

describe('StepBuilder', () => {
  describe('#constructor()', () => {
    it('should be instance of StepBuilder', () => {
      let stepBuilder = new StepBuilder();
      stepBuilder.should.be.instanceof(StepBuilder);
    });
  });

  describe('#newStep', () => {

  });

  describe('#addChange', () => {

  });

  describe('#completeStep', () => {

  });
});
