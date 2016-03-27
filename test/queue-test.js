/* eslint no-unused-expressions: 0 */

import chai from 'chai';
let should = chai.should();

import Queue from '../src/js/util/queue';

describe('Queue', () => {
  describe('#constructor', () => {
    it('creates instance of Queue', () => {
      (new Queue()).should.be.instanceof(Queue);
    });
  });

  describe('#size', () => {
    it('should be 0 for empty queue', () => {
      let queue = new Queue();
      (queue.size).should.be.equal(0);
    });

    it('should increment for each enqueue', () => {
      let queue = new Queue();
      queue.enqueue('test');
      (queue.size).should.be.equal(1);
      queue.enqueue('test');
      (queue.size).should.be.equal(2);
    });

    it('should decrement for each dequeue', () => {
      let queue = new Queue();
      queue.enqueue('test');
      queue.enqueue('test');
      queue.dequeue();
      (queue.size).should.be.equal(1);
    });
  });

  describe('#clear', () => {
    it('should clear the queue', () => {
      let queue = new Queue();
      queue.enqueue('test');
      queue.clear();
      (queue.size).should.be.equal(0);
    });
  });

  describe('#enqueue', () => {
    it('should add item to queue', () => {
      let queue = new Queue();
      let item = Math.random();
      queue.enqueue(item);
      (queue.dequeue()).should.be.equal(item);
    });

    it('should add item to back of queue', () => {
      let queue = new Queue();
      let item1 = Math.random();
      let item2 = Math.random();
      queue.enqueue(item1);
      queue.enqueue(item2);
      (queue.dequeue()).should.be.equal(item1);
      (queue.dequeue()).should.be.equal(item2);
    });

    it('should throw error when adding null', () => {
      let queue = new Queue();
      (function () {
        queue.enqueue(null);
      }).should.throw(Error);
    });

    it('should throw error when adding undefined', () => {
      let queue = new Queue();
      (function () {
        queue.enqueue();
      }).should.throw(Error);
    });
  });

  describe('#dequeue', () => {
    it('should return null for empty queue', () => {
      let queue = new Queue();
      should.not.exist(queue.dequeue());
    });

    it('should return the first item in queue', () => {
      let queue = new Queue();
      let item1 = Math.random();
      let item2 = Math.random();
      queue.enqueue(item1);
      queue.enqueue(item2);
      (queue.dequeue()).should.be.equal(item1);
    });

    it('should remove the first item in queue', () => {
      let queue = new Queue();
      let item1 = Math.random();
      let item2 = Math.random();
      queue.enqueue(item1);
      queue.enqueue(item2);
      queue.dequeue();
      (queue.size).should.be.equal(1);
    });

    it('should handle offset when more than half empty', () => {
      let queue = new Queue();
      let item1 = Math.random();
      let item2 = Math.random();
      let item3 = Math.random();
      queue.enqueue(item1);
      queue.enqueue(item2);
      queue.enqueue(item3);
      queue.dequeue();
      queue.dequeue();
      (queue.offset).should.equal(0);
    });
  });

  describe('#peek', () => {
    it('should return null for empty queue', () => {
      let queue = new Queue();
      should.not.exist(queue.peek());
    });

    it('should return the first item in queue', () => {
      let queue = new Queue();
      let item1 = Math.random();
      let item2 = Math.random();
      queue.enqueue(item1);
      queue.enqueue(item2);
      (queue.peek()).should.be.equal(item1);
    });

    it('should not remove item from queue', () => {
      let queue = new Queue();
      let item1 = Math.random();
      let item2 = Math.random();
      queue.enqueue(item1);
      queue.enqueue(item2);
      queue.peek();
      (queue.size).should.be.equal(2);
    });
  });

  describe('#has', () => {
    it('should throw error when checking null', () => {
      let queue = new Queue();
      (function () {
        queue.has(null);
      }).should.throw(Error);
    });

    it('should throw error when checking undefined', () => {
      let queue = new Queue();
      (function () {
        queue.has();
      }).should.throw(Error);
    });

    it('should return true if item is in queue', () => {
      let queue = new Queue();
      queue.enqueue('test');
      (queue.has('test')).should.be.true;
    });

    it('should return false if item is not in queue', () => {
      let queue = new Queue();
      queue.enqueue('test');
      (queue.has('testtest')).should.be.false;
    });
  });
});
