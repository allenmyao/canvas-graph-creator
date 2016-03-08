import chai from 'chai';
chai.should();

import { Edge } from '../src/data/edge/edge';
import { Node } from '../src/data/node/node';
import { SolidEdge } from '../src/data/edge/solid-edge';
import { DashedEdge } from '../src/data/edge/dashed-edge';

describe('SolidEdge', () => {
    describe('#constructor', () => {
      it('needs at least two arguments', () => {
            (function () {
                new SolidEdge();
            }).should.throw(Error);
            (function () {
                new SolidEdge(0);
            }).should.throw(Error);
            new SolidEdge(new Node(100,0), new Node(0,0)).should.be.instanceof(SolidEdge);
        });
    });
});
