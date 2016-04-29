import chai from 'chai';
chai.should();

import AbstractAlgorithm from '../../src/js/algorithm/abstract-algorithm';
import Graph from '../../src/js/data/graph';

/** @test {AbstractAlgorithm} **/
describe('AbstractAlgorithm', () => {
  /** @test {AbstractAlgorithm#constructor} **/
  describe('#constructor()', () => {
    it('should be instance of AbstractAlgorithm', () => {
      let algorithm = new AbstractAlgorithm();
      (algorithm).should.be.instanceof(AbstractAlgorithm);
    });

    it('should store parameter in "graph" field', () => {
      let graph = new Graph();
      let algorithm = new AbstractAlgorithm(graph);
      (algorithm.graph).should.be.equal(graph);
    });
  });

  /** @test {AlgorithmResult#step} **/
  describe('#step()', () => {
    it('should return false', () => {
      let algorithm = new AbstractAlgorithm();
      (algorithm.step()).should.be.false;
    });
  });
});
