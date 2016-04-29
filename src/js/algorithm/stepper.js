/**
 * Helper class for stepping through and playing algorithm results.
 * @class Stepper
 */
class Stepper {

  result = null;
  speed = 500;
  MAX_INTERVAL = 900;
  MIN_INTERVAL = 100;
  interval = null;

  speedUp() {
    if (this.speed !== this.MIN_INTERVAL) {
      this.speed = this.speed - 200;
      console.log(this.speed);
      return true;
    }
    return false;
  }

  slowDown() {
    if (this.speed !== this.MAX_INTERVAL) {
      this.speed = this.speed + 200;
      console.log(this.speed);
      return true;
    }
    return false;
  }

  /**
   * Reset the stepper object. Clears the algorithm results.
   */
  reset() {
    this.pause();
    this.result = null;
  }

  /**
   * Reset the state of the graph by undoing all changes made by the algorithm steps.
   */
  resetGraph() {
    if (this.result === null) {
      return;
    }
    while (this.result.stepIndex !== -1) {
      this.result.stepBackward();
    }
  }

  /**
   * Set the specified AlgorithmResult object to the "result" field.
   * @param {AlgorithmResult} result - AlgorithmResult object.
   */
  setResult(result) {
    this.reset();
    this.result = result;
  }

  /**
   * Go to the previous algorithm step.
   */
  stepBackward() {
    this.result.stepBackward();
  }

  /**
   * Go to the next algorithm step.
   */
  stepForward() {
    this.result.stepForward();
  }

  /**
   * Pause the stepper if it is currently playing.
   */
  pause() {
    clearInterval(this.interval);
    this.interval = null;
  }

  /**
   * Play the algorithm results. Steps forward until paused or finished.
   * @param  {Function} callback - Callback function that is called whenever a step is completed.
   */
  play(callback) {
    this.interval = setInterval(() => {
      if (this.result.stepIndex < this.result.timeline.length) {
        try {
          this.stepForward();
          callback();
          clearInterval(this.interval);
          this.play(callback);
        } catch (e) {
          this.pause();
          throw e;
        }
      } else {
        this.pause();
      }
    }, this.speed);
  }

}

export { Stepper };
export default Stepper;
