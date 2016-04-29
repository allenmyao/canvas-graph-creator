/**
 * Abstract class for algorithms.
 * @class AbstractAlgorithm
 */
class AbstractAlgorithm {

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
   * Object that holds the algorithm input values. Used by the UI classes to view and store values.
   * @type {Object.<string, *>}
   */
  inputs = {};

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
  inputTypes = {};

  /**
   * AlgorithmResult object where the results will be stored.
   * @type {AlgorithmResult}
   */
  result;

  /**
   * Array of names of Node fields that the algorithm has access to.
   * @type {Array.<string>}
   */
  nodeFields = [];

  /**
   * Array of names of Edge fields that the algorithm has access to.
   * @type {Array.<string>}
   */
  edgeFields = [];

  /**
   * StepBuilder object that is used to create Step objects.
   * @type {StepBuilder}
   */
  stepBuilder;

  /**
   * Constructor for the abstract algorithm class. Should not be called directly.
   * @param  {Graph} graph - Graph that the algorithm is run on.
   * @constructs AbstractAlgorithm
   */
  constructor(graph) {
    this.graph = graph;
  }

  /**
   * Run the next step of the algorithm.
   * @return {boolean} - Whether or not the algorithm has a next step.
   */
  step() {
    return false;
  }

}

export { AbstractAlgorithm };
export default AbstractAlgorithm;
