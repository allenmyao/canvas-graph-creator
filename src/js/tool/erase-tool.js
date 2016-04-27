import { Tool } from '../tool/tool';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';

/**
 * Eraser Tool for removing nodes and edges from the graph using the mouse pointer.
 */
class EraseTool extends Tool {

  name = 'Erase Tool';

   /**
   * Commits to object selection when called by mouse handler
   * @param {Object} event mouse event
   * @param {Object} graph the current graph object
   * @param {Object} obj the selectable object
   * @param {number} x the mouse cursor's x position
   * @param {number} y the mouse cursor's y position
   * @returns {bool} true this tool needs selection data
   */
  preSelectObject(event, graph, obj, x, y) {
    return true;
  }

   /**
   * Refuses to commit to object drag when called by mouse handler
   * @param {Object} event mouse event
   * @param {Object} graph the current graph object
   * @param {Object} srcObj the selectable object
   * @param {number} x the mouse cursor's x position
   * @param {number} y the mouse cursor's y position
   * @returns {bool} false this tool does not need drag data
   */
  preDragObject(event, graph, srcObj, x, y) {
    return false;
  }

   /**
   * Deletes the selected object
   * @param {Object} event mouse event
   * @param {Object} graph the current graph object
   * @param {Object} obj the object to delete
   * @param {number} x the mouse cursor's x position
   * @param {number} y the mouse cursor's y position
   */
  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      graph.removeNode(obj);
    } else if (obj instanceof Edge) {
      graph.removeEdge(obj);
    }
  }

   /**
   * Deletes the dragged-over object
   * @param {Object} event mouse event
   * @param {Object} graph the current graph object
   * @param {Object} obj the object to delete
   * @param {number} x the mouse cursor's x position
   * @param {number} y the mouse cursor's y position
   */
  dragOverObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      graph.removeNode(obj);
    } else if (obj instanceof Edge) {
      graph.removeEdge(obj);
    }
  }

}

export { EraseTool };
export default EraseTool;
