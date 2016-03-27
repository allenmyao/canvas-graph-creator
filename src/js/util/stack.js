export default class Stack {

  constructor() {
    this.stack = [];
  }

  // Getter for size, allows access as a property
  get size() {
    return this.stack.length;
  }

  clear() {
    this.stack = [];
  }

  push(item) {
    if (typeof item === 'undefined' || item === null) {
      throw Error('Item must be defined and non-null');
    }
    this.stack.push(item);
  }

  pop() {
    if (this.stack.length === 0) {
      return null;
    }

    return this.stack.pop();
  }

  peek() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  has(item) {
    if (typeof item === 'undefined' || item === null) {
      throw Error('Item must be defined and non-null');
    }
    for (let i = 0; i < this.stack.length; i++) {
      if (this.stack[i] === item) {
        return true;
      }
    }
    return false;
  }

}
