// NOTES:  make this responsible for GUI elements as well, move to UI folder?  should draw knowing little to nothing about container, difficult to not make assumptions though
// how does timekeeping work in javascript?

export default class Stepper {

  algorithm;
  speed = 100;
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
    console.log('paused');
    clearInterval(this.interval);
  }

  play() {
    let hasNext = true;

    this.interval = setInterval(() => {
      console.log('step');
      if (!this.algorithm.isComplete) {
        try {
          hasNext = this.algorithm.next();
        } catch (e) {
          console.error(e.stack);
          this.pause();
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
