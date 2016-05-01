import Tool from '../tool/tool';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import TraversalAlgorithm from '../algorithm/traversal-algorithm';
import ui from '../ui/ui';

/**
 * Tool for running algorithms.
 * @class AlgorithmTool
 */
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

  /**
   * Get the mode inputs from the current algorithm.
   * @return {Object.<string,*>} - Object containing stored input values.
   */
  get modeInputs() {
    return ui.sidebar.content.curAlgorithm.inputs;
  }

  /**
   * Get the mode input types from the current algorithm.
   * @return {Array.<InputType>} - Array of input definitions.
   */
  get modeInputTypes() {
    return ui.sidebar.content.curAlgorithm.inputTypes;
  }

  /**
   * Returns a boolean indicating whether or not the mode-specific inputs should be submitted together.
   * @return {boolean} - Whether or not the mode-specific inputs should be submitted together.
   */
  submitModeInputs() {
    return true;
  }

  /**
   * Returns a string that will be displayed on the submit button if submitModeInputs() returns true;
   * @return {string} - Text to display on submit button for mode-specific inputs.
   */
  submitModeInputsText() {
    return 'Generate results';
  }

  /**
   * Callback function that is called after submitting mode-specific inputs.
   */
  submitModeInputsCallback() {
    ui.sidebar.content.run();
  }

  /**
   * Called when switching to a different tool to cancel any incomplete actions. Cancel any active input selection.
   * @override
   */
  cancel() {
    this.currentInput = null;
  }

  /**
   * Called when the mode is changed. Set the algorithm in the sidebar to a new instance of the current algorithm.
   * @param  {string} mode - Mode name.
   * @override
   */
  changeMode(mode) {
    this.currentMode = mode;
    ui.sidebar.content.setAlgorithm(AlgorithmTool.modes[mode]);
  }

  /**
   * Handler for object selection. Used to select graph objects for algorithm inputs.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Selected graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node || obj instanceof Edge) {
      let inputType = this.modeInputTypes.filter((field) => field.name === this.currentInput.name);
      ui.topBar.updateGraphInput(this.currentInput, obj, !inputType[0].test(obj));
    }
  }

}

export { AlgorithmTool };
export default AlgorithmTool;
