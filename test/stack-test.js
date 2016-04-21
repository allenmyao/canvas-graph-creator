/* eslint no-unused-expressions: 0 */

import chai from 'chai';
let should = chai.should();

import Stack from '../src/js/util/stack';

describe('Stack', () => {
  describe('#constructor', () => {
    it('creates instance of Stack', () => {
      (new Stack()).should.be.instanceof(Stack);
    });
  });

  describe('#size', () => {
    it('should be 0 for empty stack', () => {
      let stack = new Stack();
      (stack.size).should.be.equal(0);
    });

    it('should increment for each push', () => {
      let stack = new Stack();
      stack.push('test');
      (stack.size).should.be.equal(1);
      stack.push('test');
      (stack.size).should.be.equal(2);
    });

    it('should decrement for each pop', () => {
      let stack = new Stack();
      stack.push('test');
      stack.push('test');
      stack.pop();
      (stack.size).should.be.equal(1);
    });
  });

  describe('#clear', () => {
    it('should clear the stack', () => {
      let stack = new Stack();
      stack.push('test');
      stack.clear();
      (stack.size).should.be.equal(0);
    });
  });

  describe('#push', () => {
    it('should add item to stack', () => {
      let stack = new Stack();
      let item = 'test';
      stack.push(item);
      (stack.pop()).should.be.equal(item);
    });

    it('should add item to top of stack', () => {
      let stack = new Stack();
      let item1 = 1;
      let item2 = 2;
      stack.push(item1);
      stack.push(item2);
      (stack.pop()).should.be.equal(item2);
      (stack.pop()).should.be.equal(item1);
    });

    it('should throw error when adding null', () => {
      let stack = new Stack();
      (function () {
        stack.push(null);
      }).should.throw(Error);
    });

    it('should throw error when adding undefined', () => {
      let stack = new Stack();
      (function () {
        stack.push();
      }).should.throw(Error);
    });
  });

  describe('#pop', () => {
    it('should return null for empty stack', () => {
      let stack = new Stack();
      should.not.exist(stack.pop());
    });

    it('should return the item on top of stack', () => {
      let stack = new Stack();
      let item1 = 1;
      let item2 = 2;
      stack.push(item1);
      stack.push(item2);
      (stack.pop()).should.be.equal(item2);
    });

    it('should remove the top item in stack', () => {
      let stack = new Stack();
      let item1 = 1;
      let item2 = 2;
      stack.push(item1);
      stack.push(item2);
      stack.pop();
      (stack.size).should.be.equal(1);
    });
  });

  describe('#peek', () => {
    it('should return null for empty stack', () => {
      let stack = new Stack();
      should.not.exist(stack.peek());
    });

    it('should return the item on top of stack', () => {
      let stack = new Stack();
      let item1 = 1;
      let item2 = 2;
      stack.push(item1);
      stack.push(item2);
      (stack.peek()).should.be.equal(item2);
    });

    it('should not remove item from stack', () => {
      let stack = new Stack();
      let item1 = 1;
      let item2 = 2;
      stack.push(item1);
      stack.push(item2);
      stack.peek();
      (stack.size).should.be.equal(2);
    });
  });

  describe('#has', () => {
    it('should throw error when checking null', () => {
      let stack = new Stack();
      (function () {
        stack.has(null);
      }).should.throw(Error);
    });

    it('should throw error when checking undefined', () => {
      let stack = new Stack();
      (function () {
        stack.has();
      }).should.throw(Error);
    });

    it('should return true if item is in stack', () => {
      let stack = new Stack();
      stack.push('test');
      (stack.has('test')).should.be.true;
    });

    it('should return false if item is not in stack', () => {
      let stack = new Stack();
      stack.push('test');
      (stack.has('testtest')).should.be.false;
    });
  });

  describe('#forEach', () => {
    it('should iterate through all items', () => {
      let stack = new Stack();
      let item1 = 1;
      let item2 = 2;
      let item3 = 3;
      stack.push(item1);
      stack.push(item2);
      stack.push(item3);

      let order = [];
      stack.forEach((item) => {
        order.push(item);
      });

      (order.indexOf(item1)).should.be.at.least(0);
      (order.indexOf(item1)).should.be.at.least(0);
      (order.indexOf(item1)).should.be.at.least(0);
    });

    it('should stop if callback returns false', () => {
      let stack = new Stack();
      let item1 = 1;
      let item2 = 2;
      let item3 = 3;
      stack.push(item1);
      stack.push(item2);
      stack.push(item3);

      let order = [];
      stack.forEach((item) => {
        if (item === item2) {
          return false;
        }
        order.push(item);
        return true;
      });

      (order.length).should.be.equal(1);
    });

    it('should iterate in order starting from the top of the stack', () => {
      let stack = new Stack();
      let item1 = 1;
      let item2 = 2;
      let item3 = 3;
      stack.push(item1);
      stack.push(item2);
      stack.push(item3);

      let order = [];
      stack.forEach((item) => {
        order.push(item);
      });

      (order[0]).should.be.equal(item3);
      (order[1]).should.be.equal(item2);
      (order[2]).should.be.equal(item1);
    });
  });
});
