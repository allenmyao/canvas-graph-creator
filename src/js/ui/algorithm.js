import Stepper from '../algorithm/stepper';
import ui from '../ui/ui';

let stepper = new Stepper();
let graph = null;
let inputs;
let curAlgorithm;

export function init(g) {
  graph = g;
}

export function resetGraph(g) {
  graph = g;
  curAlgorithm = null;
  inputs = null;
  stepper = new Stepper();
}

export function selectObject(obj) {
  let sidebarContent = ui.sidebar.content;
  let currentInput = sidebarContent.getCurrentInput();

  if (currentInput && inputs && inputs[currentInput].test(obj)) {
    sidebarContent.updateInput(currentInput, obj);
  }
}

export function setAlgorithm(AlgorithmClass) {
  curAlgorithm = new AlgorithmClass(graph);
  inputs = curAlgorithm.inputs;

  stepper.reset();

  let sidebarContent = ui.sidebar.content;
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
