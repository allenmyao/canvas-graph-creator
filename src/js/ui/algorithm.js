import Stepper from '../algorithm/stepper';
import AlgorithmRunner from '../algorithm/algorithm-runner';
import * as Sidebar from '../ui/sidebar';

let stepper = new Stepper();
let graph = null;
let inputs;
let algorithmRunner;

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
  let algorithm = new AlgorithmClass(graph);
  inputs = algorithm.inputs;

  stepper.reset();

  algorithmRunner = new AlgorithmRunner(algorithm);

  let sidebarContent = Sidebar.getContent();
  sidebarContent.updateAlgorithm(algorithm);
}

export function getAlgorithmInputs() {
  return inputs;
}

export function setInputValues(inputData) {
  for (let name of Object.keys(inputData)) {
    if (name in inputs) {
      let value = inputData[name];
      algorithmRunner.algorithm[name] = value;
    }
  }
}

export function run() {
  algorithmRunner.run();
  console.log(algorithmRunner.getResult());
  stepper.setResult(algorithmRunner.getResult());
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
