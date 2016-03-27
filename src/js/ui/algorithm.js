import Stepper from 'algorithm/stepper';
import * as Sidebar from 'ui/sidebar';

let stepper = new Stepper();
let graph = null;
let input;

export function init(g) {
  graph = g;
}

export function selectObject(obj) {
  let sidebarContent = Sidebar.getContent();
  let currentInput = sidebarContent.getCurrentInput();

  if (currentInput && input[currentInput].test(obj)) {
    sidebarContent.updateInput(currentInput, obj);
  }
}

export function setAlgorithm(AlgorithmClass) {
  let algorithm = new AlgorithmClass(graph);
  stepper.setAlgorithm(algorithm);
  input = algorithm.input;

  let sidebarContent = Sidebar.getContent();
  sidebarContent.updateAlgorithm(algorithm);
}
