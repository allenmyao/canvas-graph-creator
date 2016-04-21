import chai from 'chai';
chai.should();

import { CircleNode as Node } from '../src/js/data/node/circle-node';
import { SolidEdge } from '../src/js/data/edge/solid-edge';

describe('SolidEdge', () => {
  describe('#constructor', () => {
    it('should create instance of SolidEdge', () => {
      new SolidEdge(new Node(100, 0), new Node(0, 0)).should.be.instanceof(SolidEdge);
    });
  });
});
