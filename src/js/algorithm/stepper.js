export default class Stepper {

  result = null;
  speed = 500;
  MAX_INTERVAL = 900;
  MIN_INTERVAL = 100;
  interval = null;

  constructor() {
  }

  getAlgorithm() {
    return this.algorithm;
  }

  speedUp() {
    if (this.speed !== this.MIN_INTERVAL) {
      this.speed = this.speed - 200;
    }
  }

  slowDown() {
    if (this.speed !== this.MAX_INVERVAL) {
      this.speed = this.speed + 200;
    }
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
