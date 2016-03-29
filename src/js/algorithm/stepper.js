// NOTES:  make this responsible for GUI elements as well, move to UI folder?  should draw knowing little to nothing about container, difficult to not make assumptions though
// how does timekeeping work in javascript?
import * as AlgorithmInterface from 'ui/algorithm';

export default class Stepper {

  algorithm;
  speed = 1000;
  interval;
  isComplete = false;

  constructor() {
  }

  getAlgorithm() {
    return this.algorithm;
  }

  reset() {
    this.pause();
    this.isComplete = false;
    this.algorithm = null;
  }

  setAlgorithm(algorithm) {
    this.reset();
    this.algorithm = algorithm;
  }

  stepBack() {
    this.algorithm.previous();
  }

  stepForward() {
    this.algorithm.next();
  }

  pause() {
    clearInterval(this.interval);
  }

  play() {
    let hasNext = true;

    this.interval = setInterval(() => {
      if (!this.algorithm.isComplete) {
        try {
          hasNext = this.algorithm.next();
          AlgorithmInterface.updateAlgorithm(this.algorithm);
        } catch (e) {
          this.pause();
          throw e;
        }
        if (!hasNext) {
          this.pause();
        }
      } else {
        this.pause();
      }
    }, this.speed);
  }

  setSpeed(speed) {
    this.speed = speed;
  }

}
