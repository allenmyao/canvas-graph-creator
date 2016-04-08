/**
 * Represents a step of an algorithm.
 * @class Step
 */
class Step {
  /**
   * String describing the Step.
   * @type {string}
   */
  description;

  /**
   * Set of changes in this step.
   * @type {Set}
   */
  changes = new Set();

  /**
   * Constructs a Step.  Ensures description is not null or the empty string
   * @param  {string} description - A string describing the step of the algorithm.
   * @constructs Step
   */
  constructor(description) {
    this.description = description;
    if (!this.description) {
      this.description = ' ';
    }
  }

  /**
   * Add a change in values for an object to this Step.
   * @param {Change} change - Change object to add.
   */
  addChange(change) {
    this.changes.add(change);
  }

  /**
   * Apply all pre-step values to objects.
   */
  applyPre() {
    for (let change of this.changes) {
      change.applyPre();
    }
  }

  /**
   * Applies all step values to objects.
   */
  applyDuring() {
    for (let change of this.changes) {
      change.applyDuring();
    }
  }

  /**
   * Applies all post-step values to objects.
   */
  applyPost() {
    for (let change of this.changes) {
      change.applyPost();
    }
  }
}

export { Step };
export default Step;
