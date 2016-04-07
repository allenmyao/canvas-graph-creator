// NOTES:  make this responsible for GUI elements as well, move to UI folder?  should draw knowing little to nothing about container, difficult to not make assumptions though
// how does timekeeping work in javascript?
// import * as AlgorithmInterface from 'ui/algorithm';

export default class Stepper {

  result;
  speed = 500;
  interval;

  constructor() {
  }

  getAlgorithm() {
    return this.algorithm;
  }

  reset() {
    this.pause();
    this.result = null;
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
  }

  play() {
    this.interval = setInterval(() => {
      if (this.result.stepIndex < this.result.timeline.length) {
        try {
          this.stepForward();
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
