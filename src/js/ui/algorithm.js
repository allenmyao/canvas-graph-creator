import Stepper from '../algorithm/stepper';
import * as Sidebar from '../ui/sidebar';

let stepper = new Stepper();
let graph = null;
let inputs;
let curAlgorithm;

export function init(g) {
  graph = g;
}

export function selectObject(obj) {
  let sidebarContent = Sidebar.getContent();
  let currentInput = sidebarContent.getCurrentInput();

  if (currentInput && inputs && inputs[currentInput].test(obj)) {
    sidebarContent.updateInput(currentInput, obj);
  }
}

export function setAlgorithm(AlgorithmClass) {
  curAlgorithm = new AlgorithmClass(graph);
  inputs = curAlgorithm.inputs;

  stepper.reset();

  let sidebarContent = Sidebar.getContent();
  sidebarContent.updateAlgorithm(curAlgorithm);
}

export function getAlgorithmInputs() {
  return inputs;
}

export function setInputValues(inputData) {
  for (let name of Object.keys(inputData)) {
    if (name in inputs) {
      let value = inputData[name];
      curAlgorithm[name] = value;
    }
  }
}

export function run() {
    let hasNextStep = true;
    while (hasNextStep) {
      hasNextStep = curAlgorithm.step();
    }
  console.log(curAlgorithm.getResult());
  stepper.setResult(curAlgorithm.getResult());
}

export function play() {
  if (stepper.result === null) {
    return;
  }
  stepper.play();
}

export function pause() {
  stepper.pause();
}

export function viewNext() {
  stepper.stepForward();
}

export function viewPrevious() {
  stepper.stepBackward();
}
