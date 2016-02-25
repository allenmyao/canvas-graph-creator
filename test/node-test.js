import chai from 'chai';
chai.should();

import { CircleNode } from '../src/circle-node';

describe('CircleNode', () => {

    describe('#constructor', () => {
        it('needs two arguments', () => {
            (function () {
                new CircleNode();
            }).should.throw(Error);
            (function () {
                new CircleNode(0);
            }).should.throw(Error);
            new CircleNode(0, 0).should.be.instanceof(CircleNode);
        });
    });

    describe('#containsPoint', () => {
        var tempNode = new CircleNode(1,2);
        it('should contain this point', () => {
            tempNode.containsPoint(10,10).should.be.true;
        });
        it('should not contain this point', () => {
            tempNode.containsPoint(300,200).should.be.false;
        });
    });

    describe('#distanceToPoint', () => {
        var tempNode = new CircleNode(1,2);
        it('should do this distance calculation', () => {
            tempNode.distanceToPoint(3,2).should.equal(2)
        });
        it('should do this simple distance calculation 2', () => {
            tempNode.distanceToPoint(3,5).should.equal(Math.sqrt(4+9))
        });
        it('should do this negative point test', () => {
            tempNode.distanceToPoint(-1,2).should.equal(2)
        });
    });

    describe('#edgePointInDirection', () => {
        var tempNode = new CircleNode(1,0);
        it('should do this simple point check', () => {
            tempNode.edgePointInDirection(50,0)["x"].should.equal(31)
            tempNode.edgePointInDirection(50,0)["y"].should.equal(0)
        });
        it('should account for a point within the radius of the node', () => {
            tempNode.edgePointInDirection(20,0)["x"].should.equal(31)
            tempNode.edgePointInDirection(-1,0)["x"].should.equal(-29)
            tempNode.edgePointInDirection(20,0)["y"].should.equal(0)
        });
        it('should throw error when point is at node origin', () => {
            (function () {
                tempNode.edgePointInDirection(1,0);
            }).should.throw(Error);
        });
    });
});
