import Tool from '../tool/tool';
import Node from '../data/node/node';
import Label from '../data/label';

class MoveTool extends Tool {

  objStartX;
  objStartY;
  startX;
  startY;

  preDragObject(event, graph, srcObj, x, y) {
    this.startX = x;
    this.startY = y;
    this.objStartX = srcObj.x;
    this.objStartY = srcObj.y;
    return true;
  }

  dragObject(event, graph, obj, x, y) {
    if (obj instanceof Node || obj instanceof Label) {
      obj.setPos(x - (this.startX - this.objStartX), y - (this.startY - this.objStartY));
    }
  }

  dropOnObject(event, graph, droppedObj, destObj, x, y) {
    if (droppedObj instanceof Node && destObj instanceof Node) {
      // stop dragging, and reset to starting position
      this.resetObjectPosition(droppedObj);
    } else {
      this.dropOnNone(event, graph, droppedObj, x, y);
    }
  }

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
