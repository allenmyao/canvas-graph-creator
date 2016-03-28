import Queue from 'util/queue';
import Stack from 'util/stack';
import { Node } from 'data/node/node';
import { Edge } from 'data/edge/edge';

export default class TraversalAlgorithm {

  name = 'Traversal';

  // starting point for the algorithm
  source = null;
  // history of changes to the graphState
  history = [];
  // current object
  current = null;
  // data structure that determines order of traversal (queue or stack)
  queue = new Queue();
  // data strcuture that stores previously visited items
  stack = new Stack();
  // data structure to handle next() calls after previous()
  nextStack = new Stack();
  // updates and temporary values/counters, maybe using es6 Map class and map between nodes/edges and values
  graphState = new WeakMap();
  // completion flag
  isComplete = false;

  hasStarted = false;

  inputs = {
    source: {
      type: 'node',
      name: 'Source',
      test: (node) => {
        return node instanceof Node;
      },
      required: true
    }
  };

  constructor(graph) {
    this.graph = graph;
  }

  setSource(source) {
    this.source = source;
  }

  // visit the specified node
  visitNode(node) {
    // mark node as visited
    this.graphState.set(node, true);

    // add adjacent edges to the queue
    let edges = node.edges;
    for (let edge of edges) {
      if (this.hasVisited(edge) || this.queue.has(edge)) {
        continue;
      }
      if (edge.isDirected && edge.srcNode === node) {
        this.queue.enqueue(edge);
      } else {
        this.queue.enqueue(edge);
      }
    }
  }

  // visit the specified edge
  visitEdge(edge) {
    // mark edge as visited
    this.graphState.set(edge, true);

    // add adjacent node to the queue
    if (!this.hasVisited(edge.destNode) && !this.queue.has(edge.destNode)) {
      this.queue.enqueue(edge.destNode);
    } else if (!this.hasVisited(edge.srcNode) && !edge.isDirected && !this.queue.has(edge.srcNode)) {
      this.queue.enqueue(edge.srcNode);
    }
  }

  // check if object has been visited by algorithm
  hasVisited(object) {
    return this.graphState.has(object) && this.graphState.get(object);
  }

  // undo visit of the specified node
  unVisitNode(node) {
    this.graphState.set(node, false);
  }
  // undo visit of the specified edge
  unVisitEdge(edge) {
    this.graphState.set(edge, false);
  }

  // run the next step of the algorithm
  next() {
    if (this.hasStarted && this.queue.size === 0) {
      console.log('Traversal has finished');
      this.isComplete = true;
      return false;
    }

    let nextItem;

    if (this.hasStarted) {
      if (this.nextStack.size === 0) {
        nextItem = this.queue.dequeue();
      } else {
        nextItem = this.nextStack.pop();
      }
      this.stack.push(nextItem);
    } else {
      this.hasStarted = true;
      nextItem = this.source;
    }

    console.log(nextItem);

    if (nextItem instanceof Node) {
      this.visitNode(nextItem);
    } else if (nextItem instanceof Edge) {
      this.visitEdge(nextItem);
    } else {
      throw Error('Non-graph object in algorithm queue');
    }
    return true;
  }

  // return to the previous step of the algorithm
  previous() {
    if (this.stack.size === 0) {
      console.log('Reached initial state');
      return false;
    }

    let previousItem = this.stack.pop();
    this.nextStack.push(previousItem);
    if (previousItem instanceof Node) {
      this.unVisitNode(previousItem);
    } else if (previousItem instanceof Edge) {
      this.unVisitEdge(previousItem);
    } else {
      throw Error('Non-graph object in algorithm queue');
    }

    return false;
  }

}
