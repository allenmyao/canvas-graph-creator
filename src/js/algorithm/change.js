/**
 * Represents changes for a Node or Edge during a step of the algorithm.
 * @class Change
 */
class Change {

  /**
   * Object that the Change is storing values for.
   * @type {(Node|Edge)}
   */
  object;

  /**
   * Object containing the values before the step.
   * @type {Object.<string, *>}
   */
  preStepValues;

  /**
   * Object containing the values during the step.
   * @type {Object.<string, *>}
   */
  duringStepValues;

  /**
   * Object containing the values after the step.
   * @type {Object.<string, *>}
   */
  postStepValues;

  /**
   * Constructs a change object.
   * @param  {(Node|Edge)} object - A Node or Edge object.
   * @param  {Array.<string>} fields - Array of field names to be stored.
   * @param {Object.<string, *>} preValues - Object containing field names and their respective values before the step.
   * @param {Object.<string, *>} duringValues - Object containing field names and their respective values before the step.
   * @param {Object.<string, *>} postValues - Object containing field names and their respective values after the step.
   * @constructs Change
   */
  constructor(object, fields, preValues, duringValues, postValues) {
    this.object = object;
    this.preStepValues = {};
    this.duringStepValues = {};
    this.postStepValues = {};

    for (let field of fields) {
      if (field in preValues) {
        this.preStepValues[field] = preValues[field];
      }
      if (field in duringValues) {
        this.duringStepValues[field] = duringValues[field];
      }
      if (field in postValues) {
        this.postStepValues[field] = postValues[field];
      }
    }
  }

  /**
   * Set object values to those it had before the step.
   */
  applyPre() {
    for (let field of Object.keys(this.preStepValues)) {
      this.object[field] = this.preStepValues[field];
    }
  }

  /**
   * Set object values to those it had during the step.
   */
  applyDuring() {
    for (let field of Object.keys(this.duringStepValues)) {
      this.object[field] = this.duringStepValues[field];
    }
  }

  /**
   * Set object values to those it had after the step.
   */
  applyPost() {
    for (let field of Object.keys(this.postStepValues)) {
      this.object[field] = this.postStepValues[field];
    }
  }
}

export { Change };
export default Change;
