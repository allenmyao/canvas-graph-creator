import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';
import Step from '../algorithm/step';
import Change from '../algorithm/change';

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

  constructor(nodeFields, edgeFields, timeline) {
    this.nodeFields = nodeFields;
    this.edgeFields = edgeFields;
    this.timeline = timeline;
  }

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

  completeStep() {
    let step = this.step;
    this.step = null;
    this.timeline.addStep(step);
  }
}

export { StepBuilder };
export default StepBuilder;
