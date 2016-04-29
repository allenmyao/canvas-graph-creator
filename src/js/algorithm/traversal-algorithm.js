import Queue from '../util/queue';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import AlgorithmResult from '../algorithm/algorithm-result';
import AbstractAlgorithm from '../algorithm/abstract-algorithm';
import StepBuilder from '../algorithm/step-builder';

/**
 * Class that contains code for running a traversal algorithm.
 * @class TraversalAlgorithm
 */
class TraversalAlgorithm extends AbstractAlgorithm {

  /**
   * Data structure that determines order of traversal.
   * @type {Queue}
   */
  next = new Queue();

  /**
   * Source node of the algorithm.
   * @type {[type]}
   */
  source = null;

  /**
   * Object that holds the algorithm input values. Used by the UI classes to view and store values.
   * @type {Object.<string, *>}
   */
  inputs = {
    source: null
  };

  /**
   * @typedef InputType
   * @type {object}
   * @property {string} type - String representing tyoe of input.
   * @property {string} name - Name of the field.
   * @property {string} displayName - Name to be displayed.
   * @property {method} test - Function run to validate input.
   * @property {boolean} required - Whether or not the input is required.
   */

  /**
   * Object that defines the algorithm input types.
   * @type {Object.<string, InputType>}
   */
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

  /**
   * Array of field names to store for Node objects.
   * @type {Array.<string>}
   */
  nodeFields = [
    'color'
  ];

  /**
   * Array of field names to store for Edge objects.
   * @type {Array.<string>}
   */
  edgeFields = [
    'color'
  ];

  /**
   * Constructor for TraversalAlgorithm.
   * @param  {Graph} graph - The graph that the algorithm will be run on.
   * @constructs TraversalAlgorithm
   */
  constructor(graph) {
    super(graph);
    this.result = new AlgorithmResult();
    this.stepBuilder = new StepBuilder(this.nodeFields, this.edgeFields, this.result);
  }

  /**
   * Visit the specified node.
   * @param  {Node} node - The node to be visited.
   */
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

  /**
   * Visit the specified edge.
   * @param  {Edge} edge - The edge to be visited.
   */
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

  /**
   * Check if a node or edge has been visited by the algorithm.
   * @param  {(Node|Edge)}  object - The node/edge to be checked.
   * @return {boolean} - Whether or not the node/edge has been visited.
   */
  hasVisited(object) {
    return this.graphState.has(object) && this.graphState.get(object);
  }

  /**
   * @override
   */
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
    let typeName;
    if (nextItem instanceof Node) {
      typeName = 'node';
    } else if (nextItem instanceof Edge) {
      typeName = 'edge';
    } else {
      typeName = nextItem.constructor.name;
    }
    this.stepBuilder.newStep(`Visiting ${typeName} ${nextItem.id}`);
    this.stepBuilder.addChange(nextItem, {
      color: nextItem.color
    }, {
      color: 'red'
    }, {
      color: 'green'
    });
    this.stepBuilder.completeStep();

    return true;
  }

  /**
   * Reset the algorithm so that it can be run again.
   */
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
