/**
 * Based on Queue.js by Stephen Morley - http://code.stephenmorley.org/
 */

/**
 * Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 * @class Queue
 */
class Queue {

  /**
   * Constructs a Queue instance.
   * @constructs Queue
   */
  constructor() {
    // initialise the queue and offset
    this.queue = [];
    this.offset = 0;
  }

  /**
   * Getter for size, allows access as a property).
   * @return {number} - Size of the queue.
   */
  get size() {
    return this.queue.length - this.offset;
  }

  /**
   * Clear the queue.
   */
  clear() {
    this.queue = [];
    this.offset = 0;
  }

  /**
   * Enqueues the specified item.
   * @param {*} item - the item to enqueue
   */
  enqueue(item) {
    if (typeof item === 'undefined' || item === null) {
      throw Error('Item must be defined and non-null');
    }
    this.queue.push(item);
  }

  /**
   * Dequeues an item and returns it. If the queue is empty, the value null is returned.
   * @return {?*} - The next item in the queue, or null if the queue is empty.
   */
  dequeue() {
    // if the queue is empty, return immediately
    if (this.queue.length === 0) {
      return null;
    }

    // store the item at the front of the queue
    let item = this.queue[this.offset];

    // increment the offset and remove the free space if necessary
    if (++this.offset * 2 >= this.queue.length) {
      this.queue = this.queue.slice(this.offset);
      this.offset = 0;
    }

    // return the dequeued item
    return item;
  }

  /**
   * Returns the item at the front of the queue (without dequeuing it). If the queue is empty then null is returned.
   * @return {?*} - The next item in the queue, or null if the queue is empty.
   */
  peek() {
    return this.queue.length > 0 ? this.queue[this.offset] : null;
  }

  /**
   * Check if the queue contains the specified item.
   * @param  {*}  item - Item to check.
   * @return {boolean} - Whether or not the item is in the queue.
   * @throws {Error} - Throws an error if checking null or undefined.
   */
  has(item) {
    if (typeof item === 'undefined' || item === null) {
      throw Error('Item must be defined and non-null');
    }
    for (let i = this.offset; i < this.queue.length; i++) {
      if (this.queue[i] === item) {
        return true;
      }
    }
    return false;
  }

  /**
   * Helper function to loop through all items in the queue.
   * @param  {function(item: *): boolean} callback - Callback function called for each item in the queue. If the return value is false, the remaining items are skipped.
   */
  forEach(callback) {
    for (let i = this.offset; i < this.queue.length; i++) {
      if (callback(this.queue[i]) === false) {
        break;
      }
    }
  }

}

export { Queue };
export default Queue;
