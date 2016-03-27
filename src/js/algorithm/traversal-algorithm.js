import Queue from '/src/js/util/queue';
import Node from '/src/js/data/node/node';
import Edge from '/src/js/data/edge/edge';

export class TraversalAlgorithm {

  // starting point for the algorithm
  source = null;
  // history of changes to the graphState
  history = [];
  // current object
  current = null;
  // data structure that determines order of traversal (queue or stack)
  queue = new Queue();
  // updates and temporary values/counters, maybe using es6 Map class and map between nodes/edges and values
  graphState = new WeakMap();
  // completion flag
  isComplete = false;

  constructor(graph) {
    this.graph = graph;
  }

  setSource(source) {
    this.source = source;
  }

  // visit the specified node
  visitNode(node) {
    // mark node as visited
    this.graphState.put(node, true);

    // add adjacent edges to the queue
    let edges = node.edges;
    for (let edge of edges) {
      if (this.hasVisited(edge)) {
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
    this.graphState.put(edge, true);

    // add adjacent node to the queue
    if (!this.hasVisited(edge.destNode)) {
      this.queue.enqueue(edge.destNode);
    } else if (!this.hasVisited(edge.srcNode) && !edge.isDirected) {
      this.queue.enqueue(edge.srcNode);
    }
  }

  // check if object has been visited by algorithm
  hasVisited(object) {
    return this.graphState.has(object);
  }

  // undo visit of the specified node
  unVisitNode(node) {}
  // undo visit of the specified edge
  unVisitEdge(edge) {}

  // run the next step of the algorithm
  next() {
    if (this.queue.isEmpty()) {
      console.log('Traversal has finished');
      this.isComplete = true;
      return false;
    }

    let nextItem = this.queue.peek();
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

  }

}
