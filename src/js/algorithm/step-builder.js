import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import Step from '../algorithm/step';
import Change from '../algorithm/change';

/**
 * Helper class to build Step objects.
 * @class StepBuilder
 */
class StepBuilder {

  /**
   * The step being created;
   * @type {Step}
   */
  step = null;

  /**
   * Array of field names to store for Node objects.
   * @type {Array.<string>}
   */
  nodeFields;

  /**
   * Array of field names to store for Edge objects.
   * @type {Array.<string>}
   */
  edgeFields;

  /**
   * Constructs a StepBuilder.
   * @param  {Array.<string>} nodeFields - Array of names of Node fields that the algorithm has access to.
   * @param  {Array.<string>} edgeFields - Array of names of Edge fields that the algorithm has access to.
   * @param  {AlgorithmResult} algorithmResult - AlgorithmResult object that the step will be stored in.
   * @constructs StepBuilder
   */
  constructor(nodeFields, edgeFields, algorithmResult) {
    this.nodeFields = nodeFields;
    this.edgeFields = edgeFields;
    this.algorithmResult = algorithmResult;
  }

  /**
   * Begin building a new Step object.
   * @param  {string} description - Description of the Step.
   */
  newStep(description) {
    this.step = new Step(description);
  }

  /**
   * Add a Node or Edge and its values to the step.
   * @param {(Node|Edge)} object - Node or Edge object.
   * @param {Object.<string, *>} preValues - Object containing field names and their respective values before the step.
   * @param {Object.<string, *>} duringValues - Object containing field names and their respective values before the step.
   * @param {Object.<string, *>} postValues - Object containing field names and their respective values after the step.
   */
  addChange(object, preValues, duringValues, postValues) {
    if (this.step === null) {
      throw Error('Step not created yet.');
    }
    let fields;
    if (object instanceof Node) {
      fields = this.nodeFields;
    } else if (object instanceof Edge) {
      fields = this.edgeFields;
    }
    let change = new Change(object, fields, preValues, duringValues, postValues);
    this.step.addChange(change);
  }

  /**
   * Called when the step is completed.
   */
  completeStep() {
    let step = this.step;
    this.step = null;
    this.algorithmResult.addStep(step);
  }
}

export { StepBuilder };
export default StepBuilder;
