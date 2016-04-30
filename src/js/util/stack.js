/**
 * Stack containers for simple FILO data structures.
 * @class Stack
 */
class Stack {

  /**
   * Constructs a Stack instance.
   * @constructs Stack
   */
  constructor() {
    this.stack = [];
  }

  /**
   * Getter for size, allows access as a property
   * @return {number} - Size of the stack.
   */
  get size() {
    return this.stack.length;
  }

  /**
   * Clear the stack.
   */
  clear() {
    this.stack = [];
  }

  /**
   * Add item to the top of the stack.
   * @param  {*} item - The item to add.
   * @throws {Error} - Throws error if attempting to add null or undefined.
   */
  push(item) {
    if (typeof item === 'undefined' || item === null) {
      throw Error('Item must be defined and non-null');
    }
    this.stack.push(item);
  }

  /**
   * Get and remove the item at the top of the stack.
   * @return {?*} - Item at the top of the stack, or null if the stack is empty.
   */
  pop() {
    if (this.stack.length === 0) {
      return null;
    }

    return this.stack.pop();
  }

  /**
   * Get the item at the top of the stack.
   * @return {?*} - Item at the top of the stack, or null if the stack is empty.
   */
  peek() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  /**
   * Check if the stack contains the specified item.
   * @param  {*}  item - Item to check.
   * @return {boolean} - Whether or not the item is in the stack.
   * @throws {Error} - Throws an error if checking null or undefined.
   */
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

  /**
   * Helper function to loop through all items in the stack.
   * @param  {function(item: *): boolean} callback - Callback function called for each item in the stack. If the return value is false, the remaining items are skipped.
   */
  forEach(callback) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (callback(this.stack[i]) === false) {
        break;
      }
    }
  }

}

export { Stack };
export default Stack;
