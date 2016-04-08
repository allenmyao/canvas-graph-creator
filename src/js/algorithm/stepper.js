// NOTES:  make this responsible for GUI elements as well, move to UI folder?  should draw knowing little to nothing about container, difficult to not make assumptions though
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

  updateStepGUI(description, stepNum, stepTotal) {
    let des = document.getElementsByClassName('algorithm-step-des');
    let num = document.getElementsByClassName('algorithm-step-num');

    if (des.length === 1 && num.length === 1) {
      des[0].innerHTML = 'Description:  ' + description;
      num[0].innerHTML = 'Step ' + stepNum + ' of ' + stepTotal;
    }
  }

  stepBackward() {
    this.updateStepGUI(this.result.stepBackward(), this.result.stepIndex, this.result.timeline.length);
  }


  stepForward() {
    this.updateStepGUI(this.result.stepForward(), this.result.stepIndex, this.result.timeline.length);
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
