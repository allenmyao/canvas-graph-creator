import Tool from '../tool/tool';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import TraversalAlgorithm from '../algorithm/traversal-algorithm';
import ui from '../ui/ui';

class AlgorithmTool extends Tool {

  sidebarType = 'algorithm';

  currentMode = 'traversal';
  static modes = {
    traversal: TraversalAlgorithm
  };

  optionMap = {
    traversal: {
      label: 'Traversal'
    }
  };

  optionContent = {
    html: '<span class="content"></span>',
    init: (optionElement, mode) => {
      let content = optionElement.querySelector('.content');
      content.textContent = this.optionMap[mode].label;
    }
  };

  currentInput = null;

  get modeInputs() {
    return ui.sidebar.content.curAlgorithm.inputs;
  }

  get modeInputTypes() {
    return ui.sidebar.content.curAlgorithm.inputTypes;
  }

  submitModeInputs() {
    return true;
  }

  submitModeInputsText() {
    return 'Generate results';
  }

  submitModeInputsCallback() {
    ui.sidebar.content.run();
  }

  cancel() {
    this.currentInput = null;
  }

  changeMode(mode) {
    this.currentMode = mode;
    ui.sidebar.content.setAlgorithm(AlgorithmTool.modes[mode]);
  }

  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node || obj instanceof Edge) {
      let inputType = this.modeInputTypes.filter((field) => field.name === this.currentInput.name);
      ui.topBar.updateGraphInput(this.currentInput, obj, !inputType[0].test(obj));
    }
  }

}

export { AlgorithmTool };
export default AlgorithmTool;
