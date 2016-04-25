import Queue from '../util/queue';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import AlgorithmResult from '../algorithm/algorithm-result';
import AbstractAlgorithm from '../algorithm/abstract-algorithm';
import StepBuilder from '../algorithm/step-builder';

class TraversalAlgorithm extends AbstractAlgorithm {

  name = 'Traversal';
  // data structure that determines order of traversal
  next = new Queue();

  // starting point for the algorithm
  source = null;

  inputs = {
    source: null
  };

  inputTypes = [
    {
      type: 'node',
      name: 'source',
      displayName: 'Source',
      test: (node) => {
        return node instanceof Node;
      },
      required: true
    }
  ];

  result;

  // the members of the nodes and edges that the algorithm will edit
  nodeFields = [
    'color'
  ];
  edgeFields = [
    'color'
  ];

  constructor(graph) {
    super(graph);
    this.result = new AlgorithmResult();
    this.stepBuilder = new StepBuilder(this.nodeFields, this.edgeFields, this.result);
  }

  // visit the specified node
  visitNode(node) {
    // mark node as visited
    this.graphState.set(node, true);

    // add adjacent edges to the queue
    let edges = node.edges;
    for (let edge of edges) {
      if (this.hasVisited(edge) || this.next.has(edge)) {
        continue;
      }
      if (edge.isDirected && edge.startNode === node) {
        this.next.enqueue(edge);
      } else if (!edge.isDirected) {
        this.next.enqueue(edge);
      }
    }
  }

  // visit the specified edge
  visitEdge(edge) {
    // mark edge as visited
    this.graphState.set(edge, true);

    // add adjacent node to the queue
    if (!this.hasVisited(edge.destNode) && !this.next.has(edge.destNode)) {
      this.next.enqueue(edge.destNode);
    } else if (!this.hasVisited(edge.startNode) && !edge.isDirected && !this.next.has(edge.startNode)) {
      this.next.enqueue(edge.startNode);
    }
  }

  // check if object has been visited by algorithm
  hasVisited(object) {
    return this.graphState.has(object) && this.graphState.get(object);
  }

  // run the next step of the algorithm
  step() {
    if (this.hasStarted && this.next.size === 0) {
      this.isComplete = true;
      return false;
    }

    let nextItem;

    if (this.hasStarted) {
      nextItem = this.next.dequeue();
    } else {
      this.hasStarted = true;
      nextItem = this.source;
    }

    if (nextItem instanceof Node) {
      this.visitNode(nextItem);
    } else if (nextItem instanceof Edge) {
      this.visitEdge(nextItem);
    } else {
      throw Error('Non-graph object in algorithm queue');
    }
    // represent the visual aspects of this step by creating a new step, adding a change for the current object, and completing the step
    this.stepBuilder.newStep(`Visiting ${nextItem.constructor.name} ${nextItem.id}`);
    this.stepBuilder.addChange(nextItem, {
      color: 'black'
    }, {
      color: 'red'
    }, {
      color: 'green'
    });
    this.stepBuilder.completeStep();

    return true;
  }

  reset() {
    this.next.clear();
    this.isComplete = false;
    this.hasStarted = false;
    this.graphState = new WeakMap();
    this.result = new AlgorithmResult();
    this.stepBuilder = new StepBuilder(this.nodeFields, this.edgeFields, this.result);
  }

}

export { TraversalAlgorithm };
export default TraversalAlgorithm;
