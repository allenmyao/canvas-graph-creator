import MoveTool from './move-tool';
import SelectTool from './select-tool';
import Tool from './tool';

/**
 * Tool combining functionality of SelectTool and MoveTool.
 * @class SelectMoveTool
 */
class SelectMoveTool extends Tool {

  sidebarType = 'select';
  selectTool = new SelectTool();
  moveTool = new MoveTool();

  /**
   * Called when switching to a different tool to cancel any incomplete actions. Cancels SelectTool actions.
   */
  cancel() {
    this.selectTool.cancel();
  }

  /**
   * Handler for object selection. Calls selectObject() of SelectTool.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Selected graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  selectObject(event, graph, obj, x, y) {
    this.selectTool.selectObject(...arguments);
  }

  /**
   * Handler for clicking empty space. Calls selectNone() of SelectTool.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  selectNone(event, graph, x, y) {
    this.selectTool.selectNone(...arguments);
  }

  /**
   * Returns a boolean indicating whether or not the tool should be able to handle dragging. Calls preDragObject() of MoveTool.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} srcObj - Dragged graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @return {boolean} - Whether or not the tool should handle dragging.
   */
  preDragObject(event, graph, srcObj, x, y) {
    return this.moveTool.preDragObject(...arguments);
  }

  /**
   * Handler for object dragging. Calls selectObject() of SelectTool and dragObject() of MoveTool.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Dragged graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  dragObject(event, graph, obj, x, y) {
    this.selectTool.selectObject(event, graph, obj, x, y);
    this.moveTool.dragObject(...arguments);
  }

  /**
   * Handler for object dropping on another object. Calls dropOnObject() of MoveTool.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} droppedObj - Dropped graph component.
   * @param  {(Node|Edge|Label)} destObj - Graph component that the object was dropped onto.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  dropOnObject(event, graph, droppedObj, destObj, x, y) {
    this.moveTool.dropOnObject(...arguments);
  }

  /**
   * Handler for dropping object on empty space. Calls dropOnNone() of MoveTool.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} droppedObj - Dropped graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  dropOnNone(event, graph, droppedObj, x, y) {
    this.moveTool.dropOnNone(...arguments);
  }

}

export { SelectMoveTool };
export default SelectMoveTool;
