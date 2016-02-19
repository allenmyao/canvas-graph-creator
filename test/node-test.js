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
    describe('#containsPoint', () => {
        var tempNode = new Node(1,2);
       it('should contain', () => {
            tempNode.containsPoint(10,10).should.be.true;
       });
       it('should not contain', () => {
            tempNode.containsPoint(300,200).should.be.false;
       });
    })
});
