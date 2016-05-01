/**
 * Abstract superclass for all tool classes.
 * @class Tool
 */
class Tool {

  sidebarType = 'display';

  currentMode;
  modes;

  optionMap;
  optionContent;

  inputs;
  inputTypes;

  modeInputs;
  modeInputTypes;

  /**
   * Constructs a Tool instance. Should not be called directly.
   * @constructs Tool
   */
  constructor() {}

  /**
   * Returns a boolean indicating whether or not the tool has modes.
   * @return {boolean} - Whether or not the tool has modes.
   */
  hasModes() {
    return typeof this.currentMode !== 'undefined'
        && typeof this.constructor.modes !== 'undefined'
        && typeof this.optionMap !== 'undefined'
        && typeof this.optionContent !== 'undefined';
  }

  /**
   * Returns a boolean indicating whether or not the tool has inputs.
   * @return {boolean} - Whether or not the tool has inputs.
   */
  hasInputs() {
    return typeof this.inputs !== 'undefined'
        && typeof this.inputTypes !== 'undefined';
  }

  /**
   * Returns a boolean indicating whether or not the tool has mode-specific inputs.
   * @return {boolean} - Whether or not the tool has mode-specific inputs.
   */
  hasModeInputs() {
    return typeof this.modeInputs !== 'undefined'
        && typeof this.modeInputTypes !== 'undefined';
  }

  changeMode(mode) {
    this.currentMode = mode;
  }

  /**
   * Called when changing to this tool (if necessary).
   * @abstract
   */
  activate() {}

  /**
   * Called when switching to a different tool to cancel any incomplete actions.
   * @abstract
   */
  cancel() {}

  /**
   * Returns a boolean indicating whether or not the tool should be able to handle selection.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Selected graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @return {boolean} - Whether or not the tool should handle selection.
   */
  preSelectObject(event, graph, obj, x, y) {
    return true;
  }

  /**
   * Returns a boolean indicating whether or not the tool should be able to handle dragging.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} srcObj - Dragged graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @return {boolean} - Whether or not the tool should handle dragging.
   */
  preDragObject(event, graph, srcObj, x, y) {
    return true;
  }

  /**
   * Handler for object selection.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Selected graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  selectObject(event, graph, obj, x, y) {}

  /**
   * Handler for object dragging.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} srcObj - Dragged graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  dragObject(event, graph, srcObj, x, y) {}

  /**
   * Handler for object dropping on another object.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} droppedObj - Dropped graph component.
   * @param  {(Node|Edge|Label)} destObj - Graph component that the object was dropped onto.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  dropOnObject(event, graph, droppedObj, destObj, x, y) {}

  /**
   * [dragOverObject description]
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {[type]} obj    [description]
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  dragOverObject(event, graph, obj, x, y) {
    this.dragNone(event, graph, x, y);
  }

  // mouse events on empty space
  abortSelect(event, graph, x, y) {}
  preSelectNone(event, graph, x, y) {}
  preDragNone(event, graph, x, y) {}
  selectNone(event, graph, x, y) {}
  dragNone(event, graph, x, y) {}
  dropOnNone(event, graph, droppedObj, x, y) {}

}

export { Tool };
export default Tool;
