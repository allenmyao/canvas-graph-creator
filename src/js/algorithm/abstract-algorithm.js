// import Queue from '../util/queue';
// import Stack from '../util/stack';
// import { Node } from '../data/node/node';
// import { Edge } from '../data/edge/edge';

/**
 * Abstract class for algorithms.
 * @class AbstractAlgorithm
 */
class AbstractAlgorithm {

  /**
   * Name of the algorithm.
   * @type {string}
   */
  name;
  /**
   * Reference to the graph the algorithm is running on.
   * @type {Graph}
   */
  graph;

  /**
   * Data structure that determines order of traversal.
   * @type {Stack|Queue}
   */
  next;

  /**
   * Map that stores algorithm values.
   * @type {WeakMap}
   */
  graphState = new WeakMap();

  /**
   * Whether the algorithm is complete or not.
   * @type {boolean}
   */
  isComplete = false;

  /**
   * Whether the algorithm has started or not.
   * @type {boolean}
   */
  hasStarted = false;

  /**
   * @typedef InputType
   * @type {object}
   * @property {string} type - String representing tyoe of input.
   * @property {string} name - Name to be displayed.
   * @property {method} test - Function run to validate input.
   * @property {boolean} required - Whether or not the input is required.
   */

  /**
   * Object that defines the algorithm input types.
   * @type {Object.<string, InputType>}
   */
  inputs = {};

  result;

  nodeFields = [];
  edgeFields = [];

  stepBuilder;

  constructor(graph) {
    this.graph = graph;
  }

  getResult() {
    return this.result;
  }

  // run the next step of the algorithm
  step() {}

}

export { AbstractAlgorithm };
export default AbstractAlgorithm;
