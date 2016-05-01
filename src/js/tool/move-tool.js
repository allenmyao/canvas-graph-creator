import Tool from '../tool/tool';
import Node from '../data/node/node';
import Label from '../data/label';

/**
 * Tool for moving graph objects. No longer used directly.
 * @class MoveTool
 */
class MoveTool extends Tool {

  objStartX;
  objStartY;
  startX;
  startY;

  /**
   * Returns a boolean indicating whether or not the tool should be able to handle dragging. Stores the dragged object location and mouse location.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} srcObj - Dragged graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @return {boolean} - Whether or not the tool should handle dragging.
   * @override
   */
  preDragObject(event, graph, srcObj, x, y) {
    this.startX = x;
    this.startY = y;
    this.objStartX = srcObj.x;
    this.objStartY = srcObj.y;
    return true;
  }

  /**
   * Handler for object dragging. Updates the object's position to the mouse's current position.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Dragged graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  dragObject(event, graph, obj, x, y) {
    if (obj instanceof Node || obj instanceof Label) {
      obj.setPos(x - (this.startX - this.objStartX), y - (this.startY - this.objStartY));
    }
  }

  /**
   * Handler for object dropping on another object. Attempts to drop the dragged object on the object at the mouse's position. If the drop is not allowed, the dragged object is reset to its original position.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} droppedObj - Dropped graph component.
   * @param  {(Node|Edge|Label)} destObj - Graph component that the object was dropped onto.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  dropOnObject(event, graph, droppedObj, destObj, x, y) {
    if (droppedObj instanceof Node && destObj instanceof Node) {
      // stop dragging, and reset to starting position
      this.resetObjectPosition(droppedObj);
    } else {
      this.dropOnNone(event, graph, droppedObj, x, y);
    }
  }

  /**
   * Handler for dropping object on empty space. Attempts to drop the dragged object at the mouse's position. If the drop is not allowed, the dragged object is reset to its original position.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} droppedObj - Dropped graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  dropOnNone(event, graph, droppedObj, x, y) {
    // check for overlap
    if (droppedObj instanceof Node) {
      if (graph.isNodeCollision(droppedObj, x, y)) {
        this.resetObjectPosition(droppedObj);
      } else {
        droppedObj.setPos(x - (this.startX - this.objStartX), y - (this.startY - this.objStartY));
        this.startX = null;
        this.startY = null;
      }
    }
  }

  /**
   * Resets the dragged objects position. This is called when the object cannot be dropped at the current position.
   * @param {(Node|Edge|Label)} object - The object that was dropped.
   */
  resetObjectPosition(object) {
    object.setPos(this.objStartX, this.objStartY);
    this.objStartX = null;
    this.objStartY = null;
    this.startX = null;
    this.startY = null;
  }

}

export { MoveTool };
export default MoveTool;
