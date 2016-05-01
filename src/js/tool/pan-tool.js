import Tool from '../tool/tool';
import ui from '../ui/ui';

/**
 * Tool for panning the canvas. No longer used directly.
 * @class PanTool
 */
class PanTool extends Tool {

  startPosition = {};

  /**
   * Called before the selectNone() handler. Stores the initial position of the mouse and the display location of the canvas.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  preSelectNone(event, graph, x, y) {
    this.startPosition.dx = ui.canvas.dx;
    this.startPosition.dy = ui.canvas.dy;
    this.startPosition.x = event.clientX;
    this.startPosition.y = event.clientY;
  }

  /**
   * Handler for object dragging. Ignores the object and calls dragNone().
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} srcObj - Dragged graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  dragObject(event, graph, srcObj, x, y) {
    this.dragNone(event, graph, x, y);
  }

  /**
   * Handler for object dropping on another object. Ignores the object and calls dropOnNone().
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} droppedObj - Dropped graph component.
   * @param  {(Node|Edge|Label)} destObj - Graph component that the object was dropped onto.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  dropOnObject(event, graph, droppedObj, destObj, x, y) {
    this.dropOnNone(event, graph, droppedObj, x, y);
  }

  /**
   * Handler for dragging mouse on empty space. Updates the canvas position based on the current mouse position.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  dragNone(event, graph, x, y) {
    let scale = ui.canvas.scale;
    ui.canvas.dx = this.startPosition.dx + (this.startPosition.x - event.clientX) / scale;
    ui.canvas.dy = this.startPosition.dy + (this.startPosition.y - event.clientY) / scale;
    ui.canvas.update();
  }

  /**
   * Handler for dropping object on empty space. Clears the stored mouse and canvas positions.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} droppedObj - Dropped graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  dropOnNone(event, graph, droppedObj, x, y) {
    this.startPosition = {};
  }

}

export { PanTool };
export default PanTool;
