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
       it('should contain this point', () => {
            tempNode.containsPoint(10,10).should.be.true;
       });
       it('should not contain this point', () => {
            tempNode.containsPoint(300,200).should.be.false;
       });
    })

    describe('#distanceToPoint', () => {
        var tempNode = new Node(1,2);
       it('simple distance calculation', () => {
            tempNode.distanceToPoint(3,2).should.equal(2)
       });
       it('simple distance calculation 2', () => {
            tempNode.distanceToPoint(3,5).should.equal(Math.sqrt(4+9))
       });
       it('negative point test', () => {
            tempNode.distanceToPoint(-1,2).should.equal(2)
       });
    })

    describe('#edgePointInDirection', () => {
        var tempNode = new Node(1,0);
       it('simple point check', () => {
            tempNode.edgePointInDirection(50,0)["x"].should.equal(31)
            tempNode.edgePointInDirection(50,0)["y"].should.equal(0)
       });
    })
});
