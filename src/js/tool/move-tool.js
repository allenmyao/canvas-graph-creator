import { Tool } from '../tool/tool';
import Node from '../data/node/node';
import Label from '../data/label';

export class MoveTool extends Tool {

  name = 'Move Tool';

  objStartX;
  objStartY;

  preDragObject(event, graph, srcObj, x, y) {
    this.objStartX = srcObj.x;
    this.objStartY = srcObj.y;
    return true;
  }

  dragObject(event, graph, obj, startX, startY, x, y) {
    if (obj instanceof Node || obj instanceof Label) {
      obj.setPos(x, y);
    }
  }

  dropOnObject(event, graph, droppedObj, destObj, startX, startY, x, y) {
    if (droppedObj instanceof Node && destObj instanceof Node) {
      // stop dragging, and reset to starting position
      this.resetObjectPosition(droppedObj);
    } else {
      this.dropOnNone(event, graph, droppedObj, startX, startY, x, y);
    }
  }

  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {
    // check for overlap
    if (droppedObj instanceof Node) {
      if (graph.isNodeCollision(droppedObj, x, y)) {
        this.resetObjectPosition(droppedObj);
      } else {
        droppedObj.setPos(x, y);
      }
    }
  }

  resetObjectPosition(object) {
    object.setPos(this.objStartX, this.objStartY);
    this.objStartX = null;
    this.objStartY = null;
  }

}
