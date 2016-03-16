import chai from 'chai';
chai.should();

import { Node } from '../src/js/data/node/node';
import { SolidEdge } from '../src/js/data/edge/solid-edge';
import { DashedEdge } from '../src/js/data/edge/dashed-edge';

describe('SolidEdge', () => {
  describe('#constructor', () => {
    it('needs at least two arguments', () => {
      (function () {
        new SolidEdge();
      }).should.throw(Error);
      (function () {
        new SolidEdge(0);
      }).should.throw(Error);
      new SolidEdge(new Node(100, 0), new Node(0, 0)).should.be.instanceof(SolidEdge);
    });
  });
});
