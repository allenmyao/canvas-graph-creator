import chai from 'chai';
chai.should();

import { Node } from '../src/node';

describe('Node', () => {
    describe('#constructor', () => {
       it('needs two arguments', () => {
            (function () {
                new Node();
            }).should.throw(Error);
            (function () {
                new Node(0);
            }).should.throw(Error);
            new Node(0, 0).should.be.instanceof(Node);
       });
    })
});
