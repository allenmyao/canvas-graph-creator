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
  stepper.setAlgorithm(algorithm);
  inputs = algorithm.inputs;

  algorithmRunner = new AlgorithmRunner(algorithm);

  let sidebarContent = Sidebar.getContent();
  sidebarContent.updateAlgorithm(algorithm);
}

export function getAlgorithmInputs() {
  return inputs;
}

export function setInputs(inputData) {
  for (let name of Object.keys(inputData)) {
    if (name in inputs) {
      let value = inputData[name];
      stepper.getAlgorithm()[name] = value;
    }
  }
}

export function run() {
  console.log('run');
  algorithmRunner.run();
  console.log(algorithmRunner.getResult());
  // stepper.play();
}

export function viewNext() {
  let algorithmResult = algorithmRunner.getResult();
  algorithmResult.stepForward();
}

export function viewPrevious() {
  let algorithmResult = algorithmRunner.getResult();
  algorithmResult.stepBackward();
}
