export default class Stepper {

  result = null;
  speed = 500;
  interval = null;

  constructor() {
  }

  getAlgorithm() {
    return this.algorithm;
  }

  reset() {
    this.pause();
    this.result = null;
  }

  resetGraph() {
    if (this.result === null) {
      return;
    }
    while (this.result.stepIndex !== -1) {
      this.result.stepBackward();
    }
  }

  setResult(result) {
    this.reset();
    this.result = result;
  }

  stepBackward() {
    this.result.stepBackward();
  }


  stepForward() {
    this.result.stepForward();
  }

  pause() {
    clearInterval(this.interval);
    this.interval = null;
  }

  play(callback) {
    this.interval = setInterval(() => {
      if (this.result.stepIndex < this.result.timeline.length) {
        try {
          this.stepForward();
          callback();
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
