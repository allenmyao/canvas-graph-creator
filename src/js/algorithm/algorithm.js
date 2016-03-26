// Notes:  how can I store graphical state, separate context?

import Queue from '/src/js/util/queue.js';
import '/src/js/util/graphLogic.js';
import '/src/js/util/graphVisuals.js';

export class Abstract {
  constructor(graph, input) {
    // use this queue class for state queue; will get long.  use native js style queues for short queues.  implement in class?
    this.queue = new Queue();
    this.graph = graph;
    this.input = input;
    this.curNode = null;
  }

  nextStep() {}

  backStep() {}

}
